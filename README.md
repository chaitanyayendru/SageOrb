# SageOrb - Advanced Liquidity Optimization Platform

SageOrb is a comprehensive financial analytics platform that provides advanced liquidity projection, cash flow optimization, and business intelligence capabilities. Built with modern technologies and sophisticated algorithms, it helps businesses make data-driven financial decisions.

## 🚀 Features

### Core Capabilities
- **Advanced Data Ingestion**: Support for CSV, XLS, XLSX files with robust validation and preprocessing
- **Multi-Method Liquidity Projection**: Simple, Advanced, Ensemble, and ML-based forecasting
- **Comprehensive Optimization**: Basic, Advanced, and Comprehensive strategies with risk assessment
- **Business Intelligence**: AI-powered insights and actionable recommendations
- **Dataset Management**: Persistent storage and historical analysis tracking

### Advanced Analytics
- **Machine Learning Integration**: Random Forest, Gradient Boosting, and ensemble methods
- **Risk Assessment**: VaR, CVaR, Maximum Drawdown, Volatility analysis
- **Investment Analysis**: Short, medium, and long-term investment opportunities
- **Scenario Analysis**: Stress testing and what-if scenarios
- **Portfolio Optimization**: Asset allocation and investment strategy recommendations

### Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Visualizations**: Advanced charts and real-time data display
- **Drag & Drop Upload**: Intuitive file handling with progress indicators
- **Real-time Notifications**: Toast notifications for user feedback
- **Smooth Animations**: Framer Motion powered transitions

## 🏗️ Architecture

### Backend (Python/Flask)
- **Framework**: Flask with RESTful API design
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Caching**: Redis for performance optimization
- **Task Queue**: Celery for background processing
- **ML Libraries**: scikit-learn, NumPy, Pandas, SciPy
- **Validation**: Pydantic for data validation

### Frontend (React)
- **Framework**: React 18 with modern hooks
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Chart.js and Recharts for data visualization
- **Animations**: Framer Motion
- **Forms**: React Hook Form with validation

### Infrastructure
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose for local development
- **Database**: PostgreSQL 15 with persistent volumes
- **Caching**: Redis 7 for session and data caching

## 📋 Prerequisites

- **Docker & Docker Compose**: Latest version
- **Node.js**: 18+ (for local development)
- **Python**: 3.11+ (for local development)
- **Git**: For version control

## 🛠️ Installation & Setup

### Quick Start with Docker (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd SageOrb
   ```

2. **Start all services**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5432
   - Redis: localhost:6379

### Local Development Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variables
export FLASK_ENV=development
export DATABASE_URL=postgresql://postgres:password@localhost:5432/sageorb
export REDIS_URL=redis://localhost:6379/0
export SECRET_KEY=your-secret-key

# Initialize database
python -c "from models.financial_data import init_database; init_database()"

# Run the application
python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📊 Usage Guide

### 1. Data Upload
- Navigate to "Upload Data" section
- Drag and drop your CSV/XLS/XLSX file or click to browse
- Required columns: `date`, `cash_in`, `cash_out`
- Optional columns: `category`, `description`
- Add a description for your dataset
- Review data quality report and summary statistics

### 2. Liquidity Analysis
- Go to "Analysis" section
- Select your dataset or upload new data
- Choose projection method:
  - **Simple**: Basic moving average and trend analysis
  - **Advanced**: Seasonality and time series decomposition
  - **Ensemble**: Combined multiple methods for accuracy
  - **ML**: Machine learning-based forecasting
- Set forecast horizon (days)
- Configure risk level (Low/Medium/High)
- Run analysis and review results

### 3. Cash Flow Optimization
- Select optimization strategy:
  - **Basic**: Minimum reserve calculation with safety buffer
  - **Advanced**: Risk metrics and investment analysis
  - **Comprehensive**: Full ML integration with scenario analysis
- Review optimization results:
  - Overview metrics
  - Risk analysis (VaR, CVaR, volatility)
  - Investment opportunities
  - Actionable recommendations

### 4. Business Insights
- Generate AI-powered insights from your data
- Review cash flow trends and patterns
- Identify risk indicators and opportunities
- Get strategic recommendations

### 5. Dataset Management
- View all uploaded datasets
- Export data as CSV
- Track historical analyses
- Manage dataset metadata

## 🔧 Configuration

### Environment Variables

#### Backend
```bash
FLASK_ENV=development
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port/database
SECRET_KEY=your-secret-key
DEBUG=true
```

#### Frontend
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

### Database Schema
- **FinancialDataset**: Dataset metadata and file information
- **CashFlowRecord**: Individual cash flow entries
- **OptimizationResult**: Stored optimization results
- **PredictionModel**: Trained ML models

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Tests
```bash
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 📈 Performance Optimization

### Backend Optimizations
- **Caching**: Redis for frequently accessed data
- **Database Indexing**: Optimized queries with proper indexes
- **Background Processing**: Celery for heavy computations
- **Connection Pooling**: Efficient database connections

### Frontend Optimizations
- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo and useMemo for performance
- **Bundle Optimization**: Tree shaking and compression
- **CDN**: Static asset delivery optimization

## 🔒 Security Features

- **Input Validation**: Comprehensive data validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Prevention**: Content Security Policy
- **CORS Configuration**: Proper cross-origin settings
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with proper environment variables
docker-compose -f docker-compose.prod.yml up -d
```

### Environment-Specific Configurations
- **Development**: Hot reloading, debug mode
- **Staging**: Production-like with test data
- **Production**: Optimized builds, monitoring, logging

## 📚 API Documentation

### Core Endpoints
- `GET /health` - Health check
- `POST /api/v1/upload-data` - Data upload
- `POST /api/v1/liquidity-projection` - Generate projections
- `POST /api/v1/optimize` - Cash flow optimization
- `POST /api/v1/analyze` - Comprehensive analysis
- `POST /api/v1/insights` - Business insights
- `GET /api/v1/datasets` - List datasets
- `GET /api/v1/datasets/{id}` - Get specific dataset
- `GET /api/v1/export/{id}` - Export dataset

### Request/Response Examples
See the API documentation in the `/docs` endpoint when running the application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` endpoint
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🔮 Roadmap

### Upcoming Features
- **Real-time Analytics**: WebSocket integration for live updates
- **Advanced ML Models**: Deep learning and neural networks
- **Multi-tenant Support**: Organization and user management
- **API Rate Limiting**: Advanced request throttling
- **Advanced Reporting**: PDF generation and scheduled reports
- **Mobile App**: React Native mobile application
- **Integration APIs**: Third-party financial service integrations

### Performance Improvements
- **GraphQL API**: More efficient data fetching
- **Microservices**: Service decomposition for scalability
- **Kubernetes**: Container orchestration
- **Monitoring**: Prometheus and Grafana integration
- **Logging**: Structured logging with ELK stack

---

**SageOrb** - Empowering financial decisions with advanced analytics and machine learning.