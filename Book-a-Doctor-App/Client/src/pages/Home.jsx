import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="brand">MediCare</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Patient Login</Link>
          <Link to="/admin-login">Admin Login</Link>
          <Link to="/register">Patient Register</Link>
          <Link to="/doctor-login">Doctor Login</Link>
          <Link to="/doctor-register">Doctor Register</Link>
        </div>
      </nav>

      <section className="hero">
        <div>
          <h1>Book your doctor appointment online</h1>
          <p>Find trusted doctors, book appointments, and manage your care from one place.</p>
          <Link to="/login" className="btn">Book your Doctor</Link>
        </div>
        <div className="hero-card">
          <h3>Why choose us?</h3>
          <ul>
            <li>Verified doctors</li>
            <li>Easy appointment booking</li>
            <li>Secure patient records</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;
