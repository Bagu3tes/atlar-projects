import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Api from './pages/App';

function App() {
  const isAuthenticated = !!localStorage.getItem('currentUser');
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <h1>Página Principal</h1> : <Navigate to="/auth" />} />
      <Route path="/auth" element={<Api />} />
      </Routes>
    </Router>
  );
};

export default App;
