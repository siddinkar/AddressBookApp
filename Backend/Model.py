#
# This file sets up the tables used in the db
# There are two tables created: User and Contact
#
#

from flask import Flask
from marshmallow import Schema, fields, pre_load, validate
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

# init db
ma = Marshmallow()
db = SQLAlchemy()

# User tabel


class User(db.Model):
    # specify name and column
    __tablename__ = 'users'
    __table_args__ = tuple(db.UniqueConstraint('id', 'username'))

    # specify important columns
    id = db.Column(db.Integer, primary_key=True, unique=True)
    public_id = db.Column(db.String(50), unique=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

    # init func to run in migrate.py

    def __init__(self, public_id, username, password):
        self.public_id = public_id
        self.username = username
        self.password = password

# contact table


class Contact(db.Model):
    # specify table name and args
    __tablename__ = 'contacts'
    __table_args__ = tuple(db.UniqueConstraint('id'))

    # create important args
    id = db.Column(db.Integer, primary_key=True, unique=True)
    public_id = db.Column(db.String(50), unique=True)
    user_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    isFav = db.Column(db.Boolean, nullable=False)
    email = db.Column(db.String(80))
    address = db.Column(db.String(100))
    notes = db.Column(db.String(200))

    # init to be run in migrate.py

    def __init__(self, user_id, public_id, name, isFav, phone, email, address, notes):
        self.user_id = user_id
        self.public_id = public_id
        self.name = name
        self.phone = phone
        self.isFav = isFav
        self.email = email
        self.address = address
        self.notes = notes

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'public_id': self.public_id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'isFav': self.isFav,
            'address': self.address,
            'notes': self.notes
        }

# schemas for fetching multiple user objs from db


class UserSchema(ma.Schema):
    id = fields.Integer()
    public_id = fields.String()
    username = fields.String(required=True)
    password = fields.String(required=True)

# schema for fetching multiple contacts from db


class ContactSchema(ma.Schema):
    id = fields.Integer()
    user_id = fields.Integer()
    public_id = fields.String()
    name = fields.String(required=True)
    phone = fields.String(required=True)
    email = fields.String()
    address = fields.String()
    isFav = fields.Boolean()
    notes = fields.String()
