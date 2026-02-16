"""config.py"""

import os
from dotenv import load_dotenv


basedir = os.path.abspath(os.path.dirname(__file__))
# print(os.environ.get("DATABASE_URL"))

load_dotenv()



class Config():
    """main config"""
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = os.environ['SECRET_KEY']
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    


class ProductionConfig(Config):
    """production config"""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = (
        f'postgresql+psycopg2://{os.getenv("POSTGRES_USER")}:' +
        f'{os.getenv("POSTGRES_PW")}@' +
        f'{os.getenv("POSTGRES_HOST")}/' +
        f'{os.getenv("POSTGRES_DB")}'
    )


class StagingConfig(Config):
    """staging config"""
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    """development config"""
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    """testing config"""
    TESTING = True


app_config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'staging': StagingConfig
}