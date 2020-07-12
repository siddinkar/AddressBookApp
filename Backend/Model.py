from flask import Flask
from marshmallow import Schema, fields, pre_load, validate
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy


ma = Marshmallow()
db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = tuple(db.UniqueConstraint('id'))

    id = db.Column(db.String(), primary_key=True, unique=True)
    api_key = db.Column(db.String(), primary_key=True, unique=True)

    def __init__(self, id, api_key):
        self.id = id
        self.api_key = api_key

    def __repr__(self):
        return '<id {}>'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'api_key': self.api_key
        }
