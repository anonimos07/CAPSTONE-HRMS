import { Routes, Route } from 'react-router-dom';
import Homepage from './Pages/HomePage';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import { HiringPage } from './Pages/HiringPage';
import { ApplicationForm } from './Pages/ApplicationForm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/hiring" element={<HiringPage />} />
      <Route path="/apply/:id" element={<ApplicationForm />} />
    </Routes>
  );
}

export default App;