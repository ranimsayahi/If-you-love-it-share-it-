from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import get_jwt, jwt_required, get_jwt_identity
from db import db
from Models import ConfessionsModel
from schemas import ConfessionSchema

blp = Blueprint("Confessions", "confessions", description="Operations on confessions")

#get a confession by ID
@blp.route("/confession/<int:confession_id>")
class Confession(MethodView):
    @jwt_required()
    @blp.response(200, ConfessionSchema)
    def get(self, confession_id):
        current_user_id = int(get_jwt_identity())
        jwt_payload = get_jwt()
        current_role = jwt_payload.get("role", None)
        confession = ConfessionsModel.query.get_or_404(confession_id)

        if current_role != "admin" and confession.Status != "approved":
            abort(403, message="You are not authorized to view this confession.")


        return {
            "ID": confession.ID,
            "Admission": confession.Admission,
            "UserID": confession.UserID,
            "Timestamp": confession.Timestamp,
            "Status": confession.Status,

        }    
    
#Update a confession
    @jwt_required()  # Ensure the user is authenticated
    @blp.arguments(ConfessionSchema)
    @blp.response(200, ConfessionSchema)
    def put(self, confession_data, confession_id):
        confession = ConfessionsModel.query.get_or_404(confession_id)
        current_user_id = int(get_jwt_identity())
        jwt_payload = get_jwt()

    # Check if role exists in the JWT payload
        current_role = jwt_payload.get("role", None)

        # Only allow the owner of the confession and admin to edit
        if confession.UserID != current_user_id and current_role != "admin":
            abort(403, message="You are not authorized to update this confession.")

        confession.Admission = confession_data.get("Admission", confession.Admission)
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback() 
            abort(500, message="An error occurred while updating the confession.")
        return {
            "ID": confession.ID,
            "Admission": confession.Admission,
            "UserID": confession.UserID,
            "Timestamp": confession.Timestamp,
            "Status": confession.Status,

        }
    
#delete a confession
    @jwt_required()  # Ensure the user is authenticated
    def delete(self, confession_id):
        confession = ConfessionsModel.query.get_or_404(confession_id)
        current_user_id = int(get_jwt_identity())
        jwt_payload = get_jwt()
        current_role = jwt_payload.get("role", None)


        # Only allow the owner of the confession and admin to delete
        if confession.UserID != current_user_id and current_role != "admin":
            abort(403, message="You are not authorized to delete this confession.")

        try:
            db.session.delete(confession)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()          
            abort(500, message="An error occurred while deleting the confession.")
        return {"message": "Confession deleted successfully."}, 200

#get all confessions
@blp.route("/confession")
class ConfessionList(MethodView):
    @jwt_required()
    @blp.response(200, ConfessionSchema(many=True))
    def get(self):
        current_user_id = int(get_jwt_identity())
        jwt_payload = get_jwt()
        current_role = jwt_payload.get("role", None)
        query = ConfessionsModel.query

        if current_role != "admin":
            query = query.filter(ConfessionsModel.Status == "approved")

        confessions = query.all()

        return [
            {
                "ID": confession.ID,
                "Admission": confession.Admission,
                "UserID": confession.UserID,
                "Timestamp": confession.Timestamp,
                "Status": confession.Status,

            }
            for confession in confessions
        ]
    
#post a confession
    @jwt_required()  # Ensure the user is authenticated
    @blp.arguments(ConfessionSchema)
    @blp.response(201, ConfessionSchema)
    def post(self, confession_data):
        current_user_id = int(get_jwt_identity())
        confession = ConfessionsModel(UserID=current_user_id,Status="pending", **confession_data)


        try:
            db.session.add(confession)
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while adding the confession.")
        return {
            "ID": confession.ID,
            "Admission": confession.Admission,
            "UserID": confession.UserID,
            "Timestamp": confession.Timestamp,
            "Status": confession.Status,

        },201 
    
#search for a confession by one or more criterias   
@blp.route("/confession/search")
class ConfessionSearch(MethodView):
    @jwt_required()
    @blp.response(200, ConfessionSchema(many=True))
    def get(self):
        current_user_id = int(get_jwt_identity())
        jwt_payload = get_jwt()
        current_role = jwt_payload.get("role", None)
        # Get search parameters from the query string
        keyword = request.args.get("keyword", "").strip()
        user_id = request.args.get("user_id", type=int)

        query = ConfessionsModel.query

        if keyword:
            query = query.filter(ConfessionsModel.Admission.ilike(f"%{keyword}%"))
        if user_id:
            query = query.filter(ConfessionsModel.UserID == user_id)

        if current_role != "admin":
            query = query.filter(ConfessionsModel.Status == "approved")

        confessions = query.all()
        if not confessions:
            return [], 200    
        return [
            {
                "ID": confession.ID,
                "Admission": confession.Admission,
                "UserID": confession.UserID,
                "Timestamp": confession.Timestamp,
                "Status": confession.Status,
               
            }
            for confession in confessions
        ]
    
#approve confession
@blp.route("/confession/<int:confession_id>/approve")
class ApproveConfession(MethodView):
    @jwt_required()
    def put(self, confession_id):
        current_user_id = int(get_jwt_identity())
        jwt_payload = get_jwt()
        current_role = jwt_payload.get("role", None)

        # Check if the current user is an admin
        if current_role != "admin":
            abort(403, message="You are not authorized to approve confessions.")

        confession = ConfessionsModel.query.get_or_404(confession_id)

        # Update status to approved
        confession.Status = "approved"
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while approving the confession.")

        return {
            "message": "Confession approved successfully.",
            "confession_id": confession.ID,
            "status": confession.Status,
        }, 200

#reject confession
@blp.route("/confession/<int:confession_id>/reject")
class RejectConfession(MethodView):
    @jwt_required()
    def put(self, confession_id):
        current_user_id = int(get_jwt_identity())
        jwt_payload = get_jwt()
        current_role = jwt_payload.get("role", None)

        # Check if the current user is an admin
        if current_role != "admin":
            abort(403, message="You are not authorized to reject confessions.")

        confession = ConfessionsModel.query.get_or_404(confession_id)

        # Update status to rejected
        confession.Status = "rejected"
        try:
            db.session.commit()
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred while rejecting the confession.")

        return {
            "message": "Confession rejected successfully.",
            "confession_id": confession.ID,
            "status": confession.Status,
        }, 200
