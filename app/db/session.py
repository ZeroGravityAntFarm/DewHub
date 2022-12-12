import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, create_database

db_host = os.environ.get("DB_HOST")
db_port = os.environ.get("DB_PORT")
db_database = os.environ.get("DB_DATABASE")
db_user = os.environ.get("DB_USER")
db_password = os.environ.get("DB_PASSWORD")

SQLALCHEMY_DATABASE_URL = "mysql+mysqldb://{}:{}@{}:{}/{}".format(db_user, db_password, db_host, db_port, db_database)

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

    #Create database if it does not exist
    if not database_exists(engine.url):
        create_database(engine.url)

except Exception as e:
    print("Failed to connect to database.")
    exit()
    

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()