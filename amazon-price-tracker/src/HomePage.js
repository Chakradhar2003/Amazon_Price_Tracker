import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css'; // for custom styles

const HomePage = () => {
    const [asin, setAsin] = useState('');
    const [asins, setAsins] = useState([]);

    useEffect(() => {
        fetchAsins();
    }, []);

    const fetchAsins = async () => {
        const response = await axios.get('http://localhost:5000/api/asins');
        setAsins(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (asin) {
            await axios.post('http://localhost:5000/api/asins', { asin });
            setAsin('');
            fetchAsins();
        }
    };

    return (
        <div className="container">
            {/* Header */}
            <header className="header">
                <h1>Amazon Price Tracker</h1>
            </header>
            
            {/* Main Content */}
            <main>
                <form onSubmit={handleSubmit} className="form">
                    <input 
                        type="text" 
                        value={asin} 
                        onChange={(e) => setAsin(e.target.value)} 
                        placeholder="Enter ASIN" 
                        className="input"
                    />
                    <button type="submit" className="submit-btn">Add ASIN</button>
                </form>

                <div className="asin-list">
                    <h2>Stored ASINs:</h2>
                    {asins.length > 0 ? (
                        <ul>
                            {asins.map((asinObj) => (
                                <li key={asinObj._id}>{asinObj.asin}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No ASINs stored.</p>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <p>&copy; 2024 Amazon Price Tracker. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
