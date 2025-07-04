import { Routes, Route } from 'react-router-dom';
import Homepage from './Pages/HomePage';
import Login from './Pages/Login';
import Signup from './Pages/Signup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;