import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import HotelList from './components/HotelList';

function App() {
  const [zipCode, setZipCode] = useState('');
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000)); // tomorrow
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchHotels = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    try {
      const response = await axios.get('http://localhost:5000/api/hotel-prices', {
        params: {
          zip: zipCode,
          check_in: formatDate(checkIn),
          check_out: formatDate(checkOut)
        }
      });
      
      setHotels(JSON.parse(response.data.data));
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred fetching hotel data');
      console.error('Error fetching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Hotel Price Finder</h1>
      </header>
      
      <div className="search-form">
        <form onSubmit={searchHotels}>
          <div className="form-group">
            <label htmlFor="zip-code">ZIP Code:</label>
            <input 
              type="text" 
              id="zip-code"
              value={zipCode} 
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter ZIP code"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="check-in">Check-in:</label>
              <DatePicker 
                id="check-in"
                selected={checkIn}
                onChange={(date) => setCheckIn(date)}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={new Date()}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="check-out">Check-out:</label>
              <DatePicker 
                id="check-out"
                selected={checkOut}
                onChange={(date) => setCheckOut(date)}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={checkIn}
              />
            </div>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search Hotels'}
          </button>
        </form>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading hotel information...</div>
      ) : (
        hotels.length > 0 && <HotelList hotels={hotels} />
      )}
    </div>
  );
}

export default App;
