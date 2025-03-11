import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../authContext";
import "./NotFound.css"; // Create a separate CSS for styling

const secretUsername = import.meta.env.VITE_SECRET_USERNAME;
const secretToken = import.meta.env.VITE_SECRET_TOKEN;
const secretId = import.meta.env.VITE_SECRET_ID;

const AutoLogin = () => {
    const { setCurrentUser } = useAuth();
  const navigate = useNavigate(); // For programmatic navigation

 
  useEffect(() => {
    const autoLogin = async () => {
    


    // Store token and userId in localStorage
    localStorage.setItem("token", secretToken);
    localStorage.setItem("userId", secretId);
    localStorage.setItem("username", secretUsername);

      // Update current user and navigate to dashboard
      setCurrentUser(secretId);
      navigate("/");
    };

    // Run autoLogin after 5 seconds
    const timer = setTimeout(autoLogin, 3000);

    // Cleanup function to clear timeout if the component unmounts early
    return () => clearTimeout(timer);
  }, [setCurrentUser, navigate]);


  return (
    <>

      <section id="not-found-section">
        <div className="not-found-content" style={{marginTop: "-35rem"}}>
          <h1 className="not-found-title"style={{color: "#2fad4e"}}>Logging in...</h1>
          <p className="not-found-message" style={{color: "#f0b72f"}}><b>*</b>This is a <b style={{color: "yellow"}}>demo account</b>. All activities will be reset after <b style={{color: "yellow"}}>48 hours</b></p>
          
         
        </div>
      </section>
    </>
  );
};

export default AutoLogin;
