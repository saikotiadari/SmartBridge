import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
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

      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      setMessage('Login successful');

      if (data.user?.type === 'admin') {
        navigate('/adminhome');
      } else if (data.user?.isdoctor) {
        navigate('/doctorappointments');
      } else {
        navigate('/userhome');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {message && <p className="message">{message}</p>}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login</button>
        <p>
          New here? <Link to="/register">Register</Link>
        </p>
        <p>
          Doctor account? <Link to="/doctor-login">Doctor Login</Link>
        </p>
        <p>
          Admin account? <Link to="/admin-login">Admin Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
