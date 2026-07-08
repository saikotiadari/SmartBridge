import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/patients/getuserdata`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const profileData = data.user;
        setUser(profileData);
        setForm({
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || ''
        });
      } catch (error) {
        setMessage(error.response?.data?.message || 'Unable to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/patients/updateprofile`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = data.user;
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update profile');
    }
  };

  const dashboardPath = user?.type === 'admin' ? '/adminhome' : user?.type === 'doctor' ? '/doctorappointments' : '/userhome';

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>My Profile</h2>
        <p>Keep your account details up to date.</p>
        <Link to={dashboardPath} className="btn">Back to Dashboard</Link>
      </aside>

      <main className="main-content">
        <div className="page-heading">
          <h1>Profile</h1>
          <p>View and edit your personal information.</p>
        </div>

        {loading ? (
          <p>Loading profile...</p>
        ) : (
          <div className="profile-card">
            <div className="profile-summary">
              <h2>{user?.name || 'User'}</h2>
              <p><strong>Role:</strong> {user?.type || 'user'}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
            </div>

            <form className="auth-card profile-form" onSubmit={handleSubmit}>
              {message && <p className="message">{message}</p>}
              <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
              <button type="submit">Save Changes</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
