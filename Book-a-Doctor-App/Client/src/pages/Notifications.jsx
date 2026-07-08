import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients/getallnotification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ userId: userData?._id })
        });
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>MediCare</h2>
        <Link to="/userhome" className="btn">Back to Home</Link>
        <button onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          navigate('/login');
        }}>Logout</button>
      </aside>

      <main className="main-content">
        <h1>Notifications</h1>
        {notifications.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          <ul>
            {notifications.map((item, index) => (
              <li key={index}>{item.message}</li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Notifications;
