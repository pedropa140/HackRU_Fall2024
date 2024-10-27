import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import './NavBar.css';


const NavBarNotSignedIn = ({ toggleDarkMode, isDarkMode, toggleModal, toggleSignUpModal, toggleSignInModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleTitleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`NavBar ${isScrolled ? 'scrolled' : ''}`}>
      <h1>
        <Link to="/" onClick={handleTitleClick}>Memory+</Link>
      </h1>
      <ul className="nav-links">
        <li><Link to="/about" onClick={handleTitleClick}>About Us</Link></li>
        <li><Link to="/signup" onClick={handleTitleClick}>Sign Up</Link></li>
        <li><Link to="/signin" onClick={handleTitleClick}>Sign In</Link></li>
        {/* <li><button className="signup_nav-button" onClick={toggleSignUpModal}>Sign up</button></li>
        <li><button className="login-button" onClick={toggleSignInModal}>Sign In</button></li> */}
        <li className="dark-mode-toggle">
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: "1.5rem",
            }}
          >
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default NavBarNotSignedIn;
