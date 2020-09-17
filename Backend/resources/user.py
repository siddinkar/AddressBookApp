#
# This file contains all the definitions for the api requests a user on the addressBook application might make
#
#
#
#
#
#




from flask_restful import Resource
from flask import request, jsonify, make_response
from Model import db, User, UserSchema, Contact, ContactSchema
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import time
from functools import wraps

users_schema = UserSchema(many=True)  # to GET all users
user_schema = UserSchema()  # accessing one user to POST

contacts_schema = ContactSchema(many=True)  # to GET all users
contact_schema = ContactSchema()  # accessing one user to POST

# this is the decorator definition that requires a token for all api requests
def token_required(f):
    # defines this func as 'wrapping' f
    @wraps(f)
    def decorated(*args, **kwargs):
        # add token from request header
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return {"message": "No token"}, 401
        # check token validity
        try:
            data = jwt.decode(token, "thisissecret")
            current_user = User.query.filter_by(
                public_id=data['public_id']).first()
        #if token invalid
        except:
            return {"message": "you do not have the right permissions on your account"}, 401
        # return func output
        return f(current_user, *args, **kwargs)

    return decorated

# for all the user related requests
class Users(Resource):
    # get user by token and current id
    @token_required
    def get(self, current_user, public_id):
        # filter by 'current user's public id
        user = User.query.filter_by(public_id=public_id).first()
        if not user:
            return {'message': 'No user found'}, 400

        user = user_schema.dump(user).data
        return {'status': 'success', 'data': user}, 200


# this class is for creating a user 
class CreateUser(Resource):
    # inaccessible in app (for api testing purposes only)
    # filter for all users in database
    @token_required
    def get(self, current_user):
        users = User.query.all()
        users = users_schema.dump(users).data
        return {'status': 'success', 'data': users}, 200

    # for creating a user
    def post(self):
        # requires json body on req
        # inputs: username + password
        json_data = request.get_json(force=True)
        if not json_data:
            return {'message': 'No input data provided'}, 400

        # check data for errors
        data, errors = user_schema.load(json_data)
        if errors:
            return errors, 422

        # check if user already exists
        user = User.query.filter_by(username=data['username']).first()
        if user:
            return {'message': 'User already exists'}, 400

        # save encrypted password
        hashed_password = generate_password_hash(
            data['password'], method='sha256')

        # create user obj in db
        user = User(
            public_id=str(uuid.uuid4()),
            username=json_data['username'],
            password=hashed_password
        )

        # add to db
        db.session.add(user)
        db.session.commit()

        result = user_schema.dump(user).data

        return {"status": 'success', 'data': result}, 201

# this class if for auth functionality
class Login(Resource):
    def get(self):
        # global vars
        auth = request.authorization
        d = datetime.datetime.utcnow(
        ) + datetime.timedelta(days=10)
        for_js = d.isoformat()
        print(for_js)

        # check if request has info in auth header
        if not auth or not auth.username or not auth.password:
            return {"message": "Please enter authorization information"}, 401

        # check if user with given username exists
        user = User.query.filter_by(username=auth.username).first()
        if not user:
            return {"message": "User not found"}, 401

        # check if password for given username is valid
        if check_password_hash(user.password, auth.password):
            # create token 
            token = jwt.encode(
                {'public_id': user.public_id, 'exp': d}, "thisissecret")
            # send token back to client
            return {'token': token.decode('UTF-8'), 'expiresIn': for_js}
        # if any fail
        return {"message": "Incorrect password entered for user"}, 401

# for contact api requests
class Contacts(Resource):
    # get all contacts for a specific user (specific user is determined by token sent)
    @token_required
    def get(current_user, self):
        data = {}
        # filter contacts by user id
        all_user_contacts = Contact.query.filter_by(
            user_id=current_user.id).all() 
        # add contacts to dictionary
        for obj in all_user_contacts:
            contact = contact_schema.dump(obj).data
            data.update({contact['public_id']: contact})
        # send dictionary as JSON data
        return data, 200

    # create a contact
    @token_required
    def post(current_user, self):
        # requires JSON body in req
        json_data = request.get_json(force=True)
        print(json_data)
        if not json_data:
            return {'message': 'No input data provided'}, 400

        # create obj based on JSON body data
        contact = Contact(
            user_id=current_user.id,
            public_id=str(uuid.uuid4()),
            name=json_data['name'],
            phone=json_data['phone'],
            isFav=json_data['isFav'],
            email=json_data['email'],
            address=json_data['address'],
            notes=json_data['notes']
        )
         
        # add above obj to database
        db.session.add(contact)
        db.session.commit()

        data = contact_schema.dump(contact).data

        return {'data': data}, 201

    # update contact 
    @token_required
    def put(current_user, self):
        # requires JSON body in req
        json_data = request.get_json(force=True)
        if not json_data:
            return {'message': 'No input data provided'}, 400

        # filter for contact by its ocntact id and the users user id
        contact = Contact.query.filter_by(
            public_id=json_data['public_id'], user_id=current_user.id).first()

        if not contact:
            return {'message': 'You cannot modify this contact'}, 400

        columns = ["name", "phone", "isFav", "email", "address", "notes"]

        # parse JSON data from request body to see which columns must be edited
        for key in json_data:
            if key == columns[0]:
                contact.name = json_data['name']
            elif key == columns[1]:
                contact.phone = json_data['phone']
            elif key == columns[2]:
                contact.isFav = json_data['isFav']
            elif key == columns[3]:
                contact.email = json_data['email']
            elif key == columns[4]:
                contact.address = json_data['address']
            elif key == columns[5]:
                contact.notes = json_data['notes']

        # commite changes to db
        db.session.commit()

        data = contact_schema.dump(contact).data

        return {'data': data}, 204
    
    # delete user from db
    @token_required
    def delete(current_user, self):
        # requires JSON data in body of req
        json_data = request.get_json(force=True)
        if not json_data:
            return {'message': 'No input data provided'}, 400
        # filter for contact
        contact = Contact.query.filter_by(
            public_id=json_data['public_id'], user_id=current_user.id).first()

        if not contact:
            return {'message': 'You cannot delete this contact'}, 400

        # delete contact
        db.session.delete(contact)
        db.session.commit()

        return {"status": 'success'}, 204
