import { useState } from 'react';
import snowy from '../assets/images/snowy.png';
import sunny from '../assets/images/sunny.png';
import cloudy from '../assets/images/cloudy.png'
import rainy from '../assets/images/rainy.png'
import '../styles/weatherWidget.css';

const WeatherWidget = () => {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const api_key = '9297720310e64d37fa054b802c765225';

  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  const search = async () => {
    if (location.trim() !== '') {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${api_key}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('City not found');
        const searchData = await res.json();
        setData(searchData);
      } catch (error) {
        setData({ error: 'City not found. Please try again.' });
      }
    }
  };

  const weatherImages = {
    Clear: sunny,
    Clouds: cloudy,
    Rain: rainy,
    Snow: snowy,
    Haze: cloudy,
    Mist: cloudy,
  };

  const weatherImage = data.weather ? weatherImages[data.weather[0].main] : null;

  return (
    <div className="weather-widget">
      <div className="weather-search">
        <input
          type="text"
          placeholder="Enter Location"
          value={location}
          onChange={handleInputChange}
          className="weather-input"
        />
        <button onClick={search} className="weather-button">
          Search
        </button>
      </div>
      {data.error ? (
        <p className="weather-error">{data.error}</p>
      ) : (
        data.main && (
          <div className="weather-info">
            <h3 className="weather-location">{data.name}</h3>
            <img src={weatherImage} alt="weather" className="weather-image" />
            <p className="weather-type">{data.weather ? data.weather[0].main : null}</p>
            <p className="weather-temp">{data.main ? `${Math.floor(data.main.temp)}ºC` : null}</p>
            <div className="weather-details">
              <p>Humidity: {data.main ? `${data.main.humidity}%` : null}</p>
              <p>Wind: {data.wind ? `${data.wind.speed} km/h` : null}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default WeatherWidget;