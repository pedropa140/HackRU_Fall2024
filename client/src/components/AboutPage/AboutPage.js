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
          Welcome to Memory+, where you are cared.
        </p>
      </div>
      <div className='AboutPage_content'>
        <h2 className='content_title'>Our Mission</h2>
        <p className='content_text'>
          Our mission is to empower individuals and organizations by delivering exceptional products and services that enhance efficiency, productivity, and overall success. We strive to foster a culture of continuous improvement and innovation, ensuring that we stay ahead in an ever-evolving industry.
        </p>
        <h2 className='content_title'>Our Values</h2>
        <ul className='values_list'>
          <li className='value_item'><strong>Integrity:</strong> We believe in maintaining transparency and honesty in all our dealings.</li>
          <li className='value_item'><strong>Excellence:</strong> We are committed to delivering quality services that exceed expectations.</li>
          <li className='value_item'><strong>Collaboration:</strong> Working together with clients and partners is key to achieving shared success.</li>
          <li className='value_item'><strong>Innovation:</strong> We embrace creativity and continuously seek new ways to solve problems.</li>
          <li className='value_item'><strong>Customer Focus:</strong> Our clients are at the heart of everything we do, and we strive to meet their needs with dedication.</li>
        </ul>
        <h2 className='content_title'>Meet Our Team</h2>
        <div className='team'>
          <div className='team-member'>
            <img src="/images/john-doe.jpg" alt="John Doe" className='team-member_img' />
            <h3 className='team-member_name'>John Doe</h3>
            <p className='team-member_role'>Founder & CEO</p>
            <p className='team-member_description'>With over 20 years of experience in the industry, John leads our team with a vision to innovate and excel.</p>
          </div>
          <div className='team-member'>
            <img src="/images/jane-smith.jpg" alt="Jane Smith" className='team-member_img' />
            <h3 className='team-member_name'>Jane Smith</h3>
            <p className='team-member_role'>Chief Operating Officer</p>
            <p className='team-member_description'>Jane is responsible for the day-to-day operations and ensures that our projects run smoothly and efficiently.</p>
          </div>
          <div className='team-member'>
            <img src="/images/michael-johnson.jpg" alt="Michael Johnson" className='team-member_img' />
            <h3 className='team-member_name'>Michael Johnson</h3>
            <p className='team-member_role'>Lead Developer</p>
            <p className='team-member_description'>As a skilled developer, Michael oversees our development team and ensures that our products meet the highest standards.</p>
          </div>
          <div className='team-member'>
            <img src="/images/emily-davis.jpg" alt="Emily Davis" className='team-member_img' />
            <h3 className='team-member_name'>Emily Davis</h3>
            <p className='team-member_role'>Marketing Director</p>
            <p className='team-member_description'>Emily drives our marketing strategies and helps us reach our audience effectively.</p>
          </div>
        </div>
        <h2 className='content_title'>Get In Touch</h2>
        <p className='content_text'>
          We would love to hear from you! Whether you have questions, need support, or want to collaborate, feel free to reach out to us at <a href="mailto:info@yourcompany.com" className='contact_email'>info@yourcompany.com</a> or connect with us through our social media channels.
        </p>
        <Link to="/contact" onClick={handleTitleClick}><button className='contact-button'>Contact Us</button></Link>
      </div>

      <Footer />
    </section>
  );
};

export default AboutPage;
