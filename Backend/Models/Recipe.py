#create recipe Model
from db import db

class RecipeModel(db.Model):
    __tablename__ = "Recipe"
    Allowed_Emotions = ["Comfort", "Nostalgia", "Joy", "Celebration", "Adventure", "Homesickness", "Love"]
    ID = db.Column(db.Integer, primary_key=True)
    RecipeName = db.Column(db.String(80), unique=False, nullable=False)
    Ingredients = db.Column(db.Text, nullable=False)
    Steps = db.Column(db.Text, nullable=False)
    Region = db.Column(db.String(50), nullable=True)  
    Emotion = db.Column(db.String(50), nullable=True)
    Status = db.Column(db.String(20), default="pending", nullable=False)  
     
    Stories = db.relationship("PersonalStoryModel", back_populates="Recipe", lazy="select",cascade="all, delete-orphan")  # Allows dynamic querying for stories
    UserID = db.Column(db.Integer, db.ForeignKey("User.ID", ondelete="CASCADE"), nullable=False)
    User = db.relationship("UserModel", back_populates="Recipes", lazy=True)

    Status = db.Column(db.String(20), default="pending", nullable=False)
#db level
    __table_args__ = (
        db.CheckConstraint(
            f"Emotion IN ({', '.join([repr(e) for e in Allowed_Emotions])})",
            name="check_emotion"
        ),
    )
    
    # Validate emotion_tag
    @staticmethod
    def validate_emotion(Emotion):
        if Emotion not in RecipeModel.Allowed_Emotions:
            raise ValueError(f"Invalid emotion tag: {Emotion}. Must be one of {RecipeModel.Allowed_Emotions}.")

    def __repr__(self):
        return f"<Recipe {self.RecipeName}>"