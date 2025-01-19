from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from db import db
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from Models import PersonalStoryModel, RecipeModel
from schemas import PersonalStorySchema

blp = Blueprint("PersonalStories", "personalstories", description="Operations on personal stories")

#Get personal story by ID
@blp.route("/personalstory/<int:story_id>")
class PersonalStory(MethodView):
    @blp.response(200, PersonalStorySchema)
    @jwt_required()
    def get(self, story_id):
        jwt_payload = get_jwt()
        current_role = jwt_payload.get("role", None)
        story = PersonalStoryModel.query.get_or_404(story_id)

        if current_role != "admin":
            recipe = RecipeModel.query.get(story.RecipeID)
            if not recipe or recipe.Status != "approved":
                abort(403, message="You are not authorized to view this story.")
                
        return {
            "ID": story.ID,
            "Content": story.Content,
            "UserID": story.UserID,
            "RecipeID": story.RecipeID,
            "Timestamp": story.Timestamp,
        }
    
#Update a personal story by ID
    @jwt_required()  # Ensure the user is authenticated
    @blp.arguments(PersonalStorySchema)
    @blp.response(200, PersonalStorySchema)
    def put(self, story_data, story_id):
        story = PersonalStoryModel.query.get_or_404(story_id)
        jwt_payload = get_jwt()
        current_user_id = int(get_jwt_identity())
        current_role = jwt_payload.get("role", None)

        # Only allow the owner of the story or the admin to edit
        if story.UserID != current_user_id and current_role != "admin":
            abort(403, message="You are not authorized to update this story.")

        story.Content = story_data.get("Content", story.Content)

        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while updating the story.")
        return story

#Delete a personal story
    @jwt_required()  # Ensure the user is authenticated
    def delete(self, story_id):
        story = PersonalStoryModel.query.get_or_404(story_id)
        jwt_payload = get_jwt()
        current_user_id = int(get_jwt_identity())
        current_role = jwt_payload.get("role", None)

        # Check if the current user is an admin or owner of story
        if story.UserID != current_user_id and current_role != "admin":
            abort(403, message="Only admins or story owners can delete stories.")

        try:
            db.session.delete(story)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()  
            abort(500, message="An error occurred while deleting the story.")

        return {"message": "Story deleted successfully."}, 200

#get all personal stories
@blp.route("/personalstory")
class PersonalStoryList(MethodView):
    @jwt_required()
    @blp.response(200, PersonalStorySchema(many=True))
    def get(self):
        jwt_payload = get_jwt()
        current_role = jwt_payload.get("role", None)

        query = PersonalStoryModel.query

        if current_role != "admin":
            query = query.join(RecipeModel, RecipeModel.ID == PersonalStoryModel.RecipeID).filter(RecipeModel.Status == "approved")

        stories = query.all()
        return [
            {
                "ID": story.ID,
                "Content": story.Content,
                "UserID": story.UserID,
                "RecipeID": story.RecipeID,
                "Timestamp": story.Timestamp,
            }
            for story in stories
        ]
    
#Create a new story
    @jwt_required()  # Ensure the user is authenticated
    @blp.arguments(PersonalStorySchema)
    @blp.response(201, PersonalStorySchema)
    def post(self, story_data):
        current_user_id = int(get_jwt_identity())
        jwt_payload = get_jwt()
        current_role = jwt_payload.get("role", None)

        # Validate the recipe ID
        recipe = RecipeModel.query.get(story_data["RecipeID"])
        if not recipe:
             abort(404, message="Recipe not found.")
        if current_role != "admin" and recipe.Status != "approved":
            abort(403, message="You are not authorized to create a story for this recipe.")
        # Validate the recipe ID and user ID
        story = PersonalStoryModel(UserID=current_user_id, **story_data)
        
        try:
            db.session.add(story)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while adding the story.")
        return {
            "ID": story.ID,
            "Content": story.Content,
            "UserID": story.UserID,
            "RecipeID": story.RecipeID,
            "Timestamp": story.Timestamp,
        }, 201 
    
#search for personal stories based on one or more criterias
@blp.route("/personalstory/search")
class PersonalStorySearch(MethodView):
    @blp.response(200, PersonalStorySchema(many=True))
    @jwt_required()

    def get(self):
        jwt_payload = get_jwt()
        current_role = jwt_payload.get("role", None)

        # Get search parameters from the query string      
        keyword = request.args.get("keyword", "").strip()
        user_id = request.args.get("user_id", type=int)
        recipe_id = request.args.get("recipe_id", type=int)

        query = PersonalStoryModel.query

        if keyword:
            query = query.filter(PersonalStoryModel.Content.ilike(f"%{keyword}%"))
        if user_id:
            query = query.filter(PersonalStoryModel.UserID == user_id)
        if recipe_id:
            query = query.filter(PersonalStoryModel.RecipeID == recipe_id)
            
        if current_role != "admin":
            query = query.join(RecipeModel, RecipeModel.ID == PersonalStoryModel.RecipeID)\
                         .filter(RecipeModel.Status == "approved")

        stories = query.all()

        if not stories:
            return [], 200    
        return [
            {
                "ID": story.ID,
                "Content": story.Content,
                "UserID": story.UserID,
                "RecipeID": story.RecipeID,
                "Timestamp": story.Timestamp,
            }
            for story in stories
        ]