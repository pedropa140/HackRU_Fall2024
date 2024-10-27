import React, { useState, useEffect } from 'react';
import '../../App.css';
import './AboutPage.css';
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer';
import NavBarNotSignedIn from '../NavBar/NavBar_NotSignedIn/NavBar';
import NavBarSignedIn from '../NavBar/NavBar_SignedIn/NavBar';
import SignInModal from '../SignInModal/SignInModal';
import SignUpModal from '../SignUpModal/SignUpModal';

const AboutPage = ({ toggleDarkMode, isDarkMode }) => {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const toggleSignInModal = () => {
    setIsSignInModalOpen(!isSignInModalOpen);
  };

  const toggleSignUpModal = () => {
    setIsSignUpModalOpen(!isSignUpModalOpen);
  };

  const handleTitleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    document.title = 'About Us';
  }, []);

  const isUserSignedIn = sessionStorage.getItem('userEmail') !== null;

  return (
    <section id='AboutPage' className={isDarkMode ? 'dark-mode' : ''}>
      {isUserSignedIn ? (
        <NavBarSignedIn
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          toggleSignInModal={toggleSignInModal}
          toggleSignUpModal={toggleSignUpModal}
        />
      ) : (
        <NavBarNotSignedIn
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
          toggleSignInModal={toggleSignInModal}
          toggleSignUpModal={toggleSignUpModal}
        />
      )}

      <SignInModal isOpen={isSignInModalOpen} onClose={toggleSignInModal} isDarkMode={isDarkMode} />
      <SignUpModal isOpen={isSignUpModalOpen} onClose={toggleSignUpModal} isDarkMode={isDarkMode} />

      <div className='AboutPage_hero'>
        <h1 className='hero_title'>About Us</h1>
        <p className='hero_subtitle'>
          Welcome to SoulNest, your haven of peace and care.
        </p>
      </div>
      <div className='AboutPage_content'>
        <h2 className='content_title'>Our Mission</h2>
        <p className='content_text'>
          Empowering individuals to overcome crises through innovative tools and compassionate support.
        </p>
        <h2 className='content_title'>Our Values</h2>
        <ul className='values_list'>
          <li className='value_item'>Compassion: We prioritize empathy and understanding in every interaction.</li>
          <li className='value_item'>Accessibility: We strive to make mental health support accessible to all.</li>
          <li className='value_item'>Innovation: We embrace technology to provide cutting-edge solutions.</li>
          <li className='value_item'>Reliability: We are committed to providing consistent and dependable support.</li>
          <li className='value_item'>Confidentiality: We prioritize the privacy and security of our users.</li>
        </ul>
        <h2 className='content_title'>Get In Touch</h2>
        <p className='content_text'>
          We would love to hear from you! Whether you have questions, need support, or want to collaborate, feel free to reach out to us at <a href="mailto:soulnest@email.com" className='contact_email'>soulnest@email.com</a>.
        </p>
        <Link to="/contact" onClick={handleTitleClick}><button className='contact-button'>Contact Us</button></Link>
      </div>

      <Footer />
    </section>
  );
};

export default AboutPage;
