# SageOrb(Liquidity Optimization Tool)

A web application to analyze liquidity projections and optimize cash management strategies, using Python and Flask for backend, and React for frontend.

## Features
- **Data Ingestion**: Upload CSV data with cash flows.
- **Liquidity Projection**: Forecasts future cash balances based on past data.
- **Optimization Recommendations**: Suggests reserve requirements or investment strategies.

## Project Structure
```
sage-orb/
├── backend/
│   ├── app.py                  
│   ├── config.py               
│   ├── requirements.txt        
│   ├── utils/                  
│   │   ├── data_loader.py       
│   │   ├── optimizer.py        
│   │   └── projections.py      
│   └── models/                 
│       └── financial_data.py   
├── frontend/                   
│   ├── public
│   │   └── index.html          
│   ├── src
│   │   ├── App.js              
│   │   ├── components/         
│   │   │   ├── DataUpload.js   
│   │   │   ├── ProjectionChart.js 
│   │   │   └── OptimizationResult.js 
│   │   └── services/           
│   │       └── api.js          
│   ├── package.json            
│   └── .env                    
├── docker-compose.yml          
├── README.md                   
└── .gitignore                  
```

## Prerequisites

- Docker
- Python 3.8+
- Node.js (v14+)

## Setup

### Backend

1. Navigate to the `backend` folder:
    ```bash
    cd backend
    ```

2. Create a virtual environment and install dependencies:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

3. Start the Flask server:
    ```bash
    python app.py
    ```

### Frontend

1. Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the React server:
    ```bash
    npm start
    ```

### Using Docker

1. Run both backend and frontend services with Docker Compose:
    ```bash
    docker-compose up
    ```

## Usage

1. Access the application at `http://localhost:3000` for the frontend.
2. Use the data upload feature to input CSV files.
3. View liquidity projections and optimize cash flow using the provided options.

## Future Improvements
- **Advanced Optimizations**: Consider different scenarios and use linear programming for resource allocation.
- **Machine Learning**: Implement a predictive model for liquidity projections.
- **Secure Authentication**: Integrate JWT for user authentication and session management.