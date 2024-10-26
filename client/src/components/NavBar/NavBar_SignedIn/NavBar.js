import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faUser, faCog, faSignOutAlt, faIdCard } from '@fortawesome/free-solid-svg-icons';
import LogoutModal from '../../LogoutModal/LogoutModal';
import ProfileModal from '../../ProfileModal/ProfileModal';
import SettingsModal from '../../SettingsModal/SettingsModal';
import './NavBar.css';

const NavBarSignedIn = ({ toggleDarkMode, isDarkMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: sessionStorage.getItem('userEmail'),
  });

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleTitleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    sessionStorage.removeItem('userEmail');
    setLogoutModalOpen(false);
    navigate('/loggedout');
  };

  const handleCancelLogout = () => {
    setLogoutModalOpen(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen((prev) => !prev);
  };

  const openProfileModal = () => {
    setProfileModalOpen(true);
    setUserDropdownOpen(false);
  };

  const openSettingsModal = () => {
    setSettingsModalOpen(true);
    setUserDropdownOpen(false);
  };

  const handleSaveProfile = (updatedData) => {
    setUserData(updatedData);
  };

  const handleDeleteAccount = () => {
    sessionStorage.removeItem('userEmail');
    setSettingsModalOpen(false);
    navigate('/account-deleted');
  };

  return (
    <div className={`NavBar ${isScrolled ? 'scrolled' : ''}`}>
      <h1>
        <Link to="/" onClick={handleTitleClick}>OUR PLATFORM</Link>
      </h1>
      <ul className="nav-links">
        <li><Link to="/about" onClick={handleTitleClick}>About Us</Link></li>
        <li><Link to="/dashboard" onClick={handleTitleClick}>Dashboard</Link></li>
        <li><Link to="/calendar" onClick={handleTitleClick}>Calendar</Link></li>
        <li><Link to="/chatbot" onClick={handleTitleClick}>Chatbot</Link></li>
        <li className="user-info-dropdown">
          <button
            onClick={toggleUserDropdown}
            aria-label="User Info"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <FontAwesomeIcon icon={faUser} style={{ fontSize: '1.5rem', color: 'white' }} />
          </button>
          {isUserDropdownOpen && (
            <div className={isDarkMode ? "user-dropdown dark-mode" : "user-dropdown"}>
              <ul>
                <button onClick={openProfileModal}>
                  <li>
                    <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '10px' }} />
                    Profile
                  </li>
                </button>
                <button onClick={openSettingsModal}>
                  <li>
                    <FontAwesomeIcon icon={faCog} style={{ marginRight: '10px' }} />
                    Settings
                  </li>
                </button>
                <button onClick={handleLogoutClick}>
                  <li>
                    <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} />
                    Logout
                  </li>
                </button>
              </ul>
            </div>
          )}
        </li>
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
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        isDarkMode={isDarkMode}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        userEmail={userData.email}
        onSave={handleSaveProfile}
        isDarkMode={isDarkMode}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        userEmail={userData.email}
        toggleTheme={toggleDarkMode}
        currentTheme={isDarkMode ? 'dark-mode' : 'light-mode'}
        isDarkMode={isDarkMode}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
};

export default NavBarSignedIn;
