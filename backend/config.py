import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    # Database
    DATABASE_URL = os.environ.get('DATABASE_URL') or 'sqlite:///sageorb.db'
    
    # Redis for caching and task queue
    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://localhost:6379/0'
    
    # API Configuration
    API_TITLE = "SageOrb API"
    API_VERSION = "v1.0"
    OPENAPI_VERSION = "3.0.2"
    
    # File upload settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = 'uploads'
    ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
    
    # ML Model settings
    MODEL_CACHE_TTL = 3600  # 1 hour
    PREDICTION_HORIZON = 90  # days
    
    # Optimization settings
    MIN_RESERVE_RATIO = 0.1  # 10% minimum reserve
    MAX_INVESTMENT_RATIO = 0.3  # 30% maximum investment
    RISK_TOLERANCE_LEVELS = ['conservative', 'moderate', 'aggressive']
    
    # Performance settings
    CACHE_TTL = 300  # 5 minutes
    MAX_WORKERS = 4
    REQUEST_TIMEOUT = 30

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
    DATABASE_URL = os.environ.get('DATABASE_URL')

class TestingConfig(Config):
    TESTING = True
    DATABASE_URL = 'sqlite:///:memory:'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
