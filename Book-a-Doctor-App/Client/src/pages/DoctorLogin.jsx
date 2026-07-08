import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const DoctorLogin = () => {
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
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/patients/doctor-login`, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      setMessage('Doctor login successful');
      navigate('/doctorappointments');
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Doctor Login</h2>
        {message && <p className="message">{message}</p>}
        <input name="email" type="email" placeholder="Doctor Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login as Doctor</button>
        <p>
          New doctor? <Link to="/doctor-register">Register here</Link>
        </p>
        <p>
          Patient/Admin? <Link to="/login">Go to Login</Link>
        </p>
      </form>
    </div>
  );
};

export default DoctorLogin;
