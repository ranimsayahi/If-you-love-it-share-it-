from datetime import timedelta
from flask import Flask 
from flask_smorest import Api 
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_cors import CORS
import os
from Models import *
from db import db 
from Resources.Confessions import blp as confession_blueprint 
from Resources.Personal_story import blp as personal_story_blueprint 
from Resources.User import blp as user_blueprint
from Resources.Recipe import blp as recipe_blueprint

load_dotenv()
BLOCKLIST = set()

def create_app(db_url=None):
    app = Flask(__name__)
    CORS(app)
    #application configuration
    app.config["PROPAGATE_EXCEPTIONS"]= True
    app.config["API_TITLE"]= "If you love it, share it!"
    app.config["API_VERSION"]= "RELEASE 1"
    app.config["OPENAPI_VERSION"]= "3.0.3"
    app.config["OPENAPI_URL_PREFIX"]= "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"]= "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"]= "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    #app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_URL" , "sqlite:///data.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY","ranim2002")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2) 
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)   
    #initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)

    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload):
        """
        Callback function to check if a token is in the blocklist.
        """
        return jwt_payload["jti"] in BLOCKLIST
    
    # Initialize API with schema resolver
    api = Api(app)
    
    #Register Blueprints
    api.register_blueprint(user_blueprint)
    api.register_blueprint(recipe_blueprint)
    api.register_blueprint(personal_story_blueprint)
    api.register_blueprint(confession_blueprint)

    #initialize a db
    with app.app_context():
        db.create_all()
        # Check if the admin already exists
        if not UserModel.query.filter_by(Email="sayahi.ranim@gmail.com").first():
        # Create admin user
            admin = UserModel(
                UserName="RanimSA",
                Email="sayahi.ranim@gmail.com",
                Role="admin"
            )
            admin.set_password("ranim2002")  # Set a secure password for admin
            db.session.add(admin)
            db.session.commit()
            print("Admin account created successfully!")
        else:
            print("Admin account already exists.")

    return app

