import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom'; 

const Footer = () => {
    const handleTitleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const isUserSignedIn = sessionStorage.getItem('userEmail') !== null;

    return (
        <div>
            {!isUserSignedIn ? (
                <div className='newsletter'>
                    <h2>Stay Updated</h2>
                    <p>Sign up for our newsletter to get the latest news and updates.</p>
                    <form className='newsletter_form'>
                        <input type='email' placeholder='Enter your email' />
                        <button type='submit'>Subscribe</button>
                    </form>
                </div>
            ) : (<div></div>) }

            <footer className='footer'>
                <div className='footer_links'>
                    <Link to="/about" onClick={handleTitleClick}>About Us</Link>
                    <Link to="/contact" onClick={handleTitleClick}>Contact</Link>
                    <Link to="/privacypolicy" onClick={handleTitleClick}>Privacy Policy</Link>
                    <Link to="/termsofservice" onClick={handleTitleClick}>Terms Of        Service</Link>
                </div>
                <p>&copy; {new Date().getFullYear()} Our Platform. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Footer;