import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Tuple
from scipy.optimize import minimize
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import logging
from datetime import datetime, timedelta
import json

logger = logging.getLogger(__name__)

class CashFlowOptimizer:
    """Advanced cash flow optimization engine"""
    
    def __init__(self, risk_level: str = 'moderate'):
        self.risk_level = risk_level
        self.risk_params = self._get_risk_parameters()
        
    def _get_risk_parameters(self) -> Dict:
        """Get risk parameters based on risk level"""
        risk_configs = {
            'conservative': {
                'min_reserve_ratio': 0.2,
                'max_investment_ratio': 0.1,
                'volatility_tolerance': 0.05,
                'liquidity_buffer': 0.15
            },
            'moderate': {
                'min_reserve_ratio': 0.15,
                'max_investment_ratio': 0.25,
                'volatility_tolerance': 0.1,
                'liquidity_buffer': 0.1
            },
            'aggressive': {
                'min_reserve_ratio': 0.1,
                'max_investment_ratio': 0.4,
                'volatility_tolerance': 0.2,
                'liquidity_buffer': 0.05
            }
        }
        return risk_configs.get(self.risk_level, risk_configs['moderate'])
    
    def optimize_cash_flow(self, data: List[Dict], strategy: str = 'comprehensive') -> Dict:
        """
        Optimize cash flow using various strategies
        
        Args:
            data: List of cash flow records
            strategy: Optimization strategy ('basic', 'advanced', 'comprehensive')
        
        Returns:
            Optimization results
        """
        df = pd.DataFrame(data)
        
        if strategy == 'basic':
            return self._basic_optimization(df)
        elif strategy == 'advanced':
            return self._advanced_optimization(df)
        elif strategy == 'comprehensive':
            return self._comprehensive_optimization(df)
        else:
            raise ValueError(f"Unknown strategy: {strategy}")
    
    def _basic_optimization(self, df: pd.DataFrame) -> Dict:
        """Basic cash flow optimization"""
        df['net_cash_flow'] = df['cash_in'] - df['cash_out']
        
        # Calculate minimum reserve
        min_net_flow = df['net_cash_flow'].min()
        min_reserve = abs(min_net_flow) if min_net_flow < 0 else 0
        
        # Add safety buffer
        safety_buffer = min_reserve * self.risk_params['liquidity_buffer']
        recommended_reserve = min_reserve + safety_buffer
        
        return {
            'strategy': 'basic',
            'risk_level': self.risk_level,
            'minimum_reserve': float(recommended_reserve),
            'safety_buffer': float(safety_buffer),
            'cash_flow_volatility': float(df['net_cash_flow'].std()),
            'recommendations': [
                f"Maintain minimum reserve of ${recommended_reserve:,.2f}",
                f"Monitor cash flow volatility: {df['net_cash_flow'].std():.2f}",
                "Consider daily cash flow monitoring"
            ]
        }
    
    def _advanced_optimization(self, df: pd.DataFrame) -> Dict:
        """Advanced optimization with multiple strategies"""
        df['net_cash_flow'] = df['cash_in'] - df['cash_out']
        df['cumulative_cash'] = df['net_cash_flow'].cumsum()
        
        # Calculate various metrics
        avg_daily_cash_flow = df['net_cash_flow'].mean()
        cash_flow_std = df['net_cash_flow'].std()
        min_balance = df['cumulative_cash'].min()
        
        # Monte Carlo simulation for risk assessment
        risk_metrics = self._calculate_risk_metrics(df)
        
        # Investment opportunity analysis
        investment_analysis = self._analyze_investment_opportunities(df)
        
        # Cash flow forecasting
        forecast = self._forecast_cash_flow(df)
        
        return {
            'strategy': 'advanced',
            'risk_level': self.risk_level,
            'risk_metrics': risk_metrics,
            'investment_analysis': investment_analysis,
            'forecast': forecast,
            'recommendations': self._generate_advanced_recommendations(df, risk_metrics, investment_analysis)
        }
    
    def _comprehensive_optimization(self, df: pd.DataFrame) -> Dict:
        """Comprehensive optimization with ML and advanced analytics"""
        # Prepare data for ML
        df_ml = self._prepare_ml_data(df)
        
        # Train prediction model
        prediction_model = self._train_prediction_model(df_ml)
        
        # Scenario analysis
        scenarios = self._run_scenario_analysis(df_ml)
        
        # Portfolio optimization
        portfolio_opt = self._optimize_portfolio_allocation(df_ml)
        
        # Stress testing
        stress_test = self._stress_test_scenarios(df_ml)
        
        return {
            'strategy': 'comprehensive',
            'risk_level': self.risk_level,
            'prediction_model': prediction_model,
            'scenarios': scenarios,
            'portfolio_optimization': portfolio_opt,
            'stress_testing': stress_test,
            'recommendations': self._generate_comprehensive_recommendations(
                df_ml, prediction_model, scenarios, portfolio_opt, stress_test
            )
        }
    
    def _calculate_risk_metrics(self, df: pd.DataFrame) -> Dict:
        """Calculate comprehensive risk metrics"""
        net_cash_flow = df['net_cash_flow']
        cumulative_cash = df['cumulative_cash']
        
        # Value at Risk (VaR)
        var_95 = np.percentile(net_cash_flow, 5)
        var_99 = np.percentile(net_cash_flow, 1)
        
        # Expected Shortfall (CVaR)
        cvar_95 = net_cash_flow[net_cash_flow <= var_95].mean()
        cvar_99 = net_cash_flow[net_cash_flow <= var_99].mean()
        
        # Maximum drawdown
        running_max = cumulative_cash.expanding().max()
        drawdown = (cumulative_cash - running_max) / running_max
        max_drawdown = drawdown.min()
        
        # Volatility measures
        rolling_vol = net_cash_flow.rolling(30).std()
        avg_volatility = rolling_vol.mean()
        
        return {
            'var_95': float(var_95),
            'var_99': float(var_99),
            'cvar_95': float(cvar_95),
            'cvar_99': float(cvar_99),
            'max_drawdown': float(max_drawdown),
            'avg_volatility': float(avg_volatility),
            'volatility_trend': float(rolling_vol.iloc[-1] - rolling_vol.iloc[0])
        }
    
    def _analyze_investment_opportunities(self, df: pd.DataFrame) -> Dict:
        """Analyze investment opportunities based on cash flow patterns"""
        net_cash_flow = df['net_cash_flow']
        cumulative_cash = df['cumulative_cash']
        
        # Identify surplus periods
        surplus_periods = net_cash_flow[net_cash_flow > 0]
        avg_surplus = surplus_periods.mean() if len(surplus_periods) > 0 else 0
        
        # Calculate potential investment amount
        max_investment = cumulative_cash.max() * self.risk_params['max_investment_ratio']
        
        # Investment strategies
        strategies = {
            'short_term': {
                'amount': min(avg_surplus * 7, max_investment * 0.3),
                'duration': '7-30 days',
                'risk': 'low',
                'expected_return': 0.02
            },
            'medium_term': {
                'amount': min(avg_surplus * 30, max_investment * 0.5),
                'duration': '1-6 months',
                'risk': 'medium',
                'expected_return': 0.04
            },
            'long_term': {
                'amount': min(avg_surplus * 90, max_investment * 0.2),
                'duration': '6+ months',
                'risk': 'high',
                'expected_return': 0.08
            }
        }
        
        return {
            'total_surplus': float(surplus_periods.sum()),
            'avg_surplus': float(avg_surplus),
            'max_investment': float(max_investment),
            'strategies': strategies
        }
    
    def _forecast_cash_flow(self, df: pd.DataFrame, days: int = 30) -> Dict:
        """Forecast future cash flows using time series analysis"""
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Simple moving average forecast
        net_cash_flow = df['net_cash_flow']
        ma_7 = net_cash_flow.rolling(7).mean()
        ma_30 = net_cash_flow.rolling(30).mean()
        
        # Trend analysis
        trend = np.polyfit(range(len(net_cash_flow)), net_cash_flow, 1)[0]
        
        # Generate forecast
        last_date = df['date'].max()
        forecast_dates = pd.date_range(start=last_date + timedelta(days=1), periods=days, freq='D')
        
        # Simple forecast based on recent average and trend
        base_forecast = ma_7.iloc[-1] if not pd.isna(ma_7.iloc[-1]) else net_cash_flow.mean()
        forecast_values = [base_forecast + trend * i for i in range(days)]
        
        return {
            'forecast_dates': [d.strftime('%Y-%m-%d') for d in forecast_dates],
            'forecast_values': [float(v) for v in forecast_values],
            'confidence_interval': {
                'lower': [float(v * 0.8) for v in forecast_values],
                'upper': [float(v * 1.2) for v in forecast_values]
            },
            'trend': float(trend),
            'accuracy_metrics': {
                'mae': float(np.mean(np.abs(net_cash_flow - ma_7))),
                'rmse': float(np.sqrt(mean_squared_error(net_cash_flow[7:], ma_7[7:])))
            }
        }
    
    def _prepare_ml_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Prepare data for machine learning models"""
        df_ml = df.copy()
        
        # Add time-based features
        df_ml['date'] = pd.to_datetime(df_ml['date'])
        df_ml['day_of_week'] = df_ml['date'].dt.dayofweek
        df_ml['month'] = df_ml['date'].dt.month
        df_ml['quarter'] = df_ml['date'].dt.quarter
        df_ml['day_of_year'] = df_ml['date'].dt.dayofyear
        
        # Add lag features
        for lag in [1, 3, 7, 14, 30]:
            df_ml[f'cash_in_lag_{lag}'] = df_ml['cash_in'].shift(lag)
            df_ml[f'cash_out_lag_{lag}'] = df_ml['cash_out'].shift(lag)
            df_ml[f'net_cash_flow_lag_{lag}'] = df_ml['net_cash_flow'].shift(lag)
        
        # Add rolling statistics
        for window in [7, 14, 30]:
            df_ml[f'cash_in_ma_{window}'] = df_ml['cash_in'].rolling(window).mean()
            df_ml[f'cash_out_ma_{window}'] = df_ml['cash_out'].rolling(window).mean()
            df_ml[f'net_cash_flow_ma_{window}'] = df_ml['net_cash_flow'].rolling(window).mean()
            df_ml[f'net_cash_flow_std_{window}'] = df_ml['net_cash_flow'].rolling(window).std()
        
        # Remove rows with NaN values
        df_ml = df_ml.dropna()
        
        return df_ml
    
    def _train_prediction_model(self, df: pd.DataFrame) -> Dict:
        """Train machine learning model for cash flow prediction"""
        # Prepare features and target
        feature_cols = [col for col in df.columns if col not in ['date', 'net_cash_flow', 'cumulative_cash']]
        X = df[feature_cols]
        y = df['net_cash_flow']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = model.predict(X_test)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        # Feature importance
        feature_importance = dict(zip(feature_cols, model.feature_importances_))
        top_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return {
            'model_type': 'RandomForest',
            'accuracy': {
                'mse': float(mse),
                'r2': float(r2),
                'rmse': float(np.sqrt(mse))
            },
            'feature_importance': dict(top_features),
            'training_samples': len(X_train),
            'test_samples': len(X_test)
        }
    
    def _run_scenario_analysis(self, df: pd.DataFrame) -> Dict:
        """Run scenario analysis for different market conditions"""
        scenarios = {}
        
        # Base scenario
        base_cash_flow = df['net_cash_flow'].mean()
        base_volatility = df['net_cash_flow'].std()
        
        # Optimistic scenario (20% better)
        scenarios['optimistic'] = {
            'cash_flow_multiplier': 1.2,
            'volatility_multiplier': 0.8,
            'expected_cash_flow': base_cash_flow * 1.2,
            'expected_volatility': base_volatility * 0.8,
            'probability': 0.25
        }
        
        # Base scenario
        scenarios['base'] = {
            'cash_flow_multiplier': 1.0,
            'volatility_multiplier': 1.0,
            'expected_cash_flow': base_cash_flow,
            'expected_volatility': base_volatility,
            'probability': 0.5
        }
        
        # Pessimistic scenario (20% worse)
        scenarios['pessimistic'] = {
            'cash_flow_multiplier': 0.8,
            'volatility_multiplier': 1.2,
            'expected_cash_flow': base_cash_flow * 0.8,
            'expected_volatility': base_volatility * 1.2,
            'probability': 0.25
        }
        
        return scenarios
    
    def _optimize_portfolio_allocation(self, df: pd.DataFrame) -> Dict:
        """Optimize portfolio allocation for surplus cash"""
        # Calculate surplus cash
        surplus_cash = df['net_cash_flow'][df['net_cash_flow'] > 0].sum()
        
        # Define investment options
        investments = {
            'cash_reserve': {'return': 0.01, 'risk': 0.01, 'liquidity': 1.0},
            'money_market': {'return': 0.025, 'risk': 0.02, 'liquidity': 0.9},
            'short_term_bonds': {'return': 0.04, 'risk': 0.05, 'liquidity': 0.7},
            'equity_funds': {'return': 0.08, 'risk': 0.15, 'liquidity': 0.5}
        }
        
        # Simple optimization based on risk tolerance
        if self.risk_level == 'conservative':
            allocation = {
                'cash_reserve': 0.6,
                'money_market': 0.3,
                'short_term_bonds': 0.1,
                'equity_funds': 0.0
            }
        elif self.risk_level == 'moderate':
            allocation = {
                'cash_reserve': 0.4,
                'money_market': 0.3,
                'short_term_bonds': 0.2,
                'equity_funds': 0.1
            }
        else:  # aggressive
            allocation = {
                'cash_reserve': 0.2,
                'money_market': 0.2,
                'short_term_bonds': 0.3,
                'equity_funds': 0.3
            }
        
        # Calculate expected returns
        expected_return = sum(allocation[k] * investments[k]['return'] for k in allocation)
        expected_risk = sum(allocation[k] * investments[k]['risk'] for k in allocation)
        
        return {
            'total_surplus': float(surplus_cash),
            'allocation': allocation,
            'expected_return': float(expected_return),
            'expected_risk': float(expected_risk),
            'investment_options': investments
        }
    
    def _stress_test_scenarios(self, df: pd.DataFrame) -> Dict:
        """Run stress tests for extreme scenarios"""
        base_cash_flow = df['net_cash_flow'].mean()
        base_volatility = df['net_cash_flow'].std()
        
        stress_scenarios = {
            'market_crash': {
                'cash_flow_impact': -0.5,  # 50% reduction
                'volatility_impact': 2.0,  # 100% increase
                'probability': 0.05,
                'description': 'Severe market downturn affecting all cash flows'
            },
            'liquidity_crisis': {
                'cash_flow_impact': -0.3,
                'volatility_impact': 1.5,
                'probability': 0.1,
                'description': 'Short-term liquidity constraints'
            },
            'operational_disruption': {
                'cash_flow_impact': -0.4,
                'volatility_impact': 1.8,
                'probability': 0.08,
                'description': 'Major operational issues affecting cash flows'
            }
        }
        
        # Calculate impact on reserves
        reserve_requirements = {}
        for scenario, params in stress_scenarios.items():
            stressed_cash_flow = base_cash_flow * (1 + params['cash_flow_impact'])
            stressed_volatility = base_volatility * params['volatility_impact']
            
            # Calculate required reserve for this scenario
            required_reserve = abs(stressed_cash_flow) + (stressed_volatility * 2)  # 2-sigma buffer
            
            reserve_requirements[scenario] = {
                'required_reserve': float(required_reserve),
                'cash_flow_impact': float(stressed_cash_flow),
                'volatility_impact': float(stressed_volatility),
                'probability': params['probability'],
                'description': params['description']
            }
        
        return {
            'scenarios': reserve_requirements,
            'max_reserve_requirement': max(r['required_reserve'] for r in reserve_requirements.values()),
            'expected_reserve_requirement': sum(
                r['required_reserve'] * r['probability'] for r in reserve_requirements.values()
            )
        }
    
    def _generate_advanced_recommendations(self, df: pd.DataFrame, risk_metrics: Dict, investment_analysis: Dict) -> List[str]:
        """Generate advanced recommendations"""
        recommendations = []
        
        # Risk-based recommendations
        if risk_metrics['max_drawdown'] < -0.2:
            recommendations.append("High drawdown detected - consider increasing reserve buffer")
        
        if risk_metrics['avg_volatility'] > self.risk_params['volatility_tolerance']:
            recommendations.append("High volatility detected - implement cash flow smoothing strategies")
        
        # Investment recommendations
        if investment_analysis['avg_surplus'] > 0:
            recommendations.append(f"Consider investing ${investment_analysis['avg_surplus']:,.2f} in short-term instruments")
        
        # General recommendations
        recommendations.extend([
            "Implement daily cash flow monitoring",
            "Set up automated alerts for cash flow anomalies",
            "Consider diversifying cash flow sources"
        ])
        
        return recommendations
    
    def _generate_comprehensive_recommendations(self, df: pd.DataFrame, prediction_model: Dict, 
                                             scenarios: Dict, portfolio_opt: Dict, stress_test: Dict) -> List[str]:
        """Generate comprehensive recommendations"""
        recommendations = []
        
        # Model-based recommendations
        if prediction_model['accuracy']['r2'] > 0.7:
            recommendations.append("High prediction accuracy - consider automated cash flow forecasting")
        else:
            recommendations.append("Low prediction accuracy - improve data quality and feature engineering")
        
        # Portfolio recommendations
        if portfolio_opt['expected_return'] > 0.05:
            recommendations.append(f"High return potential: {portfolio_opt['expected_return']:.1%} expected return")
        
        # Stress test recommendations
        max_reserve = stress_test['max_reserve_requirement']
        recommendations.append(f"Maintain reserve of ${max_reserve:,.2f} for extreme scenarios")
        
        # Scenario-based recommendations
        if scenarios['pessimistic']['expected_cash_flow'] < 0:
            recommendations.append("Prepare for negative cash flow scenarios")
        
        return recommendations

# Legacy function for backward compatibility
def optimize_cash_flow(data: List[Dict], risk_level: str = 'moderate', strategy: str = 'comprehensive') -> Dict:
    """Legacy function for backward compatibility"""
    optimizer = CashFlowOptimizer(risk_level)
    return optimizer.optimize_cash_flow(data, strategy)
