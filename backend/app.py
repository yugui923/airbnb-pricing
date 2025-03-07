from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add the src directory to the path so we can import the hotel_price_finder
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from comparable_pricing.hotel_price_finder import (
    get_hotel_prices,
    validate_date,
)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route("/api/hotel-prices", methods=["GET"])
def hotel_prices():
    zip_code = request.args.get("zip")
    check_in = request.args.get("check_in")
    check_out = request.args.get("check_out")

    # Validate inputs
    if not all([zip_code, check_in, check_out]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        # Validate dates
        validate_date(check_in)
        validate_date(check_out)

        # Get hotel prices
        results = get_hotel_prices(zip_code, check_in, check_out)
        return jsonify({"data": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True, port=5000)
