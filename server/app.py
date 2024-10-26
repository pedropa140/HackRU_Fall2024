from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
from dotenv import load_dotenv
import os
import mongoengine
import certifi
from datetime import datetime, timezone
from pymongo.mongo_client import MongoClient
from mongoengine import Document, StringField, EmailField, ValidationError, DateTimeField, ReferenceField, ListField
import google.generativeai as genai
import re

app = Flask(__name__)
load_dotenv()

api_key = os.getenv("GENAI_API_KEY")
MONGODB_URL = os.getenv('MONGODB_URI')
client = MongoClient(MONGODB_URL, tlsCAFile=certifi.where())

genai.configure(api_key=api_key)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

mongoengine.connect(host=MONGODB_URL, tlsCAFile=certifi.where())

CORS(app)

if __name__ == '__main__':
    app.run(debug=True)
