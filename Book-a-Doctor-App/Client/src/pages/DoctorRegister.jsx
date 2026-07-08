import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    specialisation: '',
    timings: '',
    availability: '',
    experience: '',
    fees: '',
    about: '',
    location: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/patients/register-doctor`, {
        ...form,
        experience: Number(form.experience),
        fees: Number(form.fees)
      });
      setMessage('Doctor registration submitted. Please login from doctor portal.');
      setTimeout(() => navigate('/doctor-login'), 900);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Doctor Registration</h2>
        {message && <p className="message">{message}</p>}
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <input name="specialisation" placeholder="Specialisation" value={form.specialisation} onChange={handleChange} required />
        <input name="timings" placeholder="Timings" value={form.timings} onChange={handleChange} required />
        <input name="availability" placeholder="Availability" value={form.availability} onChange={handleChange} required />
        <input name="experience" type="number" placeholder="Experience (years)" value={form.experience} onChange={handleChange} required />
        <input name="fees" type="number" placeholder="Consultation Fee" value={form.fees} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <textarea name="about" rows="3" placeholder="About your practice" value={form.about} onChange={handleChange} />
        <button type="submit">Register as Doctor</button>
        <p>
          Already registered? <Link to="/doctor-login">Doctor Login</Link>
        </p>
      </form>
    </div>
  );
};

export default DoctorRegister;
