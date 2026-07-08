import { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const UserHome = () => {
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDoctors = useCallback(async (activeSearchTerm, currentUser) => {
    const token = localStorage.getItem('token');
    try {
      setIsLoading(true);
      setError('');
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/patients/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          userId: currentUser?._id,
          search: activeSearchTerm.trim() || undefined
        }
      });
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Unable to load doctors.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
    setUser(storedUser);
  }, []);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        fetchDoctors(searchTerm, user);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [fetchDoctors, searchTerm, user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>MediCare</h2>
        <p>Welcome, {user?.name || 'User'}</p>
        <Link to="/myappointments" className="btn">My Appointments</Link>
        <Link to="/notifications" className="btn">Notifications</Link>
        <Link to="/profile" className="btn">Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </aside>

      <main className="main-content">
        <h1>Find Doctors</h1>
        <div style={{ margin: '12px 0 20px' }}>
          <input
            name="search"
            placeholder="Search by doctor name, specialty, location or availability"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="card-grid">
          {doctors.map((doctor) => (
            <div className="card" key={doctor._id}>
              <h3>{doctor.fullname}</h3>
              <p><strong>Specialisation:</strong> {doctor.specialisation}</p>
              <p><strong>Location:</strong> {doctor.location || 'Not provided'}</p>
              <p><strong>Availability:</strong> {doctor.availability || doctor.timings || 'Not provided'}</p>
              <p><strong>Fees:</strong> ${doctor.fees}</p>
              <p><strong>Status:</strong> {doctor.status}</p>
              <Link to={`/bookappointment/${doctor._id}`} className="btn">Book Now</Link>
            </div>
          ))}
        </div>
        {isLoading && <p>Searching doctors...</p>}
        {!isLoading && error && <p className="message">{error}</p>}
        {!isLoading && !error && doctors.length === 0 && (
          <p>
            {searchTerm.trim()
              ? 'No doctors found for your search.'
              : 'No active doctors available right now.'}
          </p>
        )}
      </main>
    </div>
  );
};

export default UserHome;
