from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import logging
from datetime import datetime
import json
import traceback
from werkzeug.utils import secure_filename
import pandas as pd

# Import our enhanced modules
from utils.data_loader import load_data, generate_sample_data
from utils.optimizer import CashFlowOptimizer
from utils.projections import AdvancedProjectionEngine
from models.financial_data import init_database, get_session, FinancialDataset, CashFlowRecord
from config import config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(config['default'])

# Enable CORS
CORS(app)

# Initialize database
init_database(app.config['DATABASE_URL'])

# Create uploads directory
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '2.0.0'
    })

@app.route('/api/v1/upload-data', methods=['POST'])
def upload_data():
    """Enhanced data upload endpoint with validation and processing"""
    try:
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No file provided'
            }), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': f'File type not allowed. Allowed types: {list(app.config["ALLOWED_EXTENSIONS"])}'
            }), 400
        
        # Load and process data
        result = load_data(file, validate=True, preprocess=True)
        
        if not result['success']:
            return jsonify(result), 400
        
        # Save file
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Store in database
        session = get_session(app.config['DATABASE_URL'])
        try:
            dataset = FinancialDataset(
                name=filename,
                description=request.form.get('description', ''),
                file_path=file_path,
                metadata=json.dumps(result['metadata'])
            )
            session.add(dataset)
            session.commit()
            
            # Store cash flow records
            for record in result['data']:
                cash_record = CashFlowRecord(
                    dataset_id=dataset.id,
                    date=datetime.strptime(record['date'], '%Y-%m-%d'),
                    cash_in=record['cash_in'],
                    cash_out=record['cash_out'],
                    category=record.get('category'),
                    description=record.get('description')
                )
                session.add(cash_record)
            
            session.commit()
            
            result['dataset_id'] = dataset.id
            
        except Exception as e:
            session.rollback()
            logger.error(f"Database error: {str(e)}")
            return jsonify({
                'success': False,
                'error': 'Failed to save data to database'
            }), 500
        finally:
            session.close()
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/v1/generate-sample-data', methods=['POST'])
def generate_sample():
    """Generate sample data for testing"""
    try:
        data = request.json or {}
        days = data.get('days', 365)
        
        # Generate sample data
        df = generate_sample_data(days)
        sample_data = df.to_dict(orient='records')
        
        return jsonify({
            'success': True,
            'data': sample_data,
            'metadata': {
                'days': days,
                'records': len(sample_data),
                'date_range': {
                    'start': df['date'].min().strftime('%Y-%m-%d'),
                    'end': df['date'].max().strftime('%Y-%m-%d')
                }
            }
        })
        
    except Exception as e:
        logger.error(f"Sample data generation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate sample data'
        }), 500

@app.route('/api/v1/liquidity-projection', methods=['POST'])
def liquidity_projection():
    """Enhanced liquidity projection endpoint"""
    try:
        data = request.json
        
        if not data or 'data' not in data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Get projection parameters
        method = data.get('method', 'ensemble')
        horizon = data.get('horizon', 90)
        
        # Validate method
        valid_methods = ['simple', 'advanced', 'ensemble', 'ml']
        if method not in valid_methods:
            return jsonify({
                'success': False,
                'error': f'Invalid method. Valid methods: {valid_methods}'
            }), 400
        
        # Generate projection
        engine = AdvancedProjectionEngine(forecast_horizon=horizon)
        projection = engine.generate_liquidity_projection(data['data'], method)
        
        return jsonify({
            'success': True,
            'projection': projection
        })
        
    except Exception as e:
        logger.error(f"Projection error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate projection'
        }), 500

@app.route('/api/v1/optimize', methods=['POST'])
def optimize():
    """Enhanced optimization endpoint with multiple strategies"""
    try:
        data = request.json
        
        if not data or 'data' not in data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Get optimization parameters
        strategy = data.get('strategy', 'comprehensive')
        risk_level = data.get('risk_level', 'moderate')
        
        # Validate parameters
        valid_strategies = ['basic', 'advanced', 'comprehensive']
        valid_risk_levels = ['conservative', 'moderate', 'aggressive']
        
        if strategy not in valid_strategies:
            return jsonify({
                'success': False,
                'error': f'Invalid strategy. Valid strategies: {valid_strategies}'
            }), 400
        
        if risk_level not in valid_risk_levels:
            return jsonify({
                'success': False,
                'error': f'Invalid risk level. Valid levels: {valid_risk_levels}'
            }), 400
        
        # Perform optimization
        optimizer = CashFlowOptimizer(risk_level=risk_level)
        optimization_result = optimizer.optimize_cash_flow(data['data'], strategy)
        
        return jsonify({
            'success': True,
            'optimization': optimization_result
        })
        
    except Exception as e:
        logger.error(f"Optimization error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to perform optimization'
        }), 500

@app.route('/api/v1/analyze', methods=['POST'])
def analyze():
    """Comprehensive analysis endpoint combining projections and optimization"""
    try:
        data = request.json
        
        if not data or 'data' not in data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Get analysis parameters
        projection_method = data.get('projection_method', 'ensemble')
        optimization_strategy = data.get('optimization_strategy', 'comprehensive')
        risk_level = data.get('risk_level', 'moderate')
        horizon = data.get('horizon', 90)
        
        # Generate projection
        engine = AdvancedProjectionEngine(forecast_horizon=horizon)
        projection = engine.generate_liquidity_projection(data['data'], projection_method)
        
        # Perform optimization
        optimizer = CashFlowOptimizer(risk_level=risk_level)
        optimization = optimizer.optimize_cash_flow(data['data'], optimization_strategy)
        
        # Combine results
        analysis = {
            'projection': projection,
            'optimization': optimization,
            'summary': {
                'total_records': len(data['data']),
                'projection_horizon': horizon,
                'risk_level': risk_level,
                'strategy': optimization_strategy,
                'method': projection_method
            }
        }
        
        return jsonify({
            'success': True,
            'analysis': analysis
        })
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to perform analysis'
        }), 500

@app.route('/api/v1/datasets', methods=['GET'])
def list_datasets():
    """List all uploaded datasets"""
    try:
        session = get_session(app.config['DATABASE_URL'])
        datasets = session.query(FinancialDataset).all()
        
        result = [dataset.to_dict() for dataset in datasets]
        
        session.close()
        
        return jsonify({
            'success': True,
            'datasets': result
        })
        
    except Exception as e:
        logger.error(f"Dataset listing error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to list datasets'
        }), 500

@app.route('/api/v1/datasets/<int:dataset_id>', methods=['GET'])
def get_dataset(dataset_id):
    """Get specific dataset with cash flow records"""
    try:
        session = get_session(app.config['DATABASE_URL'])
        dataset = session.query(FinancialDataset).filter_by(id=dataset_id).first()
        
        if not dataset:
            return jsonify({
                'success': False,
                'error': 'Dataset not found'
            }), 404
        
        # Get cash flow records
        records = session.query(CashFlowRecord).filter_by(dataset_id=dataset_id).all()
        cash_flow_data = [record.to_dict() for record in records]
        
        session.close()
        
        return jsonify({
            'success': True,
            'dataset': dataset.to_dict(),
            'cash_flow_data': cash_flow_data
        })
        
    except Exception as e:
        logger.error(f"Dataset retrieval error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to retrieve dataset'
        }), 500

@app.route('/api/v1/export/<int:dataset_id>', methods=['GET'])
def export_dataset(dataset_id):
    """Export dataset as CSV"""
    try:
        session = get_session(app.config['DATABASE_URL'])
        dataset = session.query(FinancialDataset).filter_by(id=dataset_id).first()
        
        if not dataset:
            return jsonify({
                'success': False,
                'error': 'Dataset not found'
            }), 404
        
        # Get cash flow records
        records = session.query(CashFlowRecord).filter_by(dataset_id=dataset_id).all()
        
        # Convert to DataFrame
        data = []
        for record in records:
            data.append({
                'date': record.date.strftime('%Y-%m-%d'),
                'cash_in': record.cash_in,
                'cash_out': record.cash_out,
                'category': record.category,
                'description': record.description
            })
        
        df = pd.DataFrame(data)
        
        # Create temporary file
        export_path = os.path.join(app.config['UPLOAD_FOLDER'], f'export_{dataset_id}.csv')
        df.to_csv(export_path, index=False)
        
        session.close()
        
        return send_file(export_path, as_attachment=True, download_name=f'{dataset.name}_export.csv')
        
    except Exception as e:
        logger.error(f"Export error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to export dataset'
        }), 500

@app.route('/api/v1/insights', methods=['POST'])
def generate_insights():
    """Generate business insights from data"""
    try:
        data = request.json
        
        if not data or 'data' not in data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        df = pd.DataFrame(data['data'])
        df['date'] = pd.to_datetime(df['date'])
        df['net_cash_flow'] = df['cash_in'] - df['cash_out']
        
        # Calculate insights
        insights = {
            'cash_flow_summary': {
                'total_cash_in': float(df['cash_in'].sum()),
                'total_cash_out': float(df['cash_out'].sum()),
                'net_cash_flow': float(df['net_cash_flow'].sum()),
                'avg_daily_cash_flow': float(df['net_cash_flow'].mean()),
                'cash_flow_volatility': float(df['net_cash_flow'].std())
            },
            'trends': {
                'trend_direction': 'increasing' if df['net_cash_flow'].iloc[-1] > df['net_cash_flow'].iloc[0] else 'decreasing',
                'trend_strength': float(abs(df['net_cash_flow'].corr(pd.Series(range(len(df)))))),
                'seasonality_detected': _detect_seasonality(df)
            },
            'risk_indicators': {
                'negative_cash_flow_days': int(len(df[df['net_cash_flow'] < 0])),
                'cash_flow_volatility_ratio': float(df['net_cash_flow'].std() / abs(df['net_cash_flow'].mean())) if df['net_cash_flow'].mean() != 0 else 0,
                'max_drawdown': float(_calculate_max_drawdown(df))
            },
            'recommendations': _generate_insights_recommendations(df)
        }
        
        return jsonify({
            'success': True,
            'insights': insights
        })
        
    except Exception as e:
        logger.error(f"Insights generation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate insights'
        }), 500

def _detect_seasonality(df):
    """Detect seasonality in cash flow data"""
    # Simple seasonality detection using autocorrelation
    net_cash_flow = df['net_cash_flow']
    autocorr = [net_cash_flow.autocorr(lag=i) for i in range(1, 31)]
    max_autocorr = max(autocorr) if autocorr else 0
    return max_autocorr > 0.3

def _calculate_max_drawdown(df):
    """Calculate maximum drawdown"""
    cumulative = df['net_cash_flow'].cumsum()
    running_max = cumulative.expanding().max()
    drawdown = (cumulative - running_max) / running_max
    return drawdown.min()

def _generate_insights_recommendations(df):
    """Generate business recommendations based on data"""
    recommendations = []
    
    net_cash_flow = df['net_cash_flow']
    avg_cash_flow = net_cash_flow.mean()
    volatility = net_cash_flow.std()
    
    # Cash flow recommendations
    if avg_cash_flow < 0:
        recommendations.append("Negative average cash flow detected - review expenses and revenue streams")
    
    if volatility > abs(avg_cash_flow) * 0.5:
        recommendations.append("High cash flow volatility - consider implementing cash flow smoothing strategies")
    
    # Trend recommendations
    if len(df) > 30:
        recent_avg = net_cash_flow.tail(30).mean()
        if recent_avg > avg_cash_flow * 1.2:
            recommendations.append("Improving cash flow trend - consider investment opportunities")
        elif recent_avg < avg_cash_flow * 0.8:
            recommendations.append("Declining cash flow trend - review business operations")
    
    # General recommendations
    recommendations.extend([
        "Monitor cash flow daily for early warning signs",
        "Maintain adequate cash reserves for unexpected expenses",
        "Consider diversifying revenue sources to reduce volatility"
    ])
    
    return recommendations

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == "__main__":
    app.run(debug=app.config['DEBUG'], host='0.0.0.0', port=5000)
