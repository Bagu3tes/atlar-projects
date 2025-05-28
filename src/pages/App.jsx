import { useState } from 'react'
import '../styles/App.css'

const App = () => {
  const [data, setData] = useState({})
  const [location, setLocation] = useState("")
  const api_key = '9297720310e64d37fa054b802c765225'

  const handleInputChange = (e) => {
    setLocation(e.target.value)
  }

  const search = async () => {
    if (location.trim() !== "") {
      const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${api_key}`
      const res = await fetch(url)
      const searchData = await res.json()
      console.log(searchData)
      setData(searchData)
    }
  }

  return <div className="container">
    <div className="weather-app">

      <div className="search">
        <input type="text"
          placeholder='Enter Recipe'
          value={location}
          onChange={handleInputChange}
        />
        <button onClick={search}>Search</button>
        <div className='weather-type'>{data.weather ? data.weather[0].main : null}
          <div className='temp'>{data.main ? `${Math.floor(data.main.temp)}ºC` : null}
            <div className="humidity">{data.main ? data.main.humidity : null}%
              <div className="wind">{data.wind ? data.wind.speed : null}km/h
              <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default App;