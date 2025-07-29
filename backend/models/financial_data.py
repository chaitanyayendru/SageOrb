from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import pandas as pd
from typing import Dict, List, Optional
import json

Base = declarative_base()

class FinancialDataset(Base):
    __tablename__ = 'financial_datasets'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    file_path = Column(String(500), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    metadata = Column(Text)  # JSON string for additional metadata
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'file_path': self.file_path,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'metadata': json.loads(self.metadata) if self.metadata else {}
        }

class CashFlowRecord(Base):
    __tablename__ = 'cash_flow_records'
    
    id = Column(Integer, primary_key=True)
    dataset_id = Column(Integer, nullable=False)
    date = Column(DateTime, nullable=False)
    cash_in = Column(Float, nullable=False, default=0.0)
    cash_out = Column(Float, nullable=False, default=0.0)
    category = Column(String(100))
    description = Column(Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'dataset_id': self.dataset_id,
            'date': self.date.isoformat(),
            'cash_in': self.cash_in,
            'cash_out': self.cash_out,
            'category': self.category,
            'description': self.description
        }

class OptimizationResult(Base):
    __tablename__ = 'optimization_results'
    
    id = Column(Integer, primary_key=True)
    dataset_id = Column(Integer, nullable=False)
    strategy_name = Column(String(255), nullable=False)
    risk_level = Column(String(50), nullable=False)
    parameters = Column(Text)  # JSON string
    results = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'dataset_id': self.dataset_id,
            'strategy_name': self.strategy_name,
            'risk_level': self.risk_level,
            'parameters': json.loads(self.parameters) if self.parameters else {},
            'results': json.loads(self.results) if self.results else {},
            'created_at': self.created_at.isoformat()
        }

class PredictionModel(Base):
    __tablename__ = 'prediction_models'
    
    id = Column(Integer, primary_key=True)
    dataset_id = Column(Integer, nullable=False)
    model_type = Column(String(100), nullable=False)
    model_path = Column(String(500))
    accuracy_score = Column(Float)
    parameters = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'dataset_id': self.dataset_id,
            'model_type': self.model_type,
            'model_path': self.model_path,
            'accuracy_score': self.accuracy_score,
            'parameters': json.loads(self.parameters) if self.parameters else {},
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }

# Database connection
def get_database_engine(database_url: str):
    return create_engine(database_url)

def get_session(database_url: str):
    engine = get_database_engine(database_url)
    Session = sessionmaker(bind=engine)
    return Session()

def init_database(database_url: str):
    engine = get_database_engine(database_url)
    Base.metadata.create_all(engine)
