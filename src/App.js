import './App.css';
import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext';
import Navigation from './components/nav';
import Home from './components/home';
import Contact from './components/contact';
import Upload from './components/upload';
import LoginPage from './components/login_page';


const ProtectedRoute = ({ element }) => {
  const { token } = useContext(AuthContext);
  return token ? element : <Navigate to="/login" replace />;
};

function App() {
  const location = useLocation();

  // Define the routes where you want to show the navigation bar
  const showNavigation = ["/", "/upload", "/contact"].includes(location.pathname);

  useEffect(() => {
    // Clear local storage
    localStorage.clear();

    // Clear cookies
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, []);

  return (
    <div className="App">
      {showNavigation && <Navigation />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/upload" element={<ProtectedRoute element={<Upload />} />} />
        <Route path="/about" element={<Navigate to="/contact" />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function AppWithRouter() {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
}

export default AppWithRouter;
