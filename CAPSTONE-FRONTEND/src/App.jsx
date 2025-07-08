import { Routes, Route } from 'react-router-dom';
import Homepage from './Pages/HomePage';
import { HiringPage } from './Pages/HiringPage';
import { ApplicationForm } from './Pages/ApplicationForm';
import LoginPage from './Pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/hiring" element={<HiringPage />} />
      <Route path="/apply/:id" element={<ApplicationForm />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;