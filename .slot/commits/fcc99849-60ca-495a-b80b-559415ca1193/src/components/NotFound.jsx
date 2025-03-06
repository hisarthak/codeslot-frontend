import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar"; // Assuming you have a navbar component
import "./NotFound.css"; // Create a separate CSS for styling

const NotFound = () => {
  const navigate = useNavigate(); // For programmatic navigation

  const handleGoHome = () => {
    navigate("/"); // Navigate back to the home page
  };

  return (
    <>
      <Navbar />
      <section id="not-found-section">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <p className="not-found-message">Oops! The page you're looking for doesn't exist.</p>
          
          <div className="go-home-button" onClick={handleGoHome}>
            <button className="go-home-btn">Go Back Home</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
