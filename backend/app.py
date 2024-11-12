from flask import Flask, request, jsonify
from utils.data_loader import load_data
from utils.optimizer import optimize_cash_flow
from utils.projections import generate_liquidity_projection

app = Flask(__name__)

@app.route('/upload-data', methods=['POST'])
def upload_data():
    file = request.files['file']
    data = load_data(file)
    return jsonify({"status": "Data uploaded successfully", "data": data})

@app.route('/liquidity-projection', methods=['POST'])
def liquidity_projection():
    data = request.json.get("data")
    projection = generate_liquidity_projection(data)
    return jsonify({"projections": projection})

@app.route('/optimize', methods=['POST'])
def optimize():
    data = request.json.get("data")
    optimization_result = optimize_cash_flow(data)
    return jsonify(optimization_result)

if __name__ == "__main__":
    app.run(debug=True)
