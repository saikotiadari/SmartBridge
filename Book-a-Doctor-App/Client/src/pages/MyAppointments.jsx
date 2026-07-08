import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients/appointments/patient`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/patients/appointments/${appointmentId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>MediCare</h2>
        <Link to="/userhome" className="btn">Back to Home</Link>
        <button onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          navigate('/login');
        }}>Logout</button>
      </aside>

      <main className="main-content">
        <h1>My Appointments</h1>
        {appointments.length === 0 ? (
          <p>No appointments yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {appointments.map((appointment) => (
              <li key={appointment._id} className="card" style={{ marginBottom: '12px' }}>
                <strong>{appointment.docName || 'Doctor'}</strong>
                <p>Date: {appointment.date}</p>
                <p>Time: {appointment.time || 'N/A'}</p>
                <p>Status: {appointment.status}</p>
                {(appointment.status === 'Under Review' || appointment.status === 'Scheduled') && (
                  <button onClick={() => handleCancel(appointment._id)}>Cancel Appointment</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default MyAppointments;
