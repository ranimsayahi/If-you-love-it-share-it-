#create Personal Story Model
from datetime import datetime
from db import db
class PersonalStoryModel(db.Model):
    __tablename__ = "PersonalStory" 
    ID = db.Column(db.Integer, primary_key=True)
    RecipeID = db.Column(db.Integer, db.ForeignKey('Recipe.ID', ondelete="CASCADE"), nullable=False)
    UserID = db.Column(db.Integer, db.ForeignKey('User.ID', ondelete="CASCADE"), nullable=False)
    Content = db.Column(db.Text, nullable=False)
    Timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)  

    Recipe = db.relationship('RecipeModel', back_populates='Stories', lazy=True)
    User = db.relationship('UserModel',  back_populates='Stories', lazy=True)

    #to prevent duplicate stories by the same user for the same recipe
    __table_args__ = (
    db.UniqueConstraint('RecipeID', 'UserID', name='unique_user_recipe_story'),
    )

    #to make sure content is not empty
    @staticmethod
    def validate_content(content):
        if not content.strip():
             raise ValueError("Content cannot be empty.")
        
    def __repr__(self):
        return f"<Story by User {self.UserID} for Recipe {self.RecipeID}>"
    