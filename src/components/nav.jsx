import React from 'react';
import { Link } from 'react-router-dom';
import useLogout from './logout';


const Navigation = () => {
  const logout = useLogout();

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/upload">Upload</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact Us</Link>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
