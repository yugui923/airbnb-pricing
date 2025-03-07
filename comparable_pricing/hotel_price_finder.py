import os
import argparse
from datetime import datetime

from dotenv import load_dotenv
from pydantic import BaseModel
from google import genai


class DailyPrice(BaseModel):
    daily_price_low: float
    daily_price_high: float


class HotelPrice(BaseModel):
    hotel_name: str
    zip_code: str
    daily_price_list: list[DailyPrice]
    star_rating: int
    amenities: list[str]
    description: str
    source_url: str


# Load environment variables from .env file
load_dotenv()

# Configure the Genai API with your API key
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))


def validate_date(date_str):
    """Validate date format (YYYY-MM-DD)"""
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        raise argparse.ArgumentTypeError("Date must be in YYYY-MM-DD format")


def get_hotel_prices(zip_code, check_in_date, check_out_date):
    """Query hotel prices using Google Gemini API"""

    prompt = f"""
    Gather information about hotels in the ZIP code {zip_code} for a stay from {check_in_date} to {check_out_date}.
    
    For each hotel, please provide:
    * Hotel name
    * Zip code
    * List of daily prices
    * Star rating
    * List of amenities
    * Brief description within 50 words
    * URL of source website
    
    List at least 5 hotels and at most 10 hotels. If there are fewer than 5 hotels in this ZIP code, provide information for adjacent ZIP codes as well.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": list[HotelPrice],
            },
        )
        return response.text
    except Exception as e:
        return f"Error querying the API: {str(e)}"


def main():
    parser = argparse.ArgumentParser(
        description="Get hotel prices for a ZIP code and date range"
    )
    parser.add_argument(
        "--zip", required=True, help="ZIP code to search for hotels"
    )
    parser.add_argument(
        "--check-in",
        required=True,
        type=validate_date,
        help="Check-in date (YYYY-MM-DD)",
    )
    parser.add_argument(
        "--check-out",
        required=True,
        type=validate_date,
        help="Check-out date (YYYY-MM-DD)",
    )

    args = parser.parse_args()

    if args.check_in >= args.check_out:
        print("Error: Check-out date must be after check-in date")
        return

    results = get_hotel_prices(
        args.zip,
        args.check_in.strftime("%Y-%m-%d"),
        args.check_out.strftime("%Y-%m-%d"),
    )
    print("\nHotel Information:\n")
    print(results)


if __name__ == "__main__":
    main()
