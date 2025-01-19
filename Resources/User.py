from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity,get_jwt
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from db import db
from Models import UserModel  
from schemas import UserSchema  
from werkzeug.security import generate_password_hash, check_password_hash

blp = Blueprint("Users", "users", description="Operations on user accounts")
BLOCKLIST = set()

# user registration (POST)
@blp.route("/register")
class UserRegister(MethodView):
    @blp.arguments(UserSchema)
    @blp.response(201, UserSchema)
    def post(self, user_data):
        """
        A user registers a new account.
        """
        # Check if the email already exists
        if UserModel.query.filter_by(Email=user_data["Email"]).first():
            abort(409, message="A user with this email already exists.")
        
        
        # Create a new user instance
        user = UserModel(
            UserName=user_data["UserName"],
            Email=user_data["Email"]
        )
        # Hash the password before saving
        user.set_password(user_data["Password"])        
        try:
            db.session.add(user)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while creating the user.")
        return user

# user login (POST)
@blp.route("/login")
class UserLogin(MethodView):
    @blp.arguments(UserSchema(partial=("UserName",)))    
    def post(self, user_data):
        """
        A user logs in.
        """
        # Find user by email
        user = UserModel.query.filter_by(Email=user_data["Email"]).first()
        if not user or not user.check_password(user_data["Password"]):
            abort(401, message="Invalid credentials. Please check your email or password.")
        
        # Generate a JWT token for the user
        #access_token = create_access_token(identity={"id": user.ID, "role": user.Role})
        access_token = create_access_token(identity=str(user.ID),
                                           additional_claims={"role": user.Role}  # Add role to the token as a custom claim
                                            )

        return {"access_token": access_token}, 200

   
@blp.route("/profile")
class UserProfile(MethodView):
    @jwt_required()
    def get(self):
        """
        Access current user's profile info.
        """
        #current_user = parse_identity(get_jwt_identity())
        current_user_id = get_jwt_identity()  # Get user ID from the token (as string)

        if not current_user_id:
            abort(401, message="Invalid token. Please log in again.")

        # Fetch user from the database
        #user = UserModel.query.get_or_404(current_user["id"])
        user = UserModel.query.get_or_404(int(current_user_id))  # Convert to int if needed
        return {
            "ID": user.ID,
            "UserName": user.UserName,
            "Email": user.Email,
            "Role": user.Role,
        }, 200

# Update the logged-in user's profile
@blp.route("/profile")
class UserProfileUpdate(MethodView):
    @jwt_required()  # Ensure the user is logged in
    @blp.arguments(UserSchema(partial=True))  # Partial schema allows selective updates
    @blp.response(200, UserSchema)
    def put(self, user_data):
        """
        Update current user's credentials.
        """
        current_user_id = get_jwt_identity()        
        user = UserModel.query.get_or_404(int(current_user_id))  
        #current_user = parse_identity(get_jwt_identity())
        #user = UserModel.query.get_or_404(current_user["id"])

        # Update user details, except for password (can be handled separately)
        if "UserName" in user_data:
            user.UserName = user_data["UserName"]
         # Ensure email is unique
        if "Email" in user_data:
            if UserModel.query.filter(UserModel.Email == user_data["Email"], UserModel.ID != user.ID).first():
                abort(409, message="A user with this email already exists.")
            user.Email = user_data["Email"]
        if "Password" in user_data:
            user.set_password(user_data["Password"])
        
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while updating the user.")
        
        return user

# delete the logged-in user's profile
@blp.route("/profile")
class UserProfileDelete(MethodView):
    @jwt_required()  # Ensure the user is logged in
    def delete(self):
        """
        Delete current user.
        """
        current_user_id = get_jwt_identity()  # Get logged-in user's ID
        user = UserModel.query.get_or_404(int(current_user_id))
        #current_user = parse_identity(get_jwt_identity())
        #user = UserModel.query.get_or_404(current_user["id"])

        try:
            db.session.delete(user)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while deleting the user.")
        
        return {"message": "User deleted successfully."}, 200
    

    # User logout
    @blp.route("/logout")
    class UserLogout(MethodView):
        @jwt_required()
        def post(self):
            """
            User logs out from current session.
            """
            jti = get_jwt()["jti"]
            BLOCKLIST.add(jti)
            return {"message": "Successfully logged out."}, 200 


@blp.route("/users")
class UserList(MethodView):
    @jwt_required()
    @blp.response(200, UserSchema(many=True))
    def get(self):
        """
        Get a list of all users.
        """
        current_user = get_jwt_identity()
        current_role = get_jwt().get("role")        
        if current_role != "admin":
            abort(403, message="You are not authorized to view all users.")

        try:
            users = UserModel.query.all()
            return users
        except SQLAlchemyError as e:
            print(f"Error fetching users: {e}")
            abort(500, message="An error occurred while retrieving users.")