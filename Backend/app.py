from flask import Blueprint
from flask_restful import Api
from resources.user import CreateUser, Users, Login, Contacts


api_bp = Blueprint('api', __name__)
api = Api(api_bp)

# Route
api.add_resource(CreateUser, '/users')
api.add_resource(Login, '/login')
api.add_resource(Users, '/users/<public_id>')
api.add_resource(Contacts, '/contacts')
