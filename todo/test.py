from flask import Flask
"""from flask_sqlalchemy import SQLAlchemy"""
from sqlalchemy import Column, Integer, String, Boolean
from flask import render_template
from todo.database import Base


"""test.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:mlry871995@localhost/flaskmovie'"""


class Entry(Base):
    __tablename__ = "entries"
    id = Column(Integer, primary_key=True)
    title = Column(String(80),unique=True)
    priority = Column(Integer,unique=True)
    completed = Column(Boolean)

def __init__(self, title=None, priority=None):
    self.title = title
    self.priority = priority
    self.completed = False

def __repr__(self):
    return "<Entry: {}>".format(self.title)

"""@app.route('/')
def index():
    return render_template("index1.html")"""

"""if __name__ == "__main__":
    test.run()"""
