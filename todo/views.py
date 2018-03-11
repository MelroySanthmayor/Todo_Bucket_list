from todo import app

from flask import jsonify, request, url_for
from flask import json
from flask import render_template
from todo.database import db_session,init_db
from todo.model import Todo
from todo.error_handlers import InvalidUsage

@app.route('/bucket_list')
def sqlalchemy():
    todos = []
    try:
        todos = Todo.query.order_by(Todo.priority).all()
    except:
        init_db()
    print(todos)
    return render_template('index.html', todos=todos)


@app.route('/bucket_list/get', methods=['GET'])
def sqlalchemy_get():
    todos = Todo.query.order_by(Todo.priority).all()
    return jsonify(todos=[todo.get_dict() for todo in todos])


@app.route('/bucket_list/new', methods=["POST"])
def sqlalchemy_new():
    if request.method =="POST":
        request_json = request.get_json()
        db_session.add(Todo(request_json['title'], Todo(request_json['priority'])))
        db_session.commit()
    return jsonify(status='ok')   # Always ok!

@app.route('/bucket_list/toggle_completed',methods=["PATCH"])
def sqlalchemy_update_completed():
    if request.method =="PATCH":
        request_json = request.get_json()
        todos = Todo.query.get(request_json['id']).all()
        for todo in todos:
            todo.completed = request_json['completed']
        db_session.commit()
    return jsonify(status='ok')



@app.route('/bucket_list/update', methods=["PATCH"])
def sqlalchemy_update():
    if request.method == "PATCH":
        request_json = request.get_json()
        todo = Todo.query.get(request_json['id'])
        todo.completed = request_json['completed']
        todo.title = request_json['title']
        todo.priority = request_json['priority']
        db_session.commit()
    return jsonify(status='ok')   # Always ok!

@app.route('/bucket_list/delete', methods=["DELETE"])
def sqlalchemy_update():
    if request.method == "DELETE":
        request_json = request.get_json()
        todo = Todo.query.get(request_json['id'])
        db_session.delete(todo)
        db_session.commit()
    return jsonify(status='ok')   # Always ok!

@app.route('/bucket_list/cmpltd_delete', methods=["DELETE"])
def sqlalchemy_update():
    if request.method == "DELETE":
        request_json = request.get_json()
        todos = Todo.query.get(request_json['id']).all()
        for todo in todos:
            if todo.completed==True:
                db_session.delete(todo)
        db_session.commit()
    return jsonify(status='ok')   # Always ok!

'''@app.route("/", methods=["GET", "POST", "DELETE"])
def index():
    if request.method == "POST":
        request_json = request.get_json()
        if "order" in request_json:
            if type(request_json["order"]) is int:
                entry = Entry(request_json["title"], request_json["order"])
            else:
                raise InvalidUsage(str(request_json["order"]) + " is not an integer.")
        else:
            entry = Entry(request_json["title"])
        db_session.add(entry)
        db_session.commit()
        return jsonify(construct_dict(entry))
    else:
        if request.method == "DELETE":
            Entry.query.delete()
            db_session.commit()
        response = []
        for entry in Entry.query.all():
            response.append(construct_dict(entry))
        return json.dumps(response)


@app.route("/<int:entry_id>", methods=["GET", "PATCH", "DELETE"])
def entry(entry_id):
    entry = Entry.query.filter(Entry.id == entry_id).first()
    if request.method == "PATCH":
        request_json = request.get_json()
        if "title" in request_json:
            entry.title = request_json["title"]
        if "completed" in request_json:
            if type(request_json["completed"]) is bool:
                entry.completed = request_json["completed"]
            else:
                raise InvalidUsage(str(request_json["completed"]) + " is not a boolean.")
        if "order" in request_json:
            if type(request_json["order"]) is int:
                entry.order = request_json["order"]
            else:
                raise InvalidUsage(str(request_json["order"]) + " is not an integer.")
        db_session.commit()
    elif request.method == "DELETE":
        db_session.delete(entry)
        db_session.commit()
        return jsonify(dict())
    if entry:
        return jsonify(construct_dict(entry))
    else:
        return jsonify(dict())
'''
@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response




@app.teardown_appcontext
def shutdown_session(exception = None):
    db_session.remove()