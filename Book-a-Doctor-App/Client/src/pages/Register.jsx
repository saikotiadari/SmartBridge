import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', type: 'user' });
  const [message, setMessage] = useState('');
  const [showAdminOption, setShowAdminOption] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/admins/check-admin`);
        setShowAdminOption(!data.exists);
      } catch (error) {
        setShowAdminOption(false);
      }
    };

    checkAdminStatus();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/patients/register`, form);

      setMessage('Registration successful');
      setTimeout(() => navigate('/login'), 800);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {message && <p className="message">{message}</p>}
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        {showAdminOption && (
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="user">Patient Account</option>
            <option value="admin">Admin Account</option>
          </select>
        )}
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <p>
          Want doctor account? <Link to="/doctor-register">Doctor Register</Link>
        </p>
        <p>
          Admin login? <Link to="/admin-login">Admin Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
