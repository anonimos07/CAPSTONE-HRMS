import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Router, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/HomePage';
import { HiringPage } from './Pages/HiringPage';
import { ApplicationForm } from './Pages/ApplicationForm';
import LoginPage from './Pages/Login';
import LoginHr from './Pages/LoginHr';
import HrPage from './Pages/HrPage';
import EmployeePage from './Pages/EmployeePage';
import EmployeeProfile from './Pages/EmployeeProfile';
import HrProfile from './Pages/HrProfile';
import NotFound from './ErrorPages/NotFound';
import Forbidden from './ErrorPages/Forbidden';
import Unauthorized from './ErrorPages/Unauthorized';
import ProtectedRoutes from './utils/ProtectedRoutes';


const qry = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000, 
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (

<QueryClientProvider client={qry}>
  
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
      <Route path="/hrpage" element={<HrPage />} />
       
       
     
      
       

      <Route element={<ProtectedRoutes allowedRoles={["EMPLOYEE"]} />}>
       {/* ari ibutang route sa employee */}
      <Route path="/employeepage" element={<EmployeePage />} />
      <Route path="/employeeprofile" element={<EmployeeProfile />} />
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["HR"]} />}>
      {/* ari ibutang route sa HR */}
      <Route path="/hrpage" element={<HrPage />} />
      <Route path="/Hrprofile" element={<HrProfile />} />
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["ADMIN"]} />}>
      {/* ari ibutang route sa ADMIN */}
      </Route>

    </Routes>
  
</QueryClientProvider>
  );
}

export default App;