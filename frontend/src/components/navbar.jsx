import React from 'react';
import '../styles/navbar.css';
import logo from '../assets/logo.png';

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <img src={logo} alt="QualGent Logo" className="logo-icon" />
          QualGent
        </div>
        <div className="nav-links">
          <button className="nav-item active">Test Cases</button>
          <button className="nav-item">Run & View</button>
          <button className="nav-item">Files</button>
          <button className="nav-item">Queue</button>
        </div>
      </div>
      <div className="navbar-right">
        <span className="icon">🔔</span>
        <span className="email">philip@tripadvisor.com</span>
      </div>
    </div>
  );
}

export default Navbar;
