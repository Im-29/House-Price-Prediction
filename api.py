from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)

# Load your model
model = joblib.load("XGBoost_model.pkl")
model_features = joblib.load("model_features.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    input_data = pd.DataFrame({
        "property_type": [data["property_type"]],
        "district": [data["district"]],
        "tenure": [data["tenure"]],
        "month_year_of_transaction_date": [data["month_year_of_transaction_date"]],
        "main_floor_area": [float(data["main_floor_area"])]
    })

    # process data
    input_data = pd.get_dummies(input_data)
    input_data = input_data.reindex(columns=model_features, fill_value=0)

    # prediction
    prediction = model.predict(input_data)

    return jsonify({"price": float(prediction[0])})


# run server
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
