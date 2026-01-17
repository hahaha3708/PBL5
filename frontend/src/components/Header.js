import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <h1>Viet Heritage Hub</h1>
        </Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/timeline">Timeline</Link></li>
          <li><Link to="/map">Map</Link></li>
          <li><Link to="/ai-art-lab">AI Art Lab</Link></li>
          <li><Link to="/community">Community</Link></li>
          <li><Link to="/shop">Shop</Link></li>
        </ul>
      </nav>
      <div className="user-menu">
        <button className="login-btn">Login</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </header>
  );
}

export default Header;
