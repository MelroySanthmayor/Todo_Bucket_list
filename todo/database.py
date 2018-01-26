
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

from todo import app

engine = create_engine(app.config['DATABASE'], convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                        autoflush=False,
                                        bind=engine))

Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    import todo.model
    Base.metadata.create_all(bind=engine)

def drop_tables():
    Base.metadata.drop_all(bind=engine)
