import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import Homepage from './Pages/HomePage';
import { HiringPage } from './Pages/HiringPage';
import { ApplicationForm } from './Pages/ApplicationForm';
import LoginPage from './Pages/Login';
import LoginHr from './Pages/LoginHr';

const qry = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={qry}>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/hiring" element={<HiringPage />} />
      <Route path="/apply/:id" element={<ApplicationForm />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/hr" element={<LoginHr />} />
    </Routes>
    </QueryClientProvider>
  );
}

export default App;