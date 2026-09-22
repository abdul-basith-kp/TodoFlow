from flask_socketio import SocketIO, emit
from flask import Flask, render_template, request, redirect, url_for
from flask import session

from database import Database

from repositories.user_repository import UserRepo
from repositories.task_repository import TaskRepo
from repositories.community_msg_repo import communityMsgRepo

from managers.user_manager import UserManager
from managers.tasks_manager import TaskManager
from managers.community_msg_manager import CommunityMsgManager

from validators.user_validator import UserValidator
from validators.general_validator import GeneralValidator
from validators.task_validator import TaskValidator

from constants.status import STATUS_PENDING

import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
socketio = SocketIO(app)
app.secret_key = os.getenv("SECRET_KEY")

gv = GeneralValidator()
uv = UserValidator(gv)
tv = TaskValidator(gv)

db = Database()
ur = UserRepo(db)
um = UserManager(ur, uv)

tr = TaskRepo(db)
tm = TaskManager(tr, tv)

cmr = communityMsgRepo(db)
cmm = CommunityMsgManager(cmr, um)

@app.route('/')
def index_page():
    return render_template('index.html')

@app.route("/login", methods=['GET', 'POST'])
def login_page():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        try:
            user = um.login_user(username, password)
            session["username"] = username
            session['id'] = um.get_user_by_username(username)[0]
            return redirect(url_for('home_page'))
        except Exception as e:
            return render_template("login.html", message=str(e))
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register_page():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        try:
            um.register_user(username, password)
        except Exception as e:
            return render_template("register.html", message=str(e))
        session['username'] = username
        session['id'] = um.get_user_by_username(username)[0]
        return redirect(url_for('home_page'))
    return render_template('register.html')

@app.route('/home')
def home_page():
    if not session.get("username"):
        return redirect(url_for('register_page'))

    tasks = tm.get_tasks_by_status_and_user_id(STATUS_PENDING, session.get('id'))
    return render_template(
        'home.html', 
        username=session.get("username"),
        tasks = tasks)

@app.route('/add-task', methods=['GET', 'POST'])
def add_task():

    if not session.get("username"):
        return redirect(url_for('register_page'))
    
    if request.method == 'GET':
        return render_template("add-task.html")
    
    user_id = session.get('id')
    title = request.form.get("title")
    description = request.form.get("description")
    priority = request.form.get("priority")
    due_date = request.form.get("due-date")
    try:
        tm.add_task(user_id, title, description, priority, due_date)
        return redirect(url_for('home_page'))
    except Exception as e:  
        return render_template('add-task.html', message=str(e))

@app.route("/delete-task/<int:task_id>", methods=['POST'])
def delete_task(task_id):
    tm.soft_delete_task(task_id, session.get("id"))
    return redirect(url_for('home_page'))

@app.route("/mark-task-completed/<int:task_id>", methods=['POST'])
def mark_task_completed(task_id):
    tm.mark_task_completed(task_id, session.get("id"))
    return redirect( url_for('home_page'))

@app.route("/edit-task/<int:task_id>", methods=['GET', 'POST'])
def edit_task(task_id):

    if not session.get('id'):
        return redirect(url_for('register_page'))
    
    if request.method == "GET":
        task = tm.get_task_by_task_id(task_id)
        return render_template('edit-task.html', task=task)
    
    user_id = session.get('id')
    new_title = request.form.get("title")
    new_description = request.form.get("description")
    new_priority = request.form.get("priority")
    new_due_date = request.form.get("due-date")
    try:
        tm.edit_task(task_id, user_id, new_title, new_description, new_priority, new_due_date)
        return redirect(url_for('home_page'))
    except Exception as e:
        return render_template('edit-task.html', task_id=task_id, message=str(e))


#### DELETE THIS AFTER TRIAL ####
@app.route('/get_tasks/<string:status>', methods=['GET'])
def get_tasks(status):
    tasks = tm.get_tasks_by_status_and_user_id(status, session.get('id'))
    if not tasks:
        return []
    return [
        {
            'task_id': task.id,
            'user_id': task.user_id,
            'title': task.title,
            'description': task.description,
            'priority': task.priority,
            'due_date': task.due_date,
            'status': task.status
         }
        for task in tasks
    ]

@app.route("/community", methods=['POST', 'GET'])
def community_page():
    return render_template("community-page.html", user_id=session.get('id'))

    
@app.route("/community_messages", methods=['GET'])
def community_messages():
    messages = cmm.get_msgs()
    return messages

@app.route('/current-user')
def current_user():
    return {
        'current_user': session.get('id')
    }

@app.route('/add-message/<string:message>', methods=['POST'])
def add_message(message):
    cmm.create_msg(session.get('id'), message)
    return redirect(url_for('community_page'))

@app.route('/dashboard', methods=['GET'])
def dashboard_page():
    return render_template('dashboard.html', task_statistics=task_statistics)

@app.route('/task-statistics', methods=['GET'])
def task_statistics():
        task_statistics = tm.get_task_statistics(session.get('id'))
        return task_statistics

@app.route('/account', methods=['GET'])
def account():
    return render_template('account.html')

@app.route('/get-user', methods=['GET'])
def get_user():
    return {
        'user-id': session.get('id'),
        'username': session.get('username')
    }

@socketio.on("connect")
def connect():
    emit('c',
        {
            'user_id': session.get('id'),
            'username': session.get('username')
        }, broadcast=True)

@socketio.on("disconnect")
def disconnect():
      emit('dc',
            {
                'user_id': session.get('id'),
                'username': session.get('username')
            }, broadcast=True)

@socketio.on('send-message')
def send_message(msg):
    data = {
        'user_id': session.get('id'),
        'username':session.get('username'),
        'msg': msg
    }
    emit(
        'msg-received',
        data,
        broadcast=True
    )

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index_page'))

if __name__ == "__main__":
    socketio.run(app=app, host="0.0.0.0", port=5000, debug=True)