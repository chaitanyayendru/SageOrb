class Config:
    DEBUG = True
    TESTING = False

class DevelopmentConfig(Config):
    ENV = 'development'

class ProductionConfig(Config):
    DEBUG = False
