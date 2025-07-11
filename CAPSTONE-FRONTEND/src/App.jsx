import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Router, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/HomePage';
import { HiringPage } from './Pages/HiringPage';
import { ApplicationForm } from './Pages/ApplicationForm';
import LoginPage from './Pages/Login';
import LoginHr from './Pages/LoginHr';
import HrPage from './Pages/HrPage';
import EmployeePage from './Pages/EmployeePage';
import NotFound from './ErrorPages/NotFound';
import Forbidden from './ErrorPages/Forbidden';
import Unauthorized from './ErrorPages/Unauthorized';
import ProtectedRoutes from './utils/ProtectedRoutes';
import EmployeeDashboard from './Pages/EmployeeDashboard';
import EmployeeLogin from './Pages/EmployeeLogin';
import Attendance from './Pages/Attendance';
import LeaveRequest from './Pages/LeaveRequest';
import Profile from './Pages/Profile';


const qry = new QueryClient();

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
      <Route path="/employee" element={<EmployeePage />} />

      <Route path="/employee/login" element={<EmployeeLogin />} />
      <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      <Route path="/employee/attendance" element={<Attendance />} />
      <Route path="/employee/leave" element={<LeaveRequest />} />
      <Route path="/employee/profile" element={<Profile />} />

      {/* <Route element={<ProtectedRoutes allowedRoles={["EMPLOYEE"]} />}>
       ari ibutang route sa employee
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["HR"]} />}>
      ari ibutang route sa HR
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["ADMIN"]} />}>
      ari ibutang route sa ADMIN
      </Route> */}

    </Routes>
  
</QueryClientProvider>
  );
}

export default App;