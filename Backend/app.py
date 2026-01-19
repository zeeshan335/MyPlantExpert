# app.py
"""
Flask API to serve predictions. Loads model.joblib produced by train_model.py.
Endpoint:
  POST /predict
  Body: { "plant1": <id>, "plant2": <id> }
  Response: { "result": { name, water, sunlight, successRate, description, category } }
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import random

app = Flask(__name__)
CORS(app)

# ---------- Same full plantData (copied here) ----------
plantData = [
  {"id":1,"name":"Gulab (Rose)","category":"Flower","water":"Medium","sunlight":"Full sun","compatible":[2,3,7,8,22,39,42],"image":"rose.jpg","description":"Pakistan's national flower with beautiful fragrant blooms"},
  {"id":2,"name":"Champa","category":"Flower","water":"Medium","sunlight":"Full sun","compatible":[1,3,8,38,41],"image":"champa.jpg","description":"Fragrant yellow-white flowers popular in South Asia"},
  {"id":3,"name":"Motia (Jasmine)","category":"Flower","water":"Medium","sunlight":"Partial shade","compatible":[1,2,7,8,40,43],"image":"jasmine.jpg","description":"Highly fragrant white flowers used in garlands"},
  {"id":8,"name":"Gul-e-Daudi (Chrysanthemum)","category":"Flower","water":"Medium","sunlight":"Full sun","compatible":[1,2,3,38,42],"image":"chrysanthemum.jpg","description":"Popular autumn flower in various colors"},
  {"id":21,"name":"Surajmukhi (Sunflower)","category":"Flower","water":"Medium","sunlight":"Full sun","compatible":[1,22,23,39,43],"image":"sunflower.jpg","description":"Tall flower with bright yellow petals and edible seeds"},
  {"id":22,"name":"Genda (Marigold)","category":"Flower","water":"Low","sunlight":"Full sun","compatible":[1,21,23,40,41],"image":"marigold.jpg","description":"Sacred orange-yellow flower used in ceremonies"},
  {"id":23,"name":"Raat ki Rani","category":"Flower","water":"Medium","sunlight":"Partial shade","compatible":[1,21,22,39,40],"image":"nightblooming.jpg","description":"Night-blooming jasmine with intense fragrance"},
  {"id":38,"name":"Chandni","category":"Flower","water":"Medium","sunlight":"Partial sun","compatible":[2,8,41,43],"image":"chandni.jpg","description":"Fragrant white flowers that bloom abundantly"},
  {"id":39,"name":"Nargis (Narcissus)","category":"Flower","water":"Medium","sunlight":"Full sun","compatible":[1,21,23,42],"image":"narcissus.jpg","description":"White flowers with orange centers popular in poetry"},
  {"id":40,"name":"Mehndi (Henna)","category":"Flower","water":"Low","sunlight":"Full sun","compatible":[3,22,23,43],"image":"henna.jpg","description":"Small fragrant flowers and leaves used for body art"},
  {"id":41,"name":"Kaner (Oleander)","category":"Flower","water":"Low","sunlight":"Full sun","compatible":[2,22,38],"image":"oleander.jpg","description":"Drought-resistant flowering shrub with pink or white blooms"},
  {"id":42,"name":"Gul-e-Nargis (Daffodil)","category":"Flower","water":"Medium","sunlight":"Full/partial sun","compatible":[1,8,39],"image":"daffodil.jpg","description":"Spring bulb with trumpet-shaped yellow flowers"},
  {"id":43,"name":"Gurhal (Hibiscus)","category":"Flower","water":"Medium","sunlight":"Full sun","compatible":[3,21,38,40],"image":"hibiscus.jpg","description":"Large colorful flowers used in teas and religious offerings"},
  {"id":4,"name":"Tamatar (Tomato)","category":"Vegetable","water":"Medium","sunlight":"Full sun","compatible":[5,9,13,14,31,32],"image":"tomato.jpg","description":"Essential ingredient in Pakistani cuisine"},
  {"id":5,"name":"Kheera (Cucumber)","category":"Vegetable","water":"High","sunlight":"Full sun","compatible":[4,11,12,14,33,34],"image":"cucumber.jpg","description":"Refreshing vegetable commonly used in salads"},
  {"id":9,"name":"Mirch (Chili Pepper)","category":"Vegetable","water":"Medium","sunlight":"Full sun","compatible":[4,7,13,31,33],"image":"chili.jpg","description":"Essential spice in Pakistani cooking, varying in heat"},
  {"id":11,"name":"Gajar (Carrot)","category":"Vegetable","water":"Medium","sunlight":"Full/partial sun","compatible":[5,12,14,35,36],"image":"carrot.jpg","description":"Orange root vegetable used in many dishes and desserts"},
  {"id":12,"name":"Piyaz (Onion)","category":"Vegetable","water":"Medium","sunlight":"Full sun","compatible":[5,11,14,32,34],"image":"onion.jpg","description":"Staple vegetable in Pakistani cooking"},
  {"id":13,"name":"Baingan (Eggplant)","category":"Vegetable","water":"Medium","sunlight":"Full sun","compatible":[4,9,31,33],"image":"eggplant.jpg","description":"Purple vegetable popular in many Pakistani dishes"},
  {"id":14,"name":"Palak (Spinach)","category":"Vegetable","water":"Medium","sunlight":"Partial shade","compatible":[4,5,11,35,37],"image":"spinach.jpg","description":"Nutritious leafy green used in sag dishes"},
  {"id":31,"name":"Bhindi (Okra)","category":"Vegetable","water":"Medium","sunlight":"Full sun","compatible":[4,9,13,33],"image":"okra.jpg","description":"Popular vegetable used in curries and fried dishes"},
  {"id":32,"name":"Lehsun (Garlic)","category":"Vegetable","water":"Low","sunlight":"Full sun","compatible":[4,12,34,36],"image":"garlic.jpg","description":"Aromatic bulb used as a base in Pakistani cooking"},
  {"id":33,"name":"Shimla Mirch (Bell Pepper)","category":"Vegetable","water":"Medium","sunlight":"Full sun","compatible":[5,9,13,31],"image":"bellpepper.jpg","description":"Sweet, colorful peppers used in many dishes"},
  {"id":34,"name":"Aloo (Potato)","category":"Vegetable","water":"Medium","sunlight":"Full sun","compatible":[5,12,32,36],"image":"potato.jpg","description":"Staple starchy vegetable in Pakistani meals"},
  {"id":35,"name":"Methi (Fenugreek)","category":"Vegetable","water":"Medium","sunlight":"Full sun","compatible":[11,14,37],"image":"fenugreek.jpg","description":"Bitter-tasting leaves used in saag and achar"},
  {"id":36,"name":"Muli (Radish)","category":"Vegetable","water":"Medium","sunlight":"Partial shade","compatible":[11,32,34],"image":"radish.jpg","description":"Crunchy root vegetable eaten raw or cooked"},
  {"id":37,"name":"Saag (Mustard Greens)","category":"Vegetable","water":"Medium","sunlight":"Full/partial sun","compatible":[14,35],"image":"mustardgreens.jpg","description":"Popular leafy vegetable in Punjab region"},
  {"id":6,"name":"Tulsi (Holy Basil)","category":"Herb","water":"Medium","sunlight":"Full sun","compatible":[7,10,16,45,48],"image":"tulsi.jpg","description":"Sacred herb with medicinal properties"},
  {"id":7,"name":"Pudina (Mint)","category":"Herb","water":"High","sunlight":"Partial shade","compatible":[6,9,15,16,44,49],"image":"mint.jpg","description":"Essential herb for chutneys and raita"},
  {"id":10,"name":"Ajwain (Carom)","category":"Herb","water":"Low","sunlight":"Full sun","compatible":[6,15,17,46,47],"image":"ajwain.jpg","description":"Aromatic herb used for digestive problems"},
  {"id":15,"name":"Dhaniya (Coriander)","category":"Herb","water":"Medium","sunlight":"Partial shade","compatible":[7,10,16,44,47],"image":"coriander.jpg","description":"Most popular herb in Pakistani cuisine"},
  {"id":16,"name":"Lehsan (Garlic)","category":"Herb","water":"Medium","sunlight":"Full sun","compatible":[6,7,15,45,49],"image":"garlic.jpg","description":"Pungent herb used as a base in many dishes"},
  {"id":17,"name":"Adrak (Ginger)","category":"Herb","water":"Medium","sunlight":"Partial shade","compatible":[10,15,16,46,48],"image":"ginger.jpg","description":"Aromatic root used in teas and cooking"},
  {"id":44,"name":"Kari Patta (Curry Leaf)","category":"Herb","water":"Medium","sunlight":"Full sun","compatible":[7,15,47,49],"image":"curryleaf.jpg","description":"Aromatic leaf used for tempering in Pakistani dishes"},
  {"id":45,"name":"Saunf (Fennel)","category":"Herb","water":"Medium","sunlight":"Full sun","compatible":[6,16,46,48],"image":"fennel.jpg","description":"Sweet anise-flavored herb used in digestive remedies"},
  {"id":46,"name":"Kalonji (Nigella)","category":"Herb","water":"Low","sunlight":"Full sun","compatible":[10,17,45,50],"image":"nigella.jpg","description":"Black seeds with medicinal properties used in naan"},
  {"id":47,"name":"Zeera (Cumin)","category":"Herb","water":"Low","sunlight":"Full sun","compatible":[10,15,44,50],"image":"cumin.jpg","description":"Essential spice for garam masala and curries"},
  {"id":48,"name":"Aloe Vera","category":"Herb","water":"Low","sunlight":"Partial sun","compatible":[6,17,45],"image":"aloevera.jpg","description":"Medicinal plant used for skin treatments"},
  {"id":49,"name":"Haldi (Turmeric)","category":"Herb","water":"Medium","sunlight":"Partial shade","compatible":[7,16,44],"image":"turmeric.jpg","description":"Golden root used for flavor and medicinal purposes"},
  {"id":50,"name":"Hari Elaichi (Green Cardamom)","category":"Herb","water":"Medium","sunlight":"Partial shade","compatible":[46,47],"image":"cardamom.jpg","description":"Fragrant pods used in tea and desserts"},
  {"id":18,"name":"Aam (Mango)","category":"Fruit","water":"Medium","sunlight":"Full sun","compatible":[19,20,24,26],"image":"mango.jpg","description":"King of fruits, Pakistan's speciality in summer"},
  {"id":19,"name":"Falsa","category":"Fruit","water":"Medium","sunlight":"Full sun","compatible":[18,20,25,27],"image":"falsa.jpg","description":"Small purple berry native to the subcontinent"},
  {"id":20,"name":"Anar (Pomegranate)","category":"Fruit","water":"Low","sunlight":"Full sun","compatible":[18,19,24,25],"image":"pomegranate.jpg","description":"Ruby red seeds with sweet-tart flavor"},
  {"id":24,"name":"Jamun (Black Plum)","category":"Fruit","water":"Medium","sunlight":"Full sun","compatible":[18,20,25,26],"image":"jamun.jpg","description":"Dark purple fruit with astringent taste, good for diabetes"},
  {"id":25,"name":"Sharifa (Custard Apple)","category":"Fruit","water":"Medium","sunlight":"Full sun","compatible":[19,20,24,27],"image":"custardapple.jpg","description":"Sweet, creamy fruit with unique texture and flavor"},
  {"id":26,"name":"Nashpati (Asian Pear)","category":"Fruit","water":"Medium","sunlight":"Full sun","compatible":[18,24,27,28],"image":"asianpear.jpg","description":"Crisp, juicy pear variety popular in northern Pakistan"},
  {"id":27,"name":"Khubani (Apricot)","category":"Fruit","water":"Medium","sunlight":"Full sun","compatible":[19,25,26,28],"image":"apricot.jpg","description":"Golden-orange fruit speciality of Gilgit-Baltistan region"},
  {"id":28,"name":"Kinnow (Mandarin)","category":"Fruit","water":"Medium","sunlight":"Full sun","compatible":[26,27,29,30],"image":"kinnow.jpg","description":"Sweet citrus fruit, Pakistan's famous export"},
  {"id":29,"name":"Tarbuz (Watermelon)","category":"Fruit","water":"High","sunlight":"Full sun","compatible":[28,30],"image":"watermelon.jpg","description":"Refreshing summer fruit with juicy red flesh"},
  {"id":30,"name":"Leechi (Lychee)","category":"Fruit","water":"Medium","sunlight":"Full sun","compatible":[28,29],"image":"lychee.jpg","description":"Sweet translucent fruit with bumpy red skin"}
]

# ---------- Load model.joblib ----------
try:
    data = joblib.load("model.joblib")
    model = data["model"]
    cat_map = data["cat_map"]
    water_map = data["water_map"]
    sun_map = data["sun_map"]
    FEATURES = data["FEATURES"]
    print("Loaded model.joblib successfully.")
except Exception as e:
    print("Error loading model.joblib. Make sure you ran train_model.py first.")
    raise e

# Helper to find plant by id
def get_plant(pid):
    return next((p for p in plantData if p["id"] == int(pid)), None)

@app.route("/predict", methods=["POST"])
def predict():
    payload = request.json or {}
    try:
        p1_id = int(payload.get("plant1"))
        p2_id = int(payload.get("plant2"))
    except Exception:
        return jsonify({"error": "Invalid plant IDs"}), 400

    p1 = get_plant(p1_id)
    p2 = get_plant(p2_id)
    if not p1 or not p2:
        return jsonify({"error": "plant not found"}), 400
    if p1_id == p2_id:
        return jsonify({"error": "cannot cross-breed a plant with itself"}), 400

    # Prepare features (same encoding as training)
    same_cat = int(p1["category"] == p2["category"])
    p_water = water_map.get(p1["water"], 1)
    q_water = water_map.get(p2["water"], 1)
    abs_water = abs(p_water - q_water)
    p_sun = sun_map.get(p1["sunlight"], 1)
    q_sun = sun_map.get(p2["sunlight"], 1)
    abs_sun = abs(p_sun - q_sun)
    compatible_flag = int(p2["id"] in p1.get("compatible", []) or p1["id"] in p2.get("compatible", []))
    p_cat = cat_map.get(p1["category"], 0)
    q_cat = cat_map.get(p2["category"], 0)

    X = [[p_cat, q_cat, same_cat, p_water, q_water, abs_water, p_sun, q_sun, abs_sun, compatible_flag]]

    # Predict
    pred = model.predict(X)[0]
    pred = int(max(0, min(100, round(pred))))

    # Hybrid trait dominance heuristic (small stochastic element)
    def dominant(tr1, tr2):
        if tr1 == tr2:
            return tr1
        if compatible_flag:
            return tr1 if random.random() > 0.3 else tr2
        else:
            return tr1 if random.random() > 0.6 else tr2

    hybrid = {
        "name": f"{p1['name']}-{p2['name']} Hybrid",
        "water": dominant(p1["water"], p2["water"]),
        "sunlight": dominant(p1["sunlight"], p2["sunlight"]),
        "successRate": pred,
        "description": f"A hybrid combining traits of {p1['name']} and {p2['name']}.",
        "category": p1["category"] if p1["category"] == p2["category"] else "Hybrid"
    }

    return jsonify({"result": hybrid})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
