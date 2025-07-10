import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import Homepage from './Pages/HomePage';
import { HiringPage } from './Pages/HiringPage';
import { ApplicationForm } from './Pages/ApplicationForm';
import LoginPage from './Pages/Login';
import LoginHr from './Pages/LoginHr';
import NotFound from './ErrorPages/NotFound';
import Forbidden from './ErrorPages/Forbidden';
import Unauthorized from './ErrorPages/Unauthorized';

const qry = new QueryClient();

function App() {
  return (

<QueryClientProvider client={qry}>
  <Router>
    <Routes>

      <Route path="/401" element={<Unauthorized />} />
      <Route path="/403" element={<Forbidden />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />

      <Route path="/" element={<Homepage />} />
      <Route path="/hiring" element={<HiringPage />} />
      <Route path="/apply/:id" element={<ApplicationForm />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/hr" element={<LoginHr />} />

      <Route element={<ProtectedRoutes allowedRoles={["EMPLOYEE"]} />}>
       {/* ari ibutang route sa employee */}
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["HR"]} />}>
      {/* ari ibutang route sa HR */}</Route>

      <Route element={<ProtectedRoutes allowedRoles={["ADMIN"]} />}>
      {/* ari ibutang route sa ADMIN */}
      </Route>

    </Routes>
  </Router>
</QueryClientProvider>
  );
}

export default App;