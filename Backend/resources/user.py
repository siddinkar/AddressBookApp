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


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return {"message": "No token"}, 401

        try:
            data = jwt.decode(token, "thisissecret")
            current_user = User.query.filter_by(
                public_id=data['public_id']).first()
        except:
            return {"message": "you do not have the right permissions on your account"}, 401

        return f(current_user, *args, **kwargs)

    return decorated


class Users(Resource):
    # inaccessible
    @token_required
    def get(self, current_user, public_id):
        user = User.query.filter_by(public_id=public_id).first()
        if not user:
            return {'message': 'No user found'}, 400

        user = user_schema.dump(user).data
        return {'status': 'success', 'data': user}, 200


class CreateUser(Resource):
    # inaccessible
    @token_required
    def get(self, current_user):
        users = User.query.all()
        users = users_schema.dump(users).data
        return {'status': 'success', 'data': users}, 200

    def post(self):
        json_data = request.get_json(force=True)
        if not json_data:
            return {'message': 'No input data provided'}, 400

        data, errors = user_schema.load(json_data)
        if errors:
            return errors, 422

        user = User.query.filter_by(username=data['username']).first()
        if user:
            return {'message': 'User already exists'}, 400

        hashed_password = generate_password_hash(
            data['password'], method='sha256')

        user = User(
            public_id=str(uuid.uuid4()),
            username=json_data['username'],
            password=hashed_password
        )

        db.session.add(user)
        db.session.commit()

        result = user_schema.dump(user).data

        return {"status": 'success', 'data': result}, 201


class Login(Resource):
    def get(self):
        auth = request.authorization
        d = datetime.datetime.utcnow(
        ) + datetime.timedelta(seconds=10)
        for_js = d.isoformat()
        print(for_js)

        if not auth or not auth.username or not auth.password:
            return {"message": "Please enter authorization information"}, 401

        user = User.query.filter_by(username=auth.username).first()
        if not user:
            return {"message": "User not found"}, 401

        if check_password_hash(user.password, auth.password):
            token = jwt.encode(
                {'public_id': user.public_id, 'exp': d}, "thisissecret")

            return {'token': token.decode('UTF-8'), 'expiresIn': for_js}

        return {"message": "Incorrect password entered for user"}, 401


class Contacts(Resource):
    # send all user info
    # create user
    @token_required
    def get(current_user, self):
        data = {}
        all_user_contacts = Contact.query.filter_by(
            user_id=current_user.id).all()
        for obj in all_user_contacts:
            contact = contact_schema.dump(obj).data
            data.update({contact['public_id']: contact})

        return data, 200

    @token_required
    def post(current_user, self):
        json_data = request.get_json(force=True)
        if not json_data:
            return {'message': 'No input data provided'}, 400

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

        db.session.add(contact)
        db.session.commit()

        data = contact_schema.dump(contact).data

        return {'data': data}, 201

    @token_required
    def put(current_user, self):
        json_data = request.get_json(force=True)
        if not json_data:
            return {'message': 'No input data provided'}, 400

        contact = Contact.query.filter_by(
            public_id=json_data['public_id'], user_id=current_user.id).first()

        if not contact:
            return {'message': 'You cannot modify this contact'}, 400

        columns = ["name", "phone", "isFav", "email", "address", "notes"]

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

        db.session.commit()

        data = contact_schema.dump(contact).data

        return {'data': data}, 204

    @token_required
    def delete(current_user, self):
        json_data = request.get_json(force=True)
        if not json_data:
            return {'message': 'No input data provided'}, 400

        contact = Contact.query.filter_by(
            public_id=json_data['public_id'], user_id=current_user.id).first()

        if not contact:
            return {'message': 'You cannot delete this contact'}, 400

        db.session.delete(contact)
        db.session.commit()

        return {"status": 'success'}, 204
