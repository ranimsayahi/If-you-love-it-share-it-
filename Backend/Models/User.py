
#create user Model
import bcrypt
from db import db
class UserModel(db.Model):
    __tablename__ = "User"
    ALLOWED_ROLES = ["user", "admin"]

    ID = db.Column(db.Integer, primary_key=True)
    UserName = db.Column(db.String(80), unique=False, nullable=False)
    Email = db.Column(db.String(120), nullable=False, unique=True)
    Password = db.Column(db.String(128), nullable=False)
    Role = db.Column(db.String(10), nullable=False, default='user')  

    Recipes = db.relationship("RecipeModel", back_populates="User", lazy="dynamic", cascade="all, delete-orphan")
    Stories = db.relationship("PersonalStoryModel", back_populates="User", lazy="dynamic", cascade="all, delete-orphan")
    Confessions = db.relationship("ConfessionsModel", back_populates="User", lazy="dynamic", cascade="all, delete-orphan")
    
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

# Method to set password
    def set_password(self, password):
        #Hashes and sets the password using Bcrypt
        self.Password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    # Method to check if password is correct
    def check_password(self, password):
        #Checks if the given password matches the stored password
        return bcrypt.checkpw(password.encode('utf-8'), self.Password.encode('utf-8'))


#bcrypt automatically generates a unique salt for each password, ensuring that identical passwords produce different hashes.

    @staticmethod
    def validate_role(role):
        if role not in UserModel.ALLOWED_ROLES:
            raise ValueError(f"Invalid role: {role}. Must be one of {UserModel.ALLOWED_ROLES}.")
 
    
    #identify the user by their username when debugging exp when you print user itll be user RanimSayahi.
    def __repr__(self):
        return f"<User {self.UserName}>"
    
