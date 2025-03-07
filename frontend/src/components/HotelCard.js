import React from 'react';
import './HotelCard.css';

const HotelCard = ({ hotel }) => {
  // Calculate average price
  const calculateAveragePrice = () => {
    if (!hotel.daily_price_list || hotel.daily_price_list.length === 0) {
      return { low: 0, high: 0 };
    }
    
    const total = hotel.daily_price_list.reduce(
      (acc, curr) => {
        return {
          low: acc.low + curr.daily_price_low,
          high: acc.high + curr.daily_price_high
        };
      },
      { low: 0, high: 0 }
    );
    
    return {
      low: (total.low / hotel.daily_price_list.length).toFixed(2),
      high: (total.high / hotel.daily_price_list.length).toFixed(2)
    };
  };
  
  const avgPrice = calculateAveragePrice();

  // Render stars based on rating
  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="hotel-card">
      <h3>{hotel.hotel_name}</h3>
      
      <div className="hotel-rating">
        <span className="stars">{renderStars(hotel.star_rating)}</span>
        <span className="zip-code">ZIP: {hotel.zip_code}</span>
      </div>
      
      <div className="hotel-price">
        <span className="price-range">
          ${avgPrice.low} - ${avgPrice.high}
        </span>
        <span className="per-night">per night (avg)</span>
      </div>
      
      <p className="hotel-description">{hotel.description}</p>
      
      <div className="hotel-amenities">
        <h4>Amenities:</h4>
        <ul>
          {hotel.amenities.slice(0, 5).map((amenity, index) => (
            <li key={index}>{amenity}</li>
          ))}
          {hotel.amenities.length > 5 && (
            <li>+{hotel.amenities.length - 5} more</li>
          )}
        </ul>
      </div>
      
      <a 
        href={hotel.source_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="source-link"
      >
        View Details
      </a>
    </div>
  );
};

export default HotelCard;
