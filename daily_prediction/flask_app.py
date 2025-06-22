from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

model = joblib.load("donation_model.pkl")  # make sure your model file is in this folder

state_mapping = {"Johor": 0, "Selangor": 1, "Penang": 2, "Sabah": 3}

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    state = state_mapping.get(data['state'], 0)
    blood_units = data['blood_units']
    don_new = data['don_new']
    don_reg = data['don_reg']
    don_irreg = max(0, blood_units - don_new - don_reg)
    month = data['month']
    weekday = data['weekday']

    features = [[
    state,
    blood_units * 0.3,         # Blood_a
    blood_units * 0.25,        # Blood_b
    blood_units * 0.35,        # Blood_o
    blood_units * 0.1,         # Blood_ab
    blood_units,               # Location_centre
    0,                         # Location_mobile
    blood_units,               # Type_wholeblood
    0, 0, 0,                   # Platelet, Plasma, Other
    blood_units * 0.6,         # Civilian
    blood_units * 0.3,         # Student
    blood_units * 0.1,         # Police/Army
    don_new,
    don_reg,
    don_irreg,
    data['month'],             # Add Month
    data['day'],               # Add Day
    data['weekday']            # Add Weekday
    ]]

    prediction = model.predict(features)[0]
    return jsonify({"prediction": int(prediction)})

if __name__ == "__main__":
    app.run(debug=True)
