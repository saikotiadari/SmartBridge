import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/patients/login`, form);

      if (data.user?.type !== 'admin') {
        throw new Error('Use Patient Login or Doctor Login for non-admin accounts');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      setMessage('Admin login successful');
      navigate('/adminhome');
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        {message && <p className="message">{message}</p>}
        <input name="email" type="email" placeholder="Admin Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login as Admin</button>
        <p>
          Patient login? <Link to="/login">Patient Login</Link>
        </p>
        <p>
          Doctor login? <Link to="/doctor-login">Doctor Login</Link>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
