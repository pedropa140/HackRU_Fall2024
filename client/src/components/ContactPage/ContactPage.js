import React, { useState, useEffect } from 'react';
import '../../App.css';
import './ContactPage.css';
import NavBarNotSignedIn from '../NavBar/NavBar_NotSignedIn/NavBar';
import NavBarSignedIn from '../NavBar/NavBar_SignedIn/NavBar';
import SignInModal from '../SignInModal/SignInModal';
import SignUpModal from '../SignUpModal/SignUpModal';
import { Link } from 'react-router-dom';

const ContactPage = ({ toggleDarkMode, isDarkMode }) => {
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

    const isUserSignedIn = sessionStorage.getItem('userEmail') !== null;

    useEffect(() => {
        document.title = 'Contact Us';
    }, []);

    return (
        <section id='ContactPage' className={isDarkMode ? 'dark-mode' : ''}>
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

            <div className='contact-page-content'>
                <h1>Contact Us</h1>
                <p>
                    We would love to hear from you! If you have any questions, concerns, or feedback, please reach out to us through the form below or via our email.
                </p>

                <h2>Contact Form</h2>
                <form>
                    <div>
                        <label htmlFor='name'>Name:</label>
                        <input type='text' id='name' name='name' required />
                    </div>
                    <div>
                        <label htmlFor='email'>Email:</label>
                        <input type='email' id='email' name='email' required />
                    </div>
                    <div>
                        <label htmlFor='message'>Message:</label>
                        <textarea id='message' name='message' rows='4' required></textarea>
                    </div>
                    <button type='submit'>Send Message</button>
                </form>

                <h2>Our Contact Information</h2>
                <p>If you prefer to reach us directly, you can contact us via:</p>
                <p>Email: support@ourplatform.com</p>
                <p>Address: 123 Contact St., Your City, Your Country</p>
            </div>

            <footer className='ContactPage_footer'>
                <div className='footer_links'>
                    <Link to="/about" onClick={handleTitleClick}>About Us</Link>
                    <Link to="/contact" onClick={handleTitleClick}>Contact</Link>
                    <Link to="/privacypolicy" onClick={handleTitleClick}>Privacy Policy</Link>
                </div>
                <p>&copy; {new Date().getFullYear()} Our Platform. All rights reserved.</p>
            </footer>
        </section>
    );
}

export default ContactPage;
