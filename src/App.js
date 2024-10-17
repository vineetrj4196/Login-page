import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import ErrorBoundary from './ErrorBoundary'; // ErrorBoundary for error handling
import NoInternet from './NoInternet'; // Component to display when offline
import useNetworkStatus from './useNetworkStatus'; // Custom hook to detect network status

const App = () => {
  const isOnline = useNetworkStatus(); // Check network status

  // If the user is offline, show the NoInternet screen
  if (!isOnline) {
    return <NoInternet />;
  }

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Login Route */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard Route */}
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
