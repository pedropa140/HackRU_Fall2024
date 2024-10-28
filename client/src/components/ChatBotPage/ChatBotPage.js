import React, { useState, useEffect, useRef } from 'react';
import '../../App.css';
import './ChatBotPage.css';
import Footer from '../Footer/Footer';
import NavBarSignedIn from '../NavBar/NavBar_SignedIn/NavBar';

const ChatBotPage = ({ toggleDarkMode, isDarkMode }) => {
    const [inputValue, setInputValue] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const chatContainerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = 'ChatBot';
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (inputValue.trim().length === 0) {
            console.log("Input value is empty, doing nothing.");
            return;
        }

        const userMessage = {
            sender: 'user',
            message: inputValue,
            timestamp: new Date().toLocaleTimeString(),
        };

        setChatHistory((prevHistory) => [...prevHistory, userMessage]);
        setIsLoading(true);

        try {
            const res = await fetch('/api/sendmessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputValue }),
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            const botMessage = {
                sender: 'bot',
                message: data.response,
                timestamp: new Date().toLocaleTimeString(),
            };

            setChatHistory((prevHistory) => [...prevHistory, botMessage]);
            setInputValue('');
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                sender: 'bot',
                message: 'There was an error processing your request. Please try again.',
                timestamp: new Date().toLocaleTimeString(),
            };
            setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id='ChatBotPage' className={isDarkMode ? 'dark-mode' : ''}>
            <NavBarSignedIn toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
            <div className='ChatBotPage_hero'>
                <h1 className='hero_title'>Chatbot</h1>
      

                {/* TODO: FIX CHATBOT FORM DESIGN AND LOADING. ADD SCROLL TO THE CONTENT*/}
                <form onSubmit={handleSubmit} className='styled-form'>
                    <input
                        type="text"
                        value={inputValue}
                        placeholder='Talk to AI'
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <div className="spinner"></div>
                        ) : (<p>Send</p>)}
                    </button>

                </form>
            </div>
            <div className='ChatBotPage_content' ref={chatContainerRef}>
                {chatHistory.map((chat, index) => (
                    <div key={index} className={chat.sender}>
                        {chat.sender === 'bot' ? (
                            <div className='message' dangerouslySetInnerHTML={{ __html: chat.message }} />
                        ) : (
                            <div className='message'>{chat.message}</div>
                        )}
                        <div className='timestamp'>
                            {chat.timestamp}
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </section>
    );
};

export default ChatBotPage;
