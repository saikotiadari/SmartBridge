import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminHome = () => {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [overview, setOverview] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchData = useCallback(async () => {
    try {
      const [overviewRes, usersRes, doctorsRes, pendingRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/admins/overview`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admins/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admins/doctors`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/admins/pending-doctors`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setOverview(overviewRes.data.overview);
      setUsers(usersRes.data.users || []);
      setDoctors(doctorsRes.data.doctors || []);
      setPendingDoctors(pendingRes.data.doctors || []);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/admin-login');
  };

  const approveDoctor = async (doctor) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admins/approve-doctor/${doctor._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const rejectDoctor = async (doctor) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admins/reject-doctor/${doctor._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <Link to="/profile" className="btn">Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </aside>

      <main className="main-content">
        <h1>Admin Dashboard</h1>
        {overview && (
          <p>
            Patients: {overview.usersCount} | Total Doctors: {overview.doctorsCount} | Active Doctors:{' '}
            {overview.activeDoctorsCount} | Appointments: {overview.appointmentsCount}
          </p>
        )}

        <h2>Pending Doctor Verification Queue</h2>
        <ul>
          {pendingDoctors.map((doctor) => (
            <li key={doctor._id}>
              {doctor.fullname} - {doctor.specialisation} - {doctor.email}
              <button onClick={() => approveDoctor(doctor)}>Approve</button>
              <button onClick={() => rejectDoctor(doctor)}>Reject</button>
            </li>
          ))}
        </ul>

        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id}>{user.name} - {user.email}</li>
          ))}
        </ul>

        <h2>All Doctors</h2>
        <ul>
          {doctors.map((doctor) => (
            <li key={doctor._id}>
              {doctor.fullname} - {doctor.status}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default AdminHome;
