import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import DoctorLogin from './pages/DoctorLogin';
import DoctorRegister from './pages/DoctorRegister';
import UserHome from './pages/UserHome';
import AdminHome from './pages/AdminHome';
import BookAppointment from './pages/BookAppointment';
import DoctorAppointments from './pages/DoctorAppointments';
import MyAppointments from './pages/MyAppointments';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import './App.css';

const ProtectedRoute = ({ children, allowedRole }) => {
  const userData = JSON.parse(localStorage.getItem('userData') || 'null');
  const isLoggedIn = Boolean(userData);
  const role = userData?.type || 'user';
  const isDoctor = userData?.type === 'doctor' || Boolean(userData?.isdoctor);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole === 'doctor' && !isDoctor) {
    return <Navigate to={role === 'admin' ? '/adminhome' : '/userhome'} replace />;
  }

  if (allowedRole && allowedRole !== 'doctor' && role !== allowedRole) {
    return <Navigate to={role === 'admin' ? '/adminhome' : role === 'doctor' ? '/doctorappointments' : '/userhome'} replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
        <Route
          path="/userhome"
          element={
            <ProtectedRoute allowedRole="user">
              <UserHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminhome"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookappointment/:doctorId"
          element={
            <ProtectedRoute allowedRole="user">
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctorappointments"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myappointments"
          element={
            <ProtectedRoute allowedRole="user">
              <MyAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRole="user">
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
