from flask import Flask, jsonify
from flask_restful import Api
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import app_config
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import jwt_required

# app.config.from_object(os.environ['APP_SETTINGS'])
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


app = Flask(__name__)
api = Api(app)
app.config.from_object(app_config["testing"])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
CORS(app,resources={r"/api/*": {"origins": "http://localhost:8080"}})
# CORS(app)
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)
# db.create_all()
with app.app_context():
    print(app.url_map)

from .routes import assignments
from .routes import consultants
from .routes import scenarios
from .routes import analysis