import React from 'react';
import './HotelList.css';
import HotelCard from './HotelCard';

const HotelList = ({ hotels }) => {
  if (!hotels || hotels.length === 0) {
    return <div className="no-results">No hotels found for the selected criteria.</div>;
  }

  return (
    <div className="hotel-list">
      <h2>Available Hotels</h2>
      <div className="hotel-grid">
        {hotels.map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default HotelList;
