import React, { useState, useEffect } from 'react';
import '../../App.css';
import './PrivacyPolicy.css';
import NavBarNotSignedIn from '../NavBar/NavBar_NotSignedIn/NavBar';
import NavBarSignedIn from '../NavBar/NavBar_SignedIn/NavBar';
import SignInModal from '../SignInModal/SignInModal';
import SignUpModal from '../SignUpModal/SignUpModal';
import { Link } from 'react-router-dom';

const PrivacyPolicy = ({ toggleDarkMode, isDarkMode }) => {
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
        document.title = 'Privacy Policy';
    }, []);

    return (
        <section id='PrivacyPolicy' className={isDarkMode ? 'dark-mode' : ''}>
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

            <div className='privacy-policy-content'>
                <h1>Privacy Policy</h1>
                <p>
                    Welcome to SoulNest. Your privacy is of paramount importance to us. This privacy policy describes the types of personal information we collect, how we use it, who we share it with, and the choices available to you. By using our platform, you consent to the collection and use of your information as described in this policy.
                </p>

                <h2>1. Information We Collect</h2>
                <p>
                    We collect information about you when you use our services, interact with our website, and communicate with us. The information we collect falls into the following categories:
                </p>
                <ul>
                    <li>
                        <strong>Personal Information:</strong> Information you provide directly to us, such as your name, email address, phone number, postal address, and payment information when you create an account, make purchases, or contact our support team.
                    </li>
                    <li>
                        <strong>Usage Data:</strong> We collect information about your activity on our platform, including pages visited, links clicked, and searches performed. This data helps us understand how users interact with our services.
                    </li>
                    <li>
                        <strong>Device Information:</strong> Information about the device you use to access our platform, such as your IP address, browser type, operating system, and device identifiers.
                    </li>
                    <li>
                        <strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to track your interaction with our platform, remember your preferences, and deliver targeted advertising.
                    </li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>
                    We use the information we collect for a variety of purposes, including:
                </p>
                <ul>
                    <li><strong>To Provide Services:</strong> We use your information to deliver the services you request, process transactions, and communicate with you regarding your account or support inquiries.</li>
                    <li><strong>To Improve Our Platform:</strong> We use the data collected to analyze how users interact with our services, identify trends, and improve the user experience.</li>
                    <li><strong>To Personalize Content:</strong> We tailor the content you see based on your preferences, location, and usage data.</li>
                    <li><strong>To Send Marketing Communications:</strong> With your consent, we may send you promotional messages, special offers, and updates on new features.</li>
                    <li><strong>To Ensure Security:</strong> We use your information to detect and prevent fraudulent activities, secure your account, and protect our platform from abuse.</li>
                </ul>

                <h2>3. Sharing of Information</h2>
                <p>
                    We do not sell your personal information to third parties. However, we may share your information in the following circumstances:
                </p>
                <ul>
                    <li><strong>With Service Providers:</strong> We share information with third-party vendors who provide services on our behalf, such as payment processors, cloud storage providers, and analytics companies.</li>
                    <li><strong>For Legal Reasons:</strong> We may disclose your information if required by law, court order, or governmental regulation, or if we believe in good faith that such action is necessary to protect the rights, property, or safety of our company or users.</li>
                    <li><strong>In the Event of a Merger or Sale:</strong> If our company is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</li>
                </ul>

                <h2>4. Cookies and Tracking Technologies</h2>
                <p>
                    Cookies are small text files that are stored on your device when you visit our website. We use cookies to:
                </p>
                <ul>
                    <li>Keep you signed in to your account</li>
                    <li>Remember your preferences and settings</li>
                    <li>Understand how you use our platform and improve your experience</li>
                    <li>Deliver relevant ads to you</li>
                </ul>
                <p>
                    You can control the use of cookies through your browser settings. If you choose to disable cookies, some features of our platform may not function properly.
                </p>

                <h2>5. Data Security</h2>
                <p>
                    We implement a variety of security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include encryption, access controls, and regular security audits. However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
                </p>

                <h2>6. Your Rights and Choices</h2>
                <p>
                    Depending on your location and applicable data protection laws, you may have the following rights regarding your personal information:
                </p>
                <ul>
                    <li><strong>Access:</strong> You can request access to the personal information we hold about you.</li>
                    <li><strong>Correction:</strong> You can request that we correct any inaccurate or incomplete information.</li>
                    <li><strong>Deletion:</strong> You can request that we delete your personal information, subject to certain exceptions.</li>
                    <li><strong>Opt-Out:</strong> You can opt out of receiving marketing communications by following the unsubscribe instructions in those emails.</li>
                    <li><strong>Data Portability:</strong> You can request a copy of your personal data in a commonly used format.</li>
                </ul>

                <h2>7. Third-Party Links</h2>
                <p>
                    Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>

                <h2>8. Changes to This Privacy Policy</h2>
                <p>
                    We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. If we make significant changes, we will notify you by email or through our platform. Your continued use of our services after such changes signifies your acceptance of the updated policy.
                </p>

                <h2>9. Contact Us</h2>
                <p>
                    If you have any questions or concerns about this privacy policy or how we handle your personal information, please contact us at:
                </p>
                <p>Email: support@ourplatform.com</p>
                <p>Address: 123 Privacy St., Your City, Your Country</p>

            </div>

            <br />

            <footer className='PrivacyPolicy_footer'>
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

export default PrivacyPolicy;
