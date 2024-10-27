import React, { useState, useEffect } from 'react';
import '../../App.css';
import './TermsOfService.css';
import NavBarNotSignedIn from '../NavBar/NavBar_NotSignedIn/NavBar';
import NavBarSignedIn from '../NavBar/NavBar_SignedIn/NavBar';
import SignInModal from '../SignInModal/SignInModal';
import SignUpModal from '../SignUpModal/SignUpModal';
import Footer from '../Footer/Footer';

const TermsOfService = ({ toggleDarkMode, isDarkMode }) => {
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    const toggleSignInModal = () => {
        setIsSignInModalOpen(!isSignInModalOpen);
    };

    const toggleSignUpModal = () => {
        setIsSignUpModalOpen(!isSignUpModalOpen);
    };

    const isUserSignedIn = sessionStorage.getItem('userEmail') !== null;

    useEffect(() => {
        document.title = 'Terms of Service';
    }, []);

    return (
        <section id='TermsOfService' className={isDarkMode ? 'dark-mode' : ''}>
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

            <div className='terms-of-service-content'>
                <h1>Terms of Service</h1>
                <p>
                    Welcome to SoulNest. By accessing or using our services, you agree to comply with and be bound by these Terms of Service. Please read them carefully. If you do not agree with any part of these terms, you must not use our services.
                </p>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By using our platform, you accept and agree to these Terms of Service and our Privacy Policy. If you are using our services on behalf of an organization, you represent that you have the authority to bind that organization to these terms.
                </p>

                <h2>2. Changes to Terms</h2>
                <p>
                    We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new terms on our platform. Your continued use of the services after changes are posted constitutes your acceptance of the revised terms.
                </p>

                <h2>3. Eligibility</h2>
                <p>
                    You must be at least 18 years old to use our services. By using our platform, you represent and warrant that you are of legal age to form a binding contract.
                </p>

                <h2>4. User Accounts</h2>
                <p>
                    To access certain features of our services, you may be required to create an account. You agree to:
                </p>
                <ul>
                    <li>Provide accurate, current, and complete information.</li>
                    <li>Maintain the security of your password and account.</li>
                    <li>Notify us immediately of any unauthorized use of your account.</li>
                    <li>Be responsible for all activities that occur under your account.</li>
                </ul>

                <h2>5. User Conduct</h2>
                <p>
                    You agree not to engage in any of the following prohibited activities:
                </p>
                <ul>
                    <li>Using the services for any unlawful purpose.</li>
                    <li>Attempting to gain unauthorized access to the platform.</li>
                    <li>Interfering with or disrupting the security or integrity of the services.</li>
                    <li>Impersonating another person or entity.</li>
                </ul>

                <h2>6. Intellectual Property</h2>
                <p>
                    All content, trademarks, and other intellectual property on our platform are the property of SoulNest or our licensors. You are granted a limited license to access and use the services for personal, non-commercial purposes.
                </p>

                <h2>7. Third-Party Services</h2>
                <p>
                    Our platform may contain links to third-party websites or services. We are not responsible for the content or practices of these third-party sites. We encourage you to review the terms and policies of any third-party services you use.
                </p>

                <h2>8. Limitation of Liability</h2>
                <p>
                    To the fullest extent permitted by law, SoulNest shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the services, even if we have been advised of the possibility of such damages.
                </p>

                <h2>9. Indemnification</h2>
                <p>
                    You agree to indemnify and hold harmless SoulNest, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, costs, or expenses arising from your use of the services or violation of these terms.
                </p>

                <h2>10. Governing Law</h2>
                <p>
                    These Terms of Service shall be governed by and construed in accordance with the laws of [Your Country/State]. Any disputes arising from these terms shall be resolved in the courts located in [Your Jurisdiction].
                </p>

            </div>
            <br />

            <Footer />
        </section>
    );
}

export default TermsOfService;
