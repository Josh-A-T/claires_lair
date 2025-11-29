import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="center">
        <h1 className="goth-header">🦇 Welcome to <u>Claire's Lair</u> 🦇</h1>
        <p className="goth-subtitle">An archive of Goth & gothic bands from A to Z...</p>
        <hr width="75%" />
        
        <div className="construction-banner">
          <img src="/under_construction.gif" alt="Under Construction" width="200" height="40" />
          <br />
          <font size="2" face="Verdana">
            1st edition! We're working hard to improve the site add features in later updates!
          </font>
        </div>
        <hr width="75%" />
      </div>

      <nav>
        <font face="Verdana" size="3">
          [
          <Link to="/">Home</Link> | 
          <Link to="/artists">Artists</Link> | 
          <Link to="/albums">Albums</Link> | 
          <Link to="/login">Login</Link>/<Link to="/register">Register</Link>| 
          <Link to="/profile">Profile</Link>
          ]
        </font>
      </nav>
      <hr color="#660000" />
    </header>
  );
};

export default Header;