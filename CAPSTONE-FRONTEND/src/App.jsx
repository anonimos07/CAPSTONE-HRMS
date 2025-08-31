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
import TimelogPage from './Pages/TimelogPage';
import HRTimelogDashboard from './Pages/HRTimelogDashboard';
import TestAuth from './components/TestAuth';
// New HR pages
import Announcements from './Pages/HR/Announcements';
import JobApplications from './Pages/HR/JobApplications';
import ResumeReview from './Pages/HR/ResumeReview';
import HRNotifications from './Pages/HR/Notifications';
// New Employee pages
import Notifications from './Pages/Employee/Notifications';
// Admin pages
import AdminPage from './Pages/AdminPage';
import AdminLogin from './Pages/AdminLogin';
// Password reset pages
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    <ToastContainer />
  
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
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Quick test redirects */}
      <Route path="/test-employee" element={<EmployeePage />} />
      <Route path="/test-hr" element={<HrPage />} />
      <Route path="/test-timelog" element={<TimelogPage />} />
      <Route path="/test-hr-dashboard" element={<HRTimelogDashboard />} />
      <Route path="/test-auth" element={<TestAuth />} />
       
       
     
      
       

      <Route element={<ProtectedRoutes allowedRoles={["EMPLOYEE"]} />}>
       {/* Employee routes */}
      <Route path="/employeepage" element={<EmployeePage />} />
      <Route path="/employeeprofile" element={<EmployeeProfile />} />
      <Route path="/timelog" element={<TimelogPage />} />
      <Route path="/employee/notifications" element={<Notifications />} />
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["HR"]} />}>
      {/* HR routes */}
      <Route path="/hrpage" element={<HrPage />} />
      <Route path="/Hrprofile" element={<HrProfile />} />
      <Route path="/hr-timelog" element={<HRTimelogDashboard />} />
      <Route path="/hr/announcements" element={<Announcements />} />
      <Route path="/hr/job-applications" element={<JobApplications />} />
      <Route path="/hr/resume-review" element={<ResumeReview />} />
      <Route path="/hr/notifications" element={<HRNotifications />} />
      </Route>

      <Route element={<ProtectedRoutes allowedRoles={["ADMIN"]} />}>
      {/* Admin routes */}
      <Route path="/adminpage" element={<AdminPage />} />
      </Route>

    </Routes>
  
</QueryClientProvider>
  );
}

export default App;