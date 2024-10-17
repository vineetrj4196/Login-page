import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate(); // Initialize useNavigate

  // Email validation regex
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Password validation regex: at least 8 characters, one special character, and one number
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email and password
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters, include one special character, and one number.');
      return;
    }

    setError('');
    setSuccessMessage(''); // Clear previous success message

    // Call the Login API
    try {
      const response = await fetch('https://fmcg.perisync.work/api/super_admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_id: email,
          password: password,
          type: 'super_admin',
        }),
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }

      const data = await response.json();
      const { token } = data;

      // Store the token in local storage
      localStorage.setItem('token', token);

      // Get geolocation data
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const geolocation = { latitude, longitude };
            localStorage.setItem('geolocation', JSON.stringify(geolocation)); // Store geolocation in local storage
            
            console.log('Login Successful, geolocation stored', geolocation);
            setSuccessMessage('Login Successful!'); // Set success message
            // Redirect to Dashboard
            navigate('/dashboard'); // Redirect to the dashboard here
          },
          (error) => {
            console.error('Error fetching geolocation', error);
            if (error.code === 1) {
              setError('Location access denied. Please enable it in your browser settings.');
            } else {
              setError('Unable to retrieve your location. Please try again later.');
            }
            // Redirect to Dashboard even if geolocation fails
            navigate('/dashboard'); // Optionally redirect even without geolocation
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
        navigate('/dashboard'); // Redirect if geolocation is not supported
      }

      console.log('Login Successful');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
        
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
