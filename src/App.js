import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Api from './pages/App';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Api />} />
      </Routes>
    </Router>
  );
}

export default App;
