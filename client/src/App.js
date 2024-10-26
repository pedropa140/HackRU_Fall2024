import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import AboutPage from './components/AboutPage/AboutPage';
import SignInPage from './components/SignInPage/SignInPage';
import SignUpPage from './components/SignUpPage/SignUpPage';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';
import ContactPage from './components/ContactPage/ContactPage';
import DashboardPage from './components/DashboardPage/DashboardPage';
import LoggedOutPage from './components/LoggedOutPage/LoggedOutPage';
import AccountDeletedPage from './components/AccountDeletedPage/AccountDeletedPage';
import TermsOfService from './components/TermsOfService/TermsOfService';
import CalendarPage from './components/CalendarPage/CalendarPage';
import ChatBotPage from './components/ChatBotPage/ChatBotPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';
import './App.css';

const App = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('isDarkMode');
        return savedMode === 'true';
    });

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('isDarkMode', newMode);
            return newMode;
        });
    };

    return (
        <Router>
            <div className={isDarkMode ? 'dark-mode' : ''}>
                <Routes>
                    <Route path="/" element={<HomePage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />} />
                    <Route path="/about" element={<AboutPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />} />
                    <Route
                        path="/signin"
                        element={
                            <PublicRoute>
                                <SignInPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <PublicRoute>
                                <SignUpPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/loggedout"
                        element={
                            <PublicRoute>
                                <LoggedOutPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                            </PublicRoute>
                        }
                    />
                    <Route path="/privacypolicy" element={<PrivacyPolicy toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />} />
                    <Route path="/termsofservice" element={<TermsOfService toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />} />
                    <Route path="/contact" element={<ContactPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />} />

                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <DashboardPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/calendar"
                        element={
                            <PrivateRoute>
                                <CalendarPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/chatbot"
                        element={
                            <PrivateRoute>
                                <ChatBotPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/account-deleted"
                        element={
                            <PublicRoute>
                                <AccountDeletedPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                            </PublicRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
