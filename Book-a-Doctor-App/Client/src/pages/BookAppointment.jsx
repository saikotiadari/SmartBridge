import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ date: '', time: '' });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      formData.append('doctorInfo', doctorId);
      formData.append('date', form.date);
      formData.append('time', form.time);
      if (file) {
        formData.append('document', file);
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/api/patients/appointments`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Appointment request submitted with status: Under Review.');
      setTimeout(() => navigate('/myappointments'), 800);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Book Appointment</h2>
        {message && <p className="message">{message}</p>}
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <input name="time" type="time" value={form.time} onChange={handleChange} required />
        <input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files[0])} />
        <p style={{ fontSize: '0.9rem', color: '#567' }}>Optional: upload a document or report for your appointment.</p>
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
};

export default BookAppointment;
