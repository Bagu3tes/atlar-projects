import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskApp from './pages/TaskApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskApp />} />
      </Routes>
    </Router>
  );
}

export default App;
