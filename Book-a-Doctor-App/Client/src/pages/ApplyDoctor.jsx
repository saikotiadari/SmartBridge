import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplyDoctor = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: '',
    email: '',
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
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/patients/doctors/apply`, { ...form, experience: Number(form.experience), fees: Number(form.fees) }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Doctor application submitted with status Pending Approval.');
      setTimeout(() => navigate('/userhome'), 800);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Apply as Doctor</h2>
        {message && <p className="message">{message}</p>}
        <input name="fullname" placeholder="Full Name" value={form.fullname} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <input name="specialisation" placeholder="Specialisation" value={form.specialisation} onChange={handleChange} required />
        <input name="timings" placeholder="Timings" value={form.timings} onChange={handleChange} required />
        <input name="availability" placeholder="Availability (morning/evening slots)" value={form.availability} onChange={handleChange} required />
        <input name="experience" type="number" placeholder="Experience (years)" value={form.experience} onChange={handleChange} required />
        <input name="fees" type="number" placeholder="Consultation Fee" value={form.fees} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <textarea name="about" rows="3" placeholder="About you" value={form.about} onChange={handleChange} />
        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
};

export default ApplyDoctor;
