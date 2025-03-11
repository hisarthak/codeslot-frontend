import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import RepoNavbar from "./RepoNavbar";
import RepoList from "./RepoList";
import RepoSidebar from "./RepoSidebar";
import "./UserRepo.css";
import Navbar from "../Navbar";

const UserRepo = () => {
  const [isAuthorized, setIsAuthorized] = useState(false); // State to track authorization
  const [loading, setLoading] = useState(true); // State to show loading status
   const navigate = useNavigate(); // For programmatic navigation
   const [error, setError] = useState(false);
    
    
      const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const handleGoHome = () => {
      navigate("/"); // Navigate back to the home page
    };
    
    
      useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
    
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
    
        return () => {
          window.removeEventListener("online", handleOnline);
          window.removeEventListener("offline", handleOffline);
        };
      }, []);

      
  useEffect(() => {
    const fetchAccess = async () => {
      try {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        const repoName = pathParts.slice(-2).join("/"); // Join the last two parts with a "/"
        const encodedRepoName = encodeURIComponent(repoName);

        const url = `https://gitspace.duckdns.org:3002/repo/user/details/${encodedRepoName}?check=access`;

        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");

        // Send request with additional "check" query parameter
        const response = await axios.post(url, { token, username });

        if (response.data.isAccessible) {
          setIsAuthorized(true); // Allow rendering of the page
        } else {
         setIsAuthorized(false);
         setLoading(false);
        }
      } catch (error) {
        setError(true);
        setIsAuthorized(false);
        setLoading(false);
      } finally {
        setLoading(false); // Stop the loading indicator
      }
    };

    fetchAccess();
  }, []);

  if (loading) {
 return <> <Navbar /><div className="center-the-div">Loading...</div></>; // Show a loading message while verifying access
  }

  if (!isAuthorized || error ){
    return  <>
     <Navbar />
      <section id="not-found-section">
        <div className="not-found-content">
          {isOffline ? (
        <>
          <h1 className="not-found-title">You're Offline</h1>
          <p className="not-found-message">Check your internet connection and try again.</p>
        </>
      ) : (
        <>
          <h1 className="not-found-title">404</h1>
          <p className="not-found-message">Oops! The page you're looking for doesn't exist.</p>
        </>
      )}
          <div className="go-home-button" onClick={handleGoHome}>
            <button className="go-home-btn">Go Back Home</button>
          </div>
        </div>
      </section>
  </>// Show a fallback message if unauthorized
  }

  return (
    <>
      <Navbar />
      <div className="repo-page">
        {/* Top Navigation */}
        <RepoNavbar />
        <div className="repo-contain">
          {/* Main Repository Content */}
          <RepoList />
        </div>
        <div className="repo-sidebar">
          <RepoSidebar />
        </div>
      </div>
    </>
  );
};

export default UserRepo;
