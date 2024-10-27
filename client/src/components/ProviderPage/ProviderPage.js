import React from 'react';
import '../../App.css';
import './ProviderPage.css';
import { useNavigate } from 'react-router-dom';
import NavBarSignedIn from '../NavBar/NavBar_SignedIn/NavBar';
import Footer from '../Footer/Footer';

const ProviderPage = ({ toggleDarkMode, isDarkMode }) => {
    const navigate = useNavigate();

    // Hardcoded primary provider information
    const primaryProvider = {
        name: "Dr. Jane Smith",
        specialty: "Primary Care Physician",
        address: "123 Health St, Wellness City, NY 12345",
        phone: "(123) 456-7890",
        email: "janesmith@healthmail.com"
    };

    // Hardcoded nearby providers information
    const nearbyProviders = [
        {
            name: "Dr. John Doe",
            specialty: "Cardiologist",
            address: "456 Care Ave, Wellness City, NY 12345",
            phone: "(123) 555-0199",
            distance: "1.2 miles"
        },
        {
            name: "Dr. Sarah Lee",
            specialty: "Dermatologist",
            address: "789 Health Dr, Wellness City, NY 12345",
            phone: "(123) 555-1234",
            distance: "2.5 miles"
        },
        {
            name: "Dr. Emily Wang",
            specialty: "Pediatrician",
            address: "101 Healing Way, Wellness City, NY 12345",
            phone: "(123) 555-6789",
            distance: "3.0 miles"
        }
    ];

    return (
        <section id='ProviderPage' className={isDarkMode ? 'dark-mode' : ''}>
            <NavBarSignedIn toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />

            <div className='ProviderPage_hero'>
                <h1 className='hero_title'>Your Primary and Nearby Providers</h1>
                <p className='hero_subtitle'>Find trusted providers near you for all your healthcare needs.</p>
            </div>

            <div className='ProviderPage_content'>
                <h2 className='content_title'>Primary Provider</h2>
                <div className='provider_card primary-provider'>
                    <h3>{primaryProvider.name}</h3>
                    <p><b>Specialty:</b> {primaryProvider.specialty}</p>
                    <p><b>Address:</b> {primaryProvider.address}</p>
                    <p><b>Phone:</b> {primaryProvider.phone}</p>
                    <p><b>Email:</b> <a href={`mailto:${primaryProvider.email}`}>{primaryProvider.email}</a></p>
                </div>

                <h2 className='content_title'>Nearby Providers</h2>
                <div className='nearby_providers'>
                    {nearbyProviders.map((provider, index) => (
                        <div key={index} className='provider_card'>
                            <h3>{provider.name}</h3>
                            <p><b>Specialty:</b> {provider.specialty}</p>
                            <p><b>Address:</b> {provider.address}</p>
                            <p><b>Phone:</b> {provider.phone}</p>
                            <p><b>Distance:</b> {provider.distance}</p>
                        </div>
                    ))}
                </div>

                {/* Button to go back to Dashboard */}
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                </button>
            </div>

            <Footer />
        </section>
    );
};

export default ProviderPage;
