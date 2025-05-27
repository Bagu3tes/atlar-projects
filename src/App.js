import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WeatherApi from './pages/WeatherApi';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeatherApi />} />
      </Routes>
    </Router>
  );
}

export default App;
