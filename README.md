# Hotel Price Finder

An application that finds hotel prices using Google's Gemini AI API.

## Project Structure

- `backend/` - Flask API server and backend logics
- `frontend/` - React frontend application

## Setup Instructions

### Backend Setup

1. Create a `.env` file in the project root with your Google API key:

   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

2. Install and start the Flask API server:
   ```
   cd backend
   poetry install
   python app.py
   ```

### Frontend Setup

1. Install Node.js dependencies:

   ```
   cd frontend
   npm install
   ```

2. Start the React development server:

   ```
   npm start
   ```

3. Access the application at http://localhost:3000

## Usage

1. Enter a ZIP code in the search form
2. Select check-in and check-out dates
3. Click "Search Hotels" to find available hotels
4. View hotel details including prices, amenities, and descriptions

## API Endpoints

- `GET /api/hotel-prices?zip={zip_code}&check_in={check_in_date}&check_out={check_out_date}`
  Returns hotel price information for the specified ZIP code and date range.

```bash
poetry run hotel-prices --zip 84070 --check-in 2025-05-01 --check-out 2025-05-15
```
