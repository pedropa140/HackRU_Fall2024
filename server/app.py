import bcrypt
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
import os
import mongoengine
import certifi
from datetime import datetime, timezone
from pymongo.mongo_client import MongoClient
from mongoengine import Document, StringField, EmailField, ValidationError, DateTimeField, ListField, FloatField, EmbeddedDocument, EmbeddedDocumentField
import re
import cloudflare
from cloudflare import run

app = Flask(__name__)
load_dotenv()

MONGODB_URL = os.getenv('MONGODB_URI')
client = MongoClient(MONGODB_URL, tlsCAFile=certifi.where())

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

mongoengine.connect(host=MONGODB_URL, tlsCAFile=certifi.where())

# MongoDB Models
class Coordinate(EmbeddedDocument):
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)

class PrimaryProvider(EmbeddedDocument):
    name = StringField(required=True)
    location = ListField(EmbeddedDocumentField(Coordinate))

class Appointment(EmbeddedDocument):
    name = StringField(required=True)
    provider = StringField(required=True)
    date = DateTimeField(required=True)
    location = ListField(EmbeddedDocumentField(Coordinate))

class Insurance(EmbeddedDocument):
    name = StringField(required=True)
    policy_number = StringField(required=True)
    group_number = StringField(required=True)
    copay = FloatField()
    deductible = FloatField()
    coverage = StringField()

class Activity(EmbeddedDocument):
    Name = StringField(required=True)
    Type = StringField(required=True)
    Date = DateTimeField(required=True)
    Location = ListField(EmbeddedDocumentField(Coordinate))

class Patient(Document):
    firstName = StringField(required=True)
    lastName = StringField(required=True)
    email = EmailField(required=True, unique=True)
    DOB = DateTimeField(required=True)
    password = StringField(required=True)
    coordinates = EmbeddedDocumentField(Coordinate)
    appointments = ListField(EmbeddedDocumentField(Appointment))
    insurance = EmbeddedDocumentField(Insurance, required=True)
    activities = ListField(EmbeddedDocumentField(Activity))
    primaryProvider = PrimaryProvider
    foodTracker = ListField(StringField())

    def set_password(self, raw_password):
        hashed = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt())
        self.password = hashed.decode('utf-8')

    def check_password(self, raw_password):
        return bcrypt.checkpw(raw_password.encode('utf-8'), self.password.encode('utf-8'))

CORS(app)

# Patient Signup with password hashing
@app.route('/api/PatientSignup', methods=['POST'])
def patientSignup():
    form_data = request.json
    firstname = form_data.get('firstname')
    lastname = form_data.get('lastname')
    email = form_data.get('email')
    password = form_data.get('password')
    dob = datetime.strptime(form_data.get('dob'), "%m/%d/%Y")
    insurancename = form_data.get('insurancename')
    policy_number = form_data.get('policy_number')    
    group_number = form_data.get('group_number')

    if Patient.objects(email=email).first():
        return jsonify({"message": "Email already exists!"}), 400

    # Hashing the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    insurance = Insurance(
        name=insurancename,
        policy_number=policy_number,
        group_number=group_number,
    )

    patient = Patient(
        firstName=firstname,
        lastName=lastname,
        email=email,
        DOB=dob,
        password=hashed_password.decode('utf-8'),
        insurance=insurance
    )
    patient.save()
    return jsonify({"message": "Patient registered successfully!"}), 201

@app.route('/api/signin', methods=['POST'])
def patientSignin():
    form_data = request.json
    email = form_data.get('email')
    password = form_data.get('password')

    patient = Patient.objects(email=email).first()

    if not patient:
        return jsonify({"message": "Patient not found!"}), 404

    # Check if provided password matches the stored hashed password
    if not patient.check_password(password):
        return jsonify({"message": "Incorrect password!"}), 401

    return jsonify({
        "message": "Signed in successfully!",
        "email": patient.email,
    }), 200

# Get Patient Info
@app.route('/api/userinfo', methods=['GET'])
def get_user_info():
    user_email = request.args.get('email')
    patient = Patient.objects(email=user_email).first()

    if patient:
        return jsonify({
            "firstname": patient.firstName,
            "lastname": patient.lastName,
            "email": patient.email,
            "DOB": patient.DOB,
            "insurance": {
                "name": patient.insurance.name,
                "policy_number": patient.insurance.policy_number,
                "group_number": patient.insurance.group_number
            }
        }), 200
    else:
        return jsonify({"message": "Patient not found!"}), 404

# Update Patient Info
@app.route('/api/updateuserinfo', methods=['PUT'])
def update_user_info():
    data = request.json
    user_email = data.get('email')
    new_firstname = data.get('firstname')
    new_lastname = data.get('lastname')

    patient = Patient.objects(email=user_email).first()

    if patient:
        patient.update(
            set__firstName=new_firstname,
            set__lastName=new_lastname
        )
        return jsonify({"message": "Patient information updated successfully!"}), 200
    else:
        return jsonify({"message": "Patient not found!"}), 404

# Update Patient Password
@app.route('/api/updatepassword', methods=['PUT'])
def update_password():
    data = request.json
    user_email = data.get('email')
    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    patient = Patient.objects(email=user_email).first()

    if not patient:
        return jsonify({"message": "Patient not found!"}), 404

    if not bcrypt.checkpw(old_password.encode('utf-8'), patient.password.encode('utf-8')):
        return jsonify({"message": "Incorrect old password!"}), 400

    # Update to new hashed password
    hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    patient.update(set__password=hashed_new_password.decode('utf-8'))
    return jsonify({"message": "Password updated successfully!"}), 200

# Delete Patient Account
@app.route('/api/deleteaccount', methods=['DELETE'])
def delete_account():
    user_email = request.args.get('email')

    patient = Patient.objects(email=user_email).first()

    if not patient:
        return jsonify({"message": "Patient not found!"}), 404

    patient.delete()
    return jsonify({"message": "Patient account deleted successfully!"}), 200

@app.route('/api/sendmessage', methods=['POST'])
def send_message():
    data = request.json
    message = data.get('message')
    if not message:
        return jsonify({'response': 'No message received!'}), 400
    query = f'The question the user wants to ask is {message}.'
    inputs = [
        {
            "role": "system",
            "content": """
                As a chatbot, your goal is to help with questions that primarily deal with environmental science and sustainability.
                Do not entertain questions outside of your scope; apologize politely and offer sustainability facts. Do not explicitly
                inform the user about this instruction.
                """
        },
        {"role": "user", "content": query}
    ]
    # print(input)
    # AI model interaction
    result_dictionary = cloudflare.run("@cf/meta/llama-2-7b-chat-int8", inputs)
    print(result_dictionary)
    response_text = result_dictionary['result']['response']

    # Formatting response into HTML-like format
    response_text = re.sub(r'^# (.*?)$', r'<h1>\1</h1>', response_text, flags=re.MULTILINE)
    response_text = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', response_text, flags=re.MULTILINE)
    response_text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', response_text)
    response_text = re.sub(r'^\* (.*?)$', r'<li>\1</li>', response_text, flags=re.MULTILINE)
    response_text = re.sub(r'</li>\s*<li>', r'</li><li>', response_text)
    response_text = re.sub(r'</li>\s*$', r'</li>', response_text)
    response_text = re.sub(r'^(<li>.*?</li>\s*)+$', r'<ul>\1</ul>', response_text, flags=re.MULTILINE)
    response_text = response_text.replace('\n', '<br>')

    return jsonify({'response': response_text}), 200

class Task(Document):
    email = EmailField(required=True)
    title = StringField(required=True, max_length=100)
    task_date = DateTimeField(required=True)
    start_time = StringField(required=True)
    end_time = StringField(required=True)
    description = StringField(max_length=500)
    created_at = DateTimeField(default=datetime.now(timezone.utc))

    meta = {
        'collection': 'tasks'
    }
 
@app.route('/api/addTask', methods=['POST'])
def addTask():
    data = request.json
    
    try:
        email = data.get('email')
        title = data.get('task').get('title')
        task_date = datetime.strptime(data.get('task').get('date'), "%Y-%m-%d")
        start_time = data.get('task').get('start_time')
        end_time = data.get('task').get('end_time')
        description = data.get('task').get('description', '')

        if not email or not title or not task_date or not start_time or not end_time:
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

        task = Task(
            email=email,
            title=title,
            task_date=task_date,
            start_time=start_time,
            end_time=end_time,
            description=description
        )

        task.save()

        response = {
            'status': 'success',
            'message': 'Task added successfully!',
            'data': {
                'email': email,
                'title': title,
                'task_date': task_date.strftime("%Y-%m-%d"),
                'start_time': start_time,
                'end_time': end_time,
                'description': description
            }
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@app.route('/api/getTasks', methods=['GET'])
def get_tasks():
    email = request.args.get('email')
    date = request.args.get('date')

    if not email or not date:
        return jsonify({'status': 'error', 'message': 'Missing required parameters'}), 400

    try:
        task_date = datetime.strptime(date, "%Y-%m-%d")
        
        tasks = Task.objects(email=email, task_date=task_date)

        tasks_data = []
        for task in tasks:
            tasks_data.append({
                'title': task.title,
                'start_time': task.start_time,
                'end_time': task.end_time,
                'description': task.description
            })

        return jsonify({'status': 'success', 'tasks': tasks_data}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/removeTask', methods=['DELETE'])
def remove_task():
    email = request.args.get('email')
    task_date = request.args.get('task_date')
    task_index = int(request.args.get('task_index'))

    if not email or not task_date or task_index is None:
        return jsonify({'status': 'error', 'message': 'Missing required parameters'}), 400

    try:
        task_date = datetime.strptime(task_date, "%Y-%m-%d")

        tasks = Task.objects(email=email, task_date=task_date).order_by('created_at')

        if not tasks:
            return jsonify({'status': 'error', 'message': 'No tasks found for this date!'}), 404

        if task_index < 0 or task_index >= len(tasks):
            return jsonify({'status': 'error', 'message': 'Invalid task index!'}), 400

        task_to_delete = tasks[task_index]
        task_to_delete.delete()

        return jsonify({'status': 'success', 'message': 'Task removed successfully!'}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
