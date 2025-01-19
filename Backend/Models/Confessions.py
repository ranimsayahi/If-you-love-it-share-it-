#create Confessions Model
from db import db
class ConfessionsModel(db.Model):
    __tablename__ = "Confession"
    ID = db.Column(db.Integer, primary_key=True)
    Admission= db.Column(db.Text, nullable=False)
    UserID = db.Column(db.Integer, db.ForeignKey('User.ID', ondelete="CASCADE"), nullable=False)
    Timestamp = db.Column(db.DateTime, default=db.func.now())  
    Status = db.Column(db.String(20), default="pending", nullable=False)  

# Relationship with User model
    User = db.relationship(
        'UserModel',
        back_populates='Confessions',
        lazy=True
    )
    
#make sure the admission is not empty
    @staticmethod
    def validate_admission(admission):
         if not admission.strip():
            raise ValueError("Admission cannot be empty.")
         
    def __repr__(self):
        return f"<Confession {self.ID} by User {self.UserID}>"

