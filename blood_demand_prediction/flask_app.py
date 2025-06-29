from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

# Define the app
app = Flask(__name__)
CORS(app)

# 2. State mapping
state_mapping = {
    "Johor": 0,
    "Kedah": 1,
    "Kelantan": 2,
    "Melaka": 3,
    "Negeri Sembilan": 4,
    "Pahang": 5,
    "Penang": 6,
    "Perak": 7,
    "Perlis": 8,
    "Sabah": 9,
    "Sarawak": 10,
    "Selangor": 11,
    "Terengganu": 12,
    "Wilayah Persekutuan Kuala Lumpur": 13,
}

# Define your routes
@app.route('/predict_blood_types', methods=['POST'])
def predict_blood_types():
    data = request.get_json()

    # Extract inputs
    state = state_mapping.get(data['state'], 0)
    month = data['month']
    day = data['day']
    weekday = data['weekday']
    centre = data['location_centre']
    mobile = data['location_mobile']
    t_wb = data['type_wholeblood']
    t_pl = data['type_platelet']
    t_plas = data['type_plasma']
    t_other = data['type_other']
    s_civilian = data['social_civilian']
    s_student = data['social_student']
    s_police = data['social_policearmy']
    don_new = data['don_new']
    don_reg = data['don_reg']
    don_irreg = data['don_irreg']

    features = [[
        state, month, day, weekday,
        centre, mobile,
        t_wb, t_pl, t_plas, t_other,
        s_civilian, s_student, s_police,
        don_new, don_reg, don_irreg
    ]]

    # Load and predict
    model_a = joblib.load("model_blood_a.pkl")
    model_b = joblib.load("model_blood_b.pkl")
    model_o = joblib.load("model_blood_o.pkl")
    model_ab = joblib.load("model_blood_ab.pkl")

    return jsonify({
        "blood_a": round(model_a.predict(features)[0]),
        "blood_b": round(model_b.predict(features)[0]),
        "blood_o": round(model_o.predict(features)[0]),
        "blood_ab": round(model_ab.predict(features)[0])
    })

# 4. Add this to run the app
if __name__ == '__main__':
    app.run(debug=True)
