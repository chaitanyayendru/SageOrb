# Sample Data Files for SageOrb

This directory contains comprehensive sample data files for testing and demonstrating SageOrb's advanced liquidity optimization capabilities.

## 📁 File Structure

```
sample_data/
├── README.md                           # This file
├── basic/                              # Basic cash flow data
│   ├── simple_cash_flow.csv
│   ├── monthly_data.csv
│   └── quarterly_data.csv
├── advanced/                           # Advanced scenarios
│   ├── seasonal_business.csv
│   ├── startup_growth.csv
│   ├── retail_chain.csv
│   └── manufacturing.csv
├── complex/                            # Complex scenarios
│   ├── multinational_corp.csv
│   ├── investment_portfolio.csv
│   ├── real_estate.csv
│   └── ecommerce_platform.csv
├── edge_cases/                         # Edge cases and stress testing
│   ├── volatile_market.csv
│   ├── crisis_scenario.csv
│   ├── rapid_growth.csv
│   └── seasonal_peaks.csv
├── formats/                            # Different file formats
│   ├── cash_flow.xlsx
│   ├── financial_data.xls
│   └── sample_data.json
└── templates/                          # Template files
    ├── cash_flow_template.csv
    └── data_format_guide.md
```

## 🎯 Use Cases

### Basic Data Files
- **simple_cash_flow.csv**: Basic daily cash flow for a small business
- **monthly_data.csv**: Monthly aggregated data for medium business
- **quarterly_data.csv**: Quarterly data for strategic planning

### Advanced Scenarios
- **seasonal_business.csv**: Ice cream shop with strong seasonal patterns
- **startup_growth.csv**: Tech startup with rapid growth and funding rounds
- **retail_chain.csv**: Multi-location retail business with inventory cycles
- **manufacturing.csv**: Manufacturing company with production cycles

### Complex Scenarios
- **multinational_corp.csv**: Large corporation with multiple revenue streams
- **investment_portfolio.csv**: Investment firm with diverse asset classes
- **real_estate.csv**: Real estate company with property sales and rentals
- **ecommerce_platform.csv**: Online marketplace with transaction fees

### Edge Cases
- **volatile_market.csv**: Highly volatile market conditions
- **crisis_scenario.csv**: Economic downturn simulation
- **rapid_growth.csv**: Hyper-growth startup scenario
- **seasonal_peaks.csv**: Extreme seasonal variations

## 📊 Data Characteristics

### Column Structure
All CSV files include these columns:
- `date`: Transaction date (YYYY-MM-DD format)
- `cash_in`: Cash inflows (positive values)
- `cash_out`: Cash outflows (positive values)
- `category`: Transaction category (optional)
- `description`: Transaction description (optional)

### Data Patterns
- **Daily data**: 365-730 days of transactions
- **Monthly data**: 12-24 months of aggregated data
- **Quarterly data**: 4-8 quarters of strategic data
- **Mixed patterns**: Various business cycles and scenarios

## 🚀 How to Use

1. **Upload any file** to test the platform's data ingestion capabilities
2. **Compare different scenarios** to understand optimization strategies
3. **Test edge cases** to validate robust error handling
4. **Use templates** to create your own data files

## 📈 Expected Results

### Basic Scenarios
- Simple trend analysis and basic optimization
- Clear cash flow patterns and seasonal adjustments

### Advanced Scenarios
- Complex seasonality detection
- Growth pattern recognition
- Multi-factor optimization strategies

### Complex Scenarios
- Portfolio optimization recommendations
- Risk assessment across multiple revenue streams
- Strategic investment planning

### Edge Cases
- Stress testing capabilities
- Volatility handling
- Crisis scenario planning

## 🔧 Customization

You can modify these files or create your own using the templates provided. Ensure your data follows the required format:

```csv
date,cash_in,cash_out,category,description
2024-01-01,50000,30000,Sales,Monthly revenue
2024-01-02,0,5000,Expenses,Office rent
```

## 📝 Notes

- All monetary values are in USD
- Dates are in YYYY-MM-DD format
- Categories help with analysis and insights
- Descriptions provide context for transactions
- Files are optimized for different testing scenarios 