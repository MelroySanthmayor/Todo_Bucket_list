import os
from flask import Flask
from flask_cors import CORS

DATABASE = os.getenv("DATABASE_URL", "postgresql://postgres:mlry871995@localhost/flaskmovie")
DATABASE = DATABASE.strip()

app = Flask(__name__)
app.config.from_object(__name__)
CORS(app, resources=r'/bucket_list/*', allow_headers="Content-Type")

import todo.views
