import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Tuple
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.preprocessing import StandardScaler
import warnings
from datetime import datetime, timedelta
import logging

warnings.filterwarnings('ignore')
logger = logging.getLogger(__name__)

class AdvancedProjectionEngine:
    """Advanced cash flow projection engine with multiple forecasting models"""
    
    def __init__(self, forecast_horizon: int = 90):
        self.forecast_horizon = forecast_horizon
        self.models = {}
        self.scalers = {}
        
    def generate_liquidity_projection(self, data: List[Dict], method: str = 'ensemble') -> Dict:
        """
        Generate comprehensive liquidity projections
        
        Args:
            data: List of cash flow records
            method: Projection method ('simple', 'advanced', 'ensemble', 'ml')
        
        Returns:
            Projection results with confidence intervals
        """
        df = pd.DataFrame(data)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date').reset_index(drop=True)
        
        if method == 'simple':
            return self._simple_projection(df)
        elif method == 'advanced':
            return self._advanced_projection(df)
        elif method == 'ensemble':
            return self._ensemble_projection(df)
        elif method == 'ml':
            return self._ml_projection(df)
        else:
            raise ValueError(f"Unknown projection method: {method}")
    
    def _simple_projection(self, df: pd.DataFrame) -> Dict:
        """Simple moving average projection"""
        df['net_cash_flow'] = df['cash_in'] - df['cash_out']
        df['cumulative_cash'] = df['net_cash_flow'].cumsum()
        
        # Calculate moving averages
        ma_7 = df['net_cash_flow'].rolling(7, min_periods=1).mean()
        ma_30 = df['net_cash_flow'].rolling(30, min_periods=1).mean()
        
        # Generate future projections
        last_date = df['date'].max()
        future_dates = pd.date_range(start=last_date + timedelta(days=1), 
                                   periods=self.forecast_horizon, freq='D')
        
        # Simple trend projection
        recent_avg = ma_7.iloc[-1] if not pd.isna(ma_7.iloc[-1]) else df['net_cash_flow'].mean()
        trend = np.polyfit(range(len(df)), df['net_cash_flow'], 1)[0]
        
        projections = []
        cumulative = df['cumulative_cash'].iloc[-1]
        
        for i, date in enumerate(future_dates):
            projected_flow = recent_avg + trend * (i + 1)
            cumulative += projected_flow
            
            projections.append({
                'date': date.strftime('%Y-%m-%d'),
                'net_cash_flow': float(projected_flow),
                'cumulative_cash': float(cumulative),
                'confidence_lower': float(projected_flow * 0.8),
                'confidence_upper': float(projected_flow * 1.2)
            })
        
        return {
            'method': 'simple',
            'projections': projections,
            'metrics': {
                'trend': float(trend),
                'recent_average': float(recent_avg),
                'volatility': float(df['net_cash_flow'].std())
            }
        }
    
    def _advanced_projection(self, df: pd.DataFrame) -> Dict:
        """Advanced projection with seasonality and multiple components"""
        df['net_cash_flow'] = df['cash_in'] - df['cash_out']
        df['cumulative_cash'] = df['net_cash_flow'].cumsum()
        
        # Add time-based features
        df['day_of_week'] = df['date'].dt.dayofweek
        df['month'] = df['date'].dt.month
        df['quarter'] = df['date'].dt.quarter
        df['day_of_year'] = df['date'].dt.dayofyear
        
        # Calculate seasonal patterns
        seasonal_patterns = self._calculate_seasonal_patterns(df)
        
        # Decompose time series
        trend, seasonal, residual = self._decompose_timeseries(df['net_cash_flow'])
        
        # Generate projections
        last_date = df['date'].max()
        future_dates = pd.date_range(start=last_date + timedelta(days=1), 
                                   periods=self.forecast_horizon, freq='D')
        
        projections = []
        cumulative = df['cumulative_cash'].iloc[-1]
        
        for i, date in enumerate(future_dates):
            # Trend component
            trend_component = trend[-1] + (trend[-1] - trend[-2]) * (i + 1) if len(trend) > 1 else trend[-1]
            
            # Seasonal component
            day_of_year = date.dayofyear
            seasonal_component = seasonal_patterns.get(day_of_year, 0)
            
            # Combined projection
            projected_flow = trend_component + seasonal_component
            
            # Add some randomness based on historical residuals
            if len(residual) > 0:
                noise = np.random.choice(residual, 1)[0] * 0.1  # Reduce noise impact
                projected_flow += noise
            
            cumulative += projected_flow
            
            # Calculate confidence intervals
            std_dev = df['net_cash_flow'].std()
            confidence_lower = projected_flow - 1.96 * std_dev
            confidence_upper = projected_flow + 1.96 * std_dev
            
            projections.append({
                'date': date.strftime('%Y-%m-%d'),
                'net_cash_flow': float(projected_flow),
                'cumulative_cash': float(cumulative),
                'trend_component': float(trend_component),
                'seasonal_component': float(seasonal_component),
                'confidence_lower': float(confidence_lower),
                'confidence_upper': float(confidence_upper)
            })
        
        return {
            'method': 'advanced',
            'projections': projections,
            'seasonal_patterns': seasonal_patterns,
            'decomposition': {
                'trend_strength': float(np.corrcoef(range(len(trend)), trend)[0, 1]),
                'seasonal_strength': float(np.std(seasonal) / np.std(df['net_cash_flow'])),
                'residual_std': float(np.std(residual))
            }
        }
    
    def _ensemble_projection(self, df: pd.DataFrame) -> Dict:
        """Ensemble projection combining multiple methods"""
        # Generate projections using different methods
        simple_proj = self._simple_projection(df)
        advanced_proj = self._advanced_projection(df)
        ml_proj = self._ml_projection(df)
        
        # Combine projections (weighted average)
        ensemble_projections = []
        
        for i in range(len(simple_proj['projections'])):
            simple_flow = simple_proj['projections'][i]['net_cash_flow']
            advanced_flow = advanced_proj['projections'][i]['net_cash_flow']
            ml_flow = ml_proj['projections'][i]['net_cash_flow']
            
            # Weighted average (can be adjusted based on model performance)
            weights = [0.2, 0.3, 0.5]  # simple, advanced, ml
            ensemble_flow = (simple_flow * weights[0] + 
                           advanced_flow * weights[1] + 
                           ml_flow * weights[2])
            
            # Calculate ensemble cumulative
            if i == 0:
                cumulative = df['cumulative_cash'].iloc[-1] if 'cumulative_cash' in df.columns else 0
            else:
                cumulative = ensemble_projections[i-1]['cumulative_cash']
            cumulative += ensemble_flow
            
            ensemble_projections.append({
                'date': simple_proj['projections'][i]['date'],
                'net_cash_flow': float(ensemble_flow),
                'cumulative_cash': float(cumulative),
                'simple_projection': float(simple_flow),
                'advanced_projection': float(advanced_flow),
                'ml_projection': float(ml_flow),
                'confidence_lower': float(ensemble_flow * 0.85),
                'confidence_upper': float(ensemble_flow * 1.15)
            })
        
        return {
            'method': 'ensemble',
            'projections': ensemble_projections,
            'model_weights': {'simple': 0.2, 'advanced': 0.3, 'ml': 0.5},
            'ensemble_metrics': {
                'variance_reduction': self._calculate_variance_reduction([
                    simple_proj['projections'], 
                    advanced_proj['projections'], 
                    ml_proj['projections']
                ])
            }
        }
    
    def _ml_projection(self, df: pd.DataFrame) -> Dict:
        """Machine learning-based projection"""
        # Prepare features
        df_ml = self._prepare_ml_features(df)
        
        if len(df_ml) < 30:  # Need sufficient data for ML
            return self._simple_projection(df)
        
        # Train multiple models
        models = self._train_ml_models(df_ml)
        
        # Generate predictions
        last_date = df['date'].max()
        future_dates = pd.date_range(start=last_date + timedelta(days=1), 
                                   periods=self.forecast_horizon, freq='D')
        
        projections = []
        cumulative = df['cumulative_cash'].iloc[-1] if 'cumulative_cash' in df.columns else 0
        
        # Prepare future features
        future_features = self._prepare_future_features(df_ml, future_dates)
        
        for i, (date, features) in enumerate(zip(future_dates, future_features)):
            # Get predictions from all models
            predictions = []
            for model_name, model in models.items():
                if model_name in self.scalers:
                    features_scaled = self.scalers[model_name].transform([features])
                    pred = model.predict(features_scaled)[0]
                else:
                    pred = model.predict([features])[0]
                predictions.append(pred)
            
            # Ensemble prediction
            projected_flow = np.mean(predictions)
            cumulative += projected_flow
            
            # Calculate confidence interval based on model agreement
            std_pred = np.std(predictions)
            confidence_lower = projected_flow - 1.96 * std_pred
            confidence_upper = projected_flow + 1.96 * std_pred
            
            projections.append({
                'date': date.strftime('%Y-%m-%d'),
                'net_cash_flow': float(projected_flow),
                'cumulative_cash': float(cumulative),
                'model_predictions': {name: float(pred) for name, pred in zip(models.keys(), predictions)},
                'prediction_std': float(std_pred),
                'confidence_lower': float(confidence_lower),
                'confidence_upper': float(confidence_upper)
            })
        
        return {
            'method': 'ml',
            'projections': projections,
            'model_performance': self._evaluate_models(df_ml, models),
            'feature_importance': self._get_feature_importance(df_ml, models)
        }
    
    def _prepare_ml_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Prepare features for machine learning models"""
        df_ml = df.copy()
        
        # Basic features
        df_ml['net_cash_flow'] = df_ml['cash_in'] - df_ml['cash_out']
        df_ml['cumulative_cash'] = df_ml['net_cash_flow'].cumsum()
        
        # Time-based features
        df_ml['day_of_week'] = df_ml['date'].dt.dayofweek
        df_ml['month'] = df_ml['date'].dt.month
        df_ml['quarter'] = df_ml['date'].dt.quarter
        df_ml['day_of_year'] = df_ml['date'].dt.dayofyear
        df_ml['week_of_year'] = df_ml['date'].dt.isocalendar().week
        
        # Lag features
        for lag in [1, 3, 7, 14, 30]:
            df_ml[f'cash_in_lag_{lag}'] = df_ml['cash_in'].shift(lag)
            df_ml[f'cash_out_lag_{lag}'] = df_ml['cash_out'].shift(lag)
            df_ml[f'net_cash_flow_lag_{lag}'] = df_ml['net_cash_flow'].shift(lag)
        
        # Rolling statistics
        for window in [7, 14, 30]:
            df_ml[f'cash_in_ma_{window}'] = df_ml['cash_in'].rolling(window).mean()
            df_ml[f'cash_out_ma_{window}'] = df_ml['cash_out'].rolling(window).mean()
            df_ml[f'net_cash_flow_ma_{window}'] = df_ml['net_cash_flow'].rolling(window).mean()
            df_ml[f'net_cash_flow_std_{window}'] = df_ml['net_cash_flow'].rolling(window).std()
            df_ml[f'net_cash_flow_min_{window}'] = df_ml['net_cash_flow'].rolling(window).min()
            df_ml[f'net_cash_flow_max_{window}'] = df_ml['net_cash_flow'].rolling(window).max()
        
        # Remove rows with NaN values
        df_ml = df_ml.dropna()
        
        return df_ml
    
    def _train_ml_models(self, df: pd.DataFrame) -> Dict:
        """Train multiple machine learning models"""
        # Prepare features and target
        feature_cols = [col for col in df.columns if col not in ['date', 'net_cash_flow', 'cumulative_cash']]
        X = df[feature_cols]
        y = df['net_cash_flow']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Initialize models
        models = {
            'random_forest': RandomForestRegressor(n_estimators=100, random_state=42),
            'gradient_boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
            'linear_regression': LinearRegression()
        }
        
        # Train models
        for name, model in models.items():
            if name == 'linear_regression':
                # Scale features for linear regression
                scaler = StandardScaler()
                X_train_scaled = scaler.fit_transform(X_train)
                X_test_scaled = scaler.transform(X_test)
                self.scalers[name] = scaler
                
                model.fit(X_train_scaled, y_train)
                y_pred = model.predict(X_test_scaled)
            else:
                model.fit(X_train, y_train)
                y_pred = model.predict(X_test)
            
            # Store model
            self.models[name] = model
        
        return self.models
    
    def _prepare_future_features(self, df: pd.DataFrame, future_dates: pd.DatetimeIndex) -> List[List[float]]:
        """Prepare features for future dates"""
        feature_cols = [col for col in df.columns if col not in ['date', 'net_cash_flow', 'cumulative_cash']]
        
        future_features = []
        for date in future_dates:
            features = []
            
            # Time-based features
            features.extend([
                date.dayofweek,
                date.month,
                date.quarter,
                date.dayofyear,
                date.isocalendar().week
            ])
            
            # Lag features (use last known values)
            for lag in [1, 3, 7, 14, 30]:
                lag_cols = [f'cash_in_lag_{lag}', f'cash_out_lag_{lag}', f'net_cash_flow_lag_{lag}']
                for col in lag_cols:
                    if col in df.columns:
                        features.append(df[col].iloc[-1])
                    else:
                        features.append(0)
            
            # Rolling statistics (use last known values)
            for window in [7, 14, 30]:
                rolling_cols = [
                    f'cash_in_ma_{window}', f'cash_out_ma_{window}', 
                    f'net_cash_flow_ma_{window}', f'net_cash_flow_std_{window}',
                    f'net_cash_flow_min_{window}', f'net_cash_flow_max_{window}'
                ]
                for col in rolling_cols:
                    if col in df.columns:
                        features.append(df[col].iloc[-1])
                    else:
                        features.append(0)
            
            future_features.append(features)
        
        return future_features
    
    def _calculate_seasonal_patterns(self, df: pd.DataFrame) -> Dict:
        """Calculate seasonal patterns in cash flow"""
        df['day_of_year'] = df['date'].dt.dayofyear
        
        # Calculate average cash flow by day of year
        seasonal_patterns = {}
        for day in range(1, 367):
            day_data = df[df['day_of_year'] == day]['net_cash_flow']
            if len(day_data) > 0:
                seasonal_patterns[day] = day_data.mean()
        
        return seasonal_patterns
    
    def _decompose_timeseries(self, series: pd.Series) -> Tuple[List[float], List[float], List[float]]:
        """Simple time series decomposition"""
        # Trend (simple linear trend)
        x = np.arange(len(series))
        trend_coeffs = np.polyfit(x, series, 1)
        trend = [trend_coeffs[0] * i + trend_coeffs[1] for i in x]
        
        # Seasonal (simple moving average)
        seasonal = []
        for i in range(len(series)):
            if i < 7:
                seasonal.append(0)
            else:
                seasonal.append(series.iloc[i] - trend[i])
        
        # Residual
        residual = [series.iloc[i] - trend[i] - seasonal[i] for i in range(len(series))]
        
        return trend, seasonal, residual
    
    def _evaluate_models(self, df: pd.DataFrame, models: Dict) -> Dict:
        """Evaluate model performance"""
        feature_cols = [col for col in df.columns if col not in ['date', 'net_cash_flow', 'cumulative_cash']]
        X = df[feature_cols]
        y = df['net_cash_flow']
        
        performance = {}
        for name, model in models.items():
            if name in self.scalers:
                X_scaled = self.scalers[name].transform(X)
                y_pred = model.predict(X_scaled)
            else:
                y_pred = model.predict(X)
            
            performance[name] = {
                'mse': float(mean_squared_error(y, y_pred)),
                'mae': float(mean_absolute_error(y, y_pred)),
                'r2': float(r2_score(y, y_pred)),
                'rmse': float(np.sqrt(mean_squared_error(y, y_pred)))
            }
        
        return performance
    
    def _get_feature_importance(self, df: pd.DataFrame, models: Dict) -> Dict:
        """Get feature importance from models"""
        feature_cols = [col for col in df.columns if col not in ['date', 'net_cash_flow', 'cumulative_cash']]
        
        importance = {}
        for name, model in models.items():
            if hasattr(model, 'feature_importances_'):
                importance[name] = dict(zip(feature_cols, model.feature_importances_))
            elif hasattr(model, 'coef_'):
                importance[name] = dict(zip(feature_cols, np.abs(model.coef_)))
        
        return importance
    
    def _calculate_variance_reduction(self, projections_list: List[List[Dict]]) -> float:
        """Calculate variance reduction from ensemble"""
        if len(projections_list) < 2:
            return 0.0
        
        # Calculate variance of individual models vs ensemble
        individual_variances = []
        for projections in projections_list:
            flows = [p['net_cash_flow'] for p in projections]
            individual_variances.append(np.var(flows))
        
        avg_individual_variance = np.mean(individual_variances)
        
        # Calculate ensemble variance
        ensemble_flows = []
        for i in range(len(projections_list[0])):
            ensemble_flow = np.mean([proj[i]['net_cash_flow'] for proj in projections_list])
            ensemble_flows.append(ensemble_flow)
        
        ensemble_variance = np.var(ensemble_flows)
        
        # Variance reduction
        variance_reduction = (avg_individual_variance - ensemble_variance) / avg_individual_variance
        
        return float(variance_reduction)

# Legacy function for backward compatibility
def generate_liquidity_projection(data: List[Dict], method: str = 'ensemble') -> Dict:
    """Legacy function for backward compatibility"""
    engine = AdvancedProjectionEngine()
    return engine.generate_liquidity_projection(data, method)
