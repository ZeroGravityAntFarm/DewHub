import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists, create_database

db_host = ""
db_port = "5432"
db_database = "postgres"
db_user = ""
db_password = ""

SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://{}:{}@{}:{}/{}".format(db_user, db_password, db_host, db_port, db_database)

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

    #Create database if it does not exist
    if not database_exists(engine.url):
        create_database(engine.url)

except Exception as e:
    print("Failed to connect to database.")
    print(e)
    exit()
    

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
