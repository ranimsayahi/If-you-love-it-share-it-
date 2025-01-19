from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import  get_jwt, jwt_required, get_jwt_identity
from Models.User import UserModel
from db import db
from Models import RecipeModel
from schemas import RecipeSchema, RecipeUpdateSchema, RecipePatchSchema

blp = Blueprint("Recipes", "recipes", description="Operations on recipes")

@blp.route("/recipe/<int:recipe_id>")
#get recipe by ID
class Recipe(MethodView):
    @jwt_required()
    @blp.response(200, RecipeSchema)
    def get(self, recipe_id):
        current_user_id = int(get_jwt_identity())
        jwt_payload = get_jwt()
        current_role = jwt_payload.get("role", None)
        recipe = RecipeModel.query.get_or_404(recipe_id)
        if current_role != "admin" and recipe.Status != "approved":
            abort(403, message="You are not authorized to view this recipe.")        
        
        
        return recipe    
    
#delete recipe by id
    @jwt_required()  # Protect the delete route with authentication
    def delete(self, recipe_id):
        # Get the current user's identity (e.g., user ID or username from the JWT token)
        current_user_id = int(get_jwt_identity())   
        jwt_payload = get_jwt()
        current_role = jwt_payload.get("role", None)     
    #fetch recipe
        recipe = RecipeModel.query.get_or_404(recipe_id)

        # Check if the user is an admin
        if recipe.UserID != current_user_id and current_role != "admin":
            abort(403, message="You do not have permission to delete this recipe.")  # Forbidden
        
        # Proceed with recipe deletion
        try:
            db.session.delete(recipe)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while deleting the recipe.")
        return {"message": "Recipe deleted successfully."},200
    
#Put: update a recipe by id
    @jwt_required() 
    @blp.arguments(RecipeUpdateSchema)
    @blp.response(200, RecipeSchema)
    def put(self, recipe_data, recipe_id):
        current_user_id = int(get_jwt_identity())
        jwt_payload = get_jwt()
        current_role = jwt_payload.get("role", None)  
        recipe = RecipeModel.query.get(recipe_id)
        
        if not recipe:
            abort(404, message="Recipe not found.")

        if recipe.UserID != current_user_id and current_role != "admin":
            abort(403, message="You are not authorized to update this recipe.")

        for key, value in recipe_data.items():
            setattr(recipe, key, value)

        try:    
            db.session.add(recipe)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while updating the recipe.")
        return recipe
    
#Patch : Update partially a recipe
    @jwt_required()  # Ensure the user is authenticated
    @blp.arguments(RecipePatchSchema)
    @blp.response(200, RecipeSchema)
    def patch(self, recipe_data, recipe_id):
        # Fetch the recipe by ID
        recipe = RecipeModel.query.get_or_404(recipe_id)

        # Get the current user's identity
        current_user_id = int(get_jwt_identity())
        jwt_payload = get_jwt()
        current_role = jwt_payload.get("role", None) 

        # Check if the current user is the owner of the recipe or an admin
        if recipe.UserID != current_user_id and current_role != "admin":
            abort(403, message="You are not authorized to update this recipe.")

        # Update only provided fields
        for key, value in recipe_data.items():
            setattr(recipe, key, value)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while updating the recipe.")
        
        return recipe
   
#search for recipe based on one or more criterias
@blp.route("/recipe/search")
class RecipeSearch(MethodView):
    @jwt_required() 
    @blp.response(200, RecipeSchema(many=True))
    def get(self):

        current_user = int(get_jwt_identity())
        is_admin = False
        if current_user:
            user = UserModel.query.get(current_user)
            is_admin = user.Role == "admin"

        # Get search parameters from the query string
        keyword = request.args.get("keyword", "").strip()
        emotion = request.args.get("emotion", "").strip()
        region = request.args.get("region", "").strip()
        ingredients = request.args.get("ingredients", "").strip()


        query = RecipeModel.query

        if keyword:
            query = query.filter(RecipeModel.RecipeName.ilike(f"%{keyword}%"))
        if emotion:
            query = query.filter(RecipeModel.Emotion.ilike(f"%{emotion}%"))
        if region:
            query = query.filter(RecipeModel.Region.ilike(f"%{region}%"))
        if ingredients:
            query = query.filter(RecipeModel.Ingredients.ilike(f"%{ingredients}%"))

        # Limit visibility for regular users
        if not is_admin:
            query = query.filter(RecipeModel.Status == "approved")

        recipes = query.all()
        if not recipes:
            return [], 200        
        return recipes

@blp.route("/recipe")
class RecipeList(MethodView):
    #get all recipes
    @jwt_required() 
    @blp.response(200, RecipeSchema(many=True))
    def get(self):

        current_user = int(get_jwt_identity())
        is_admin = False
        if current_user:
            user = UserModel.query.get(current_user)
            is_admin = user.Role == "admin"

        query = RecipeModel.query

        # Filter by status for regular users
        if not is_admin:
            query = query.filter(RecipeModel.Status == "approved")        
        
        recipes = query.all()
        return recipes

    
    #create a new recipe
    @jwt_required()  # Ensure only authenticated users can create recipes
    @blp.arguments(RecipeSchema)
    @blp.response(201, RecipeSchema)
    def post(self, recipe_data):
        current_user_id = int(get_jwt_identity())

    # Check if a recipe with the same name and ingredients already exists
        ExistingRecipe = RecipeModel.query.filter(
            RecipeModel.RecipeName.ilike(recipe_data["RecipeName"]),
            RecipeModel.Ingredients.ilike(recipe_data["Ingredients"])
        ).first()

        if ExistingRecipe:
            abort(409, message="A recipe with the same name and ingredients already exists.") #conflict error
    
    # If no existing recipe, proceed to add the new recipe
        #recipe = RecipeModel(UserID=current_user["id"], **recipe_data)

        recipe = RecipeModel(
        UserID=current_user_id,
        Status="pending",  # Set default status to 'pending'
        **recipe_data
        )
        try:

            db.session.add(recipe)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while inserting the recipe.")
    
        return recipe
    
@blp.route("/recipe/<int:recipe_id>/approve")
class ApproveRecipe(MethodView):
    @jwt_required()  # Ensure only authenticated users can access
    def put(self, recipe_id):
        current_user_id = int(get_jwt_identity())
        admin_user = UserModel.query.get_or_404(current_user_id)

        # Check if the current user is an admin
        if  admin_user.Role != "admin":
            abort(403, message="You are not authorized to approve recipes.")

        recipe = RecipeModel.query.get_or_404(recipe_id)

        # Update the status to 'approved'
        recipe.Status = "approved"
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while approving the recipe.")

        return {"message": "Recipe approved successfully.", "recipe_id": recipe.ID, "status": recipe.Status}, 200


@blp.route("/recipe/<int:recipe_id>/reject")
class RejectRecipe(MethodView):
    @jwt_required()  # Ensure only authenticated users can access
    def put(self, recipe_id):
        current_user_id = int(get_jwt_identity())
        admin_user = UserModel.query.get_or_404(current_user_id)

        # Check if the current user is an admin
        if admin_user.Role != "admin":
            abort(403, message="You are not authorized to reject recipes.")

        recipe = RecipeModel.query.get_or_404(recipe_id)

        # Update the status to 'rejected'
        recipe.Status = "rejected"
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while rejecting the recipe.")

        return {"message": "Recipe rejected successfully.", "recipe_id": recipe.ID, "status": recipe.Status}, 200

    
