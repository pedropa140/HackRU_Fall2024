import React, { useState, useEffect } from 'react';
import '../../App.css';
import './HomePage.css';
import Footer from '../Footer/Footer';
import NavBarNotSignedIn from '../NavBar/NavBar_NotSignedIn/NavBar';
import NavBarSignedIn from '../NavBar/NavBar_SignedIn/NavBar';
import SignInModal from '../SignInModal/SignInModal';
import SignUpModal from '../SignUpModal/SignUpModal';
import { Link } from 'react-router-dom';

const HomePage = ({ toggleDarkMode, isDarkMode }) => {
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
    document.title = 'Home';
  }, []);

  const isUserSignedIn = sessionStorage.getItem('userEmail') !== null;

  return (
    <section id='HomePage' className={isDarkMode ? 'dark-mode' : ''}>
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

      <div className='HomePage_hero'>
        <h1 className='hero_title'>Welcome to Our Platform</h1>
        <p className='hero_subtitle'>Connecting people and ideas for a brighter future.</p>
        {!isUserSignedIn ? (
          <button className='hero_button' onClick={toggleSignUpModal}>Get Started</button>
        ) : (
          <Link to="/dashboard">
            <button className='hero_button' onClick={handleTitleClick}>Go to Your Dashboard</button>
          </Link>
        )}
      </div>

      <div className='HomePage_features'>
        <h2 className='features_title'>Why Choose Us?</h2>
        <div className='features_list'>
          <div className='feature_item'>
            <h3>Easy to Use</h3>
            <p>Our platform is designed for simplicity and ease of use.</p>
          </div>
          <div className='feature_item'>
            <h3>Community Driven</h3>
            <p>We foster a supportive and vibrant community.</p>
          </div>
          <div className='feature_item'>
            <h3>Secure and Private</h3>
            <p>Your privacy is our priority, with top-notch security protocols.</p>
          </div>
        </div>
      </div>

      <div className='HomePage_testimonials'>
        <h2 className='testimonials_title'>What Our Users Say</h2>
        <div className='testimonials_list'>
          <div className='testimonial_item'>
            <p>"This platform changed the way I work. It's intuitive and powerful!"</p>
            <span>- Alex R.</span>
          </div>
          <div className='testimonial_item'>
            <p>"I love the community here. Everyone is so helpful and friendly."</p>
            <span>- Sarah K.</span>
          </div>
          <div className='testimonial_item'>
            <p>"Privacy and security are top-notch. I feel safe using this platform."</p>
            <span>- John D.</span>
          </div>
        </div>
      </div>

      <div className='HomePage_contact'>
        <h2 className='contact_title'>Contact Us</h2>
        <p>If you have any questions, feel free to reach out!</p>
        <p>Email: support@example.com</p>
        <p>Phone: (123) 456-7890</p>
      </div>

      <div className='HomePage_faq'>
        <h2 className='faq_title'>Frequently Asked Questions</h2>
        <div className='faq_item'>
          <h3>How do I create an account?</h3>
          <p>You can create an account by clicking the "Get Started" button above.</p>
        </div>
        <div className='faq_item'>
          <h3>What if I forget my password?</h3>
          <p>You can reset your password using the "Forgot Password" link on the login page.</p>
        </div>
        <div className='faq_item'>
          <h3>Is my data safe?</h3>
          <p>Yes! We use advanced encryption to protect your data.</p>
        </div>
      </div>

      <div className='HomePage_features_in_depth'>
        <h2 className='features_in_depth_title'>Features in Depth</h2>
        <div className='features_in_depth_list'>
          <div className='features_in_depth_item'>
            <h3>User-Friendly Interface</h3>
            <p>Our intuitive design allows users of all skill levels to navigate effortlessly.</p>
          </div>
          <div className='features_in_depth_item'>
            <h3>Customizable Experience</h3>
            <p>Personalize your dashboard with widgets and themes that suit your style.</p>
          </div>
          <div className='features_in_depth_item'>
            <h3>24/7 Support</h3>
            <p>Our dedicated support team is here to help you any time of day.</p>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default HomePage;
