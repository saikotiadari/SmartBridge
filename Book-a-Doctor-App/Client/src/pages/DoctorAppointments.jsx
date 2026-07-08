import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [consultationDraft, setConsultationDraft] = useState({});
  const navigate = useNavigate();

  const handleDocumentDownload = async (appointId, fileName = 'attached-file') => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/doctors/getdocumentdownload`,
        {
          params: { appointId },
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAppointments = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/doctors/getdoctorappointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(data.appointments || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatus = async (appointId, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/doctors/appointments/${appointId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (error) {
      console.error(error);
    }
  };

  const handleComplete = async (appointId) => {
    const token = localStorage.getItem('token');
    const draft = consultationDraft[appointId] || {};
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/doctors/appointments/${appointId}/consultation`,
        {
          clinicalNotes: draft.clinicalNotes || '',
          diagnosis: draft.diagnosis || '',
          digitalPrescription: draft.digitalPrescription || ''
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');

    if (userData?.isdoctor) {
      fetchAppointments();
    } else {
      navigate('/userhome');
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Doctor Panel</h2>
        <Link to="/userhome" className="btn">Back to Dashboard</Link>
        <Link to="/profile" className="btn">Profile</Link>
        <button onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          navigate('/login');
        }}>Logout</button>
      </aside>

      <main className="main-content">
        <div className="page-heading">
          <h1>Appointment Requests</h1>
          <p>Review patient requests and manage consultations from a cleaner dashboard view.</p>
        </div>

        <div className="stats-row">
          <div className="stat-card review">
            <h3>{appointments.filter((item) => item.status === 'Under Review').length}</h3>
            <p>Under Review</p>
          </div>
          <div className="stat-card scheduled">
            <h3>{appointments.filter((item) => item.status === 'Scheduled').length}</h3>
            <p>Scheduled</p>
          </div>
          <div className="stat-card completed">
            <h3>{appointments.filter((item) => item.status === 'Completed').length}</h3>
            <p>Completed</p>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="empty-state">No appointment requests yet.</div>
        ) : (
          <div className="request-grid">
            {appointments.map((appointment) => (
              <div className={`request-card ${appointment.status.toLowerCase().replace(/\s+/g, '-')}`} key={appointment._id}>
                <div className="request-top">
                  <div>
                    <h3>{appointment.userInfo?.name || 'Patient'}</h3>
                    <p className="request-meta">{appointment.date} • {appointment.time || 'Time not provided'}</p>
                  </div>
                  <span className="status-badge">{appointment.status}</span>
                </div>

                <div className="request-details">
                  <p><strong>Patient:</strong> {appointment.userInfo?.name || 'Patient'}</p>
                  <p><strong>Email:</strong> {appointment.userInfo?.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {appointment.userInfo?.phone || 'N/A'}</p>
                  {appointment.document && (
                    <p>
                      <strong>Attached File:</strong>{' '}
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => handleDocumentDownload(
                          appointment._id,
                          appointment.document.split(/[\\/]/).pop() || 'attached-file'
                        )}
                      >
                        View / Download
                      </button>
                    </p>
                  )}
                </div>

                <div className="request-actions">
                  {appointment.status === 'Under Review' && (
                    <>
                      <button className="accept-btn" onClick={() => handleStatus(appointment._id, 'Scheduled')}>Approve</button>
                      <button className="reject-btn" onClick={() => handleStatus(appointment._id, 'Rejected')}>Reject</button>
                    </>
                  )}

                  {appointment.status === 'Scheduled' && (
                    <div className="consultation-box">
                      <textarea
                        placeholder="Clinical notes"
                        rows="2"
                        value={consultationDraft[appointment._id]?.clinicalNotes || ''}
                        onChange={(event) => setConsultationDraft((prev) => ({
                          ...prev,
                          [appointment._id]: { ...prev[appointment._id], clinicalNotes: event.target.value }
                        }))}
                      />
                      <input
                        placeholder="Diagnosis"
                        value={consultationDraft[appointment._id]?.diagnosis || ''}
                        onChange={(event) => setConsultationDraft((prev) => ({
                          ...prev,
                          [appointment._id]: { ...prev[appointment._id], diagnosis: event.target.value }
                        }))}
                      />
                      <input
                        placeholder="Digital prescription"
                        value={consultationDraft[appointment._id]?.digitalPrescription || ''}
                        onChange={(event) => setConsultationDraft((prev) => ({
                          ...prev,
                          [appointment._id]: { ...prev[appointment._id], digitalPrescription: event.target.value }
                        }))}
                      />
                      <button className="complete-btn" onClick={() => handleComplete(appointment._id)}>Mark Completed</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorAppointments;
