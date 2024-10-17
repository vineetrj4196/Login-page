import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import './Dashboard.css'; // Optional: Add your CSS file for styling
import useNetworkStatus from './useNetworkStatus'; // Custom hook to check network status

const Dashboard = () => {
  const [brands, setBrands] = useState([]); // State to store brand data
  const [error, setError] = useState(null); // State for errors
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate(); // Initialize useNavigate for redirection
  const isOnline = useNetworkStatus(); // Check network status

  // Function to fetch brands from the API
  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      const response = await fetch('https://fmcg.perisync.work/api/brand?skip=1&limit=10', {
        headers: {
          'x-auth-token': token, // Add the token to the request headers
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch brands'); // Handle HTTP errors
      }

      const data = await response.json();
      setBrands(data); // Set brands data to state
    } catch (err) {
      setError(err.message); // Set error message if an error occurs
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  // Effect to fetch brands when the component mounts
  useEffect(() => {
    if (isOnline) {
      fetchBrands();
    }
  }, [isOnline]); // Fetch brands when the user comes online

  const handleRetry = () => {
    setError(null); // Clear the error
    fetchBrands(); // Retry fetching brands
  };

  const handleLogout = () => {
    // Clear token and geolocation data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('geolocation');

    // Redirect to Login page
    navigate('/'); 
  };

  // Check if the user is offline
  if (!isOnline) {
    return (
      <div className="no-internet">
        <h1>No Internet Connection</h1>
        <p>Please check your network settings and reconnect.</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  // Check loading state
  if (loading) {
    return <p>Loading...</p>; // Show loading message while fetching data
  }

  // Check for errors during the fetch
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  // Get the user's full name from local storage
  const fullName = localStorage.getItem('fullName') || 'User';

  return (
    <div className="dashboard-container">
      <h1>Welcome, {fullName}!</h1> {/* Display the user's full name */}
      <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      <h2>Brand List</h2>
      <ul>
        {brands.map((brand) => (
          <li key={brand.id}>{brand.name}</li> // Render each brand
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
