import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Tuple
import os
from datetime import datetime, timedelta
import logging
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
import warnings
warnings.filterwarnings('ignore')

logger = logging.getLogger(__name__)

class DataValidator:
    """Validates and cleans financial data"""
    
    @staticmethod
    def validate_required_columns(df: pd.DataFrame) -> Tuple[bool, List[str]]:
        """Check if required columns exist"""
        required_cols = ['date', 'cash_in', 'cash_out']
        missing_cols = [col for col in required_cols if col not in df.columns]
        return len(missing_cols) == 0, missing_cols
    
    @staticmethod
    def validate_data_types(df: pd.DataFrame) -> Tuple[bool, List[str]]:
        """Validate data types"""
        errors = []
        
        # Check date column
        try:
            pd.to_datetime(df['date'])
        except:
            errors.append("Date column contains invalid dates")
        
        # Check numeric columns
        for col in ['cash_in', 'cash_out']:
            if not pd.api.types.is_numeric_dtype(df[col]):
                errors.append(f"{col} column is not numeric")
        
        return len(errors) == 0, errors
    
    @staticmethod
    def validate_data_quality(df: pd.DataFrame) -> Dict:
        """Check data quality metrics"""
        quality_report = {
            'total_records': len(df),
            'missing_values': df.isnull().sum().to_dict(),
            'negative_cash_flows': len(df[df['cash_in'] < 0]) + len(df[df['cash_out'] < 0]),
            'zero_records': len(df[(df['cash_in'] == 0) & (df['cash_out'] == 0)]),
            'date_range': {
                'start': df['date'].min(),
                'end': df['date'].max(),
                'days': (df['date'].max() - df['date'].min()).days
            }
        }
        return quality_report

class DataPreprocessor:
    """Preprocesses financial data for analysis"""
    
    @staticmethod
    def clean_data(df: pd.DataFrame) -> pd.DataFrame:
        """Clean and preprocess data"""
        df_clean = df.copy()
        
        # Convert date column
        df_clean['date'] = pd.to_datetime(df_clean['date'])
        
        # Handle missing values
        df_clean['cash_in'] = df_clean['cash_in'].fillna(0)
        df_clean['cash_out'] = df_clean['cash_out'].fillna(0)
        
        # Remove negative values (assuming they're data entry errors)
        df_clean['cash_in'] = df_clean['cash_in'].clip(lower=0)
        df_clean['cash_out'] = df_clean['cash_out'].clip(lower=0)
        
        # Sort by date
        df_clean = df_clean.sort_values('date').reset_index(drop=True)
        
        return df_clean
    
    @staticmethod
    def add_features(df: pd.DataFrame) -> pd.DataFrame:
        """Add derived features for analysis"""
        df_features = df.copy()
        
        # Basic cash flow features
        df_features['net_cash_flow'] = df_features['cash_in'] - df_features['cash_out']
        df_features['cumulative_cash'] = df_features['net_cash_flow'].cumsum()
        
        # Time-based features
        df_features['day_of_week'] = df_features['date'].dt.dayofweek
        df_features['month'] = df_features['date'].dt.month
        df_features['quarter'] = df_features['date'].dt.quarter
        df_features['year'] = df_features['date'].dt.year
        
        # Rolling statistics
        df_features['rolling_7d_avg'] = df_features['net_cash_flow'].rolling(7, min_periods=1).mean()
        df_features['rolling_30d_avg'] = df_features['net_cash_flow'].rolling(30, min_periods=1).mean()
        df_features['rolling_7d_std'] = df_features['net_cash_flow'].rolling(7, min_periods=1).std()
        
        # Volatility measures
        df_features['cash_flow_volatility'] = df_features['rolling_7d_std'] / df_features['rolling_7d_avg'].abs()
        df_features['cash_flow_volatility'] = df_features['cash_flow_volatility'].fillna(0)
        
        return df_features
    
    @staticmethod
    def detect_anomalies(df: pd.DataFrame) -> pd.DataFrame:
        """Detect anomalous cash flows"""
        df_anomaly = df.copy()
        
        # Calculate z-scores for net cash flow
        net_cash_flow = df_anomaly['net_cash_flow']
        z_scores = np.abs((net_cash_flow - net_cash_flow.mean()) / net_cash_flow.std())
        
        # Mark anomalies (z-score > 3)
        df_anomaly['is_anomaly'] = z_scores > 3
        df_anomaly['anomaly_score'] = z_scores
        
        return df_anomaly

def load_data(file, validate=True, preprocess=True) -> Dict:
    """
    Load and process financial data from various file formats
    
    Args:
        file: File object or path
        validate: Whether to validate data
        preprocess: Whether to preprocess data
    
    Returns:
        Dictionary containing processed data and metadata
    """
    try:
        # Determine file type and load
        if hasattr(file, 'filename'):
            filename = file.filename
            file_extension = filename.split('.')[-1].lower()
            
            if file_extension == 'csv':
                df = pd.read_csv(file)
            elif file_extension in ['xlsx', 'xls']:
                df = pd.read_excel(file)
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")
        else:
            # Assume CSV if no filename
            df = pd.read_csv(file)
        
        result = {
            'success': True,
            'data': df.to_dict(orient='records'),
            'metadata': {
                'file_type': file_extension if 'file_extension' in locals() else 'csv',
                'original_rows': len(df),
                'original_columns': list(df.columns)
            }
        }
        
        if validate:
            # Validate data
            has_required_cols, missing_cols = DataValidator.validate_required_columns(df)
            if not has_required_cols:
                result['success'] = False
                result['error'] = f"Missing required columns: {missing_cols}"
                return result
            
            has_valid_types, type_errors = DataValidator.validate_data_types(df)
            if not has_valid_types:
                result['success'] = False
                result['error'] = f"Data type errors: {type_errors}"
                return result
            
            # Add quality report
            result['quality_report'] = DataValidator.validate_data_quality(df)
        
        if preprocess and result['success']:
            # Preprocess data
            df_clean = DataPreprocessor.clean_data(df)
            df_features = DataPreprocessor.add_features(df_clean)
            df_anomaly = DataPreprocessor.detect_anomalies(df_features)
            
            result['data'] = df_anomaly.to_dict(orient='records')
            result['metadata']['processed_rows'] = len(df_anomaly)
            result['metadata']['features_added'] = list(set(df_anomaly.columns) - set(df.columns))
            
            # Add summary statistics
            result['summary_stats'] = {
                'total_cash_in': float(df_anomaly['cash_in'].sum()),
                'total_cash_out': float(df_anomaly['cash_out'].sum()),
                'net_cash_flow': float(df_anomaly['net_cash_flow'].sum()),
                'avg_daily_cash_flow': float(df_anomaly['net_cash_flow'].mean()),
                'cash_flow_volatility': float(df_anomaly['cash_flow_volatility'].mean()),
                'anomalies_detected': int(df_anomaly['is_anomaly'].sum())
            }
        
        return result
        
    except Exception as e:
        logger.error(f"Error loading data: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

def generate_sample_data(days: int = 365) -> pd.DataFrame:
    """Generate sample financial data for testing"""
    np.random.seed(42)
    
    start_date = datetime.now() - timedelta(days=days)
    dates = pd.date_range(start=start_date, periods=days, freq='D')
    
    # Generate realistic cash flow patterns
    base_cash_in = 10000
    base_cash_out = 8000
    
    # Add seasonality and trends
    seasonal_factor = 1 + 0.3 * np.sin(2 * np.pi * np.arange(days) / 365)
    trend_factor = 1 + 0.001 * np.arange(days)
    
    cash_in = base_cash_in * seasonal_factor * trend_factor + np.random.normal(0, 1000, days)
    cash_out = base_cash_out * seasonal_factor * trend_factor + np.random.normal(0, 800, days)
    
    # Ensure positive values
    cash_in = np.maximum(cash_in, 0)
    cash_out = np.maximum(cash_out, 0)
    
    df = pd.DataFrame({
        'date': dates,
        'cash_in': cash_in,
        'cash_out': cash_out
    })
    
    return df
