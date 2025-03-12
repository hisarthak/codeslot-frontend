import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { PageHeader } from "@primer/react/drafts";
import { Box, Button } from "@primer/react";
import "./auth.css";
// import logo from "../../assets/thefinal.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
const secretUsername = import.meta.env.VITE_SECRET_USERNAME;
const secretToken = import.meta.env.VITE_SECRET_TOKEN;
const secretId = import.meta.env.VITE_SECRET_ID;
// const apiUrl = "127.0.0.1:3002";

const Login =  ({ autoLogin = false })  => {
  const [username, setUsername] = useState(""); // Replace email with username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate instead of window.location.href
  const [errors, setErrors] = useState({}); // Store validation errors


 
  useEffect(() => {
    if (autoLogin) {
      autoLoginUser(); // Trigger auto-login if special login page is accessed
    }
  }, [autoLogin]);

  const autoLoginUser = () => {
    localStorage.setItem("token", secretToken);
    localStorage.setItem("userId", secretId);
    localStorage.setItem("username", secretUsername);

    setCurrentUser(secretId);
    navigate("/"); // Redirect after login
  }; 

  

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };
  const validateInputs = () => {
    let newErrors = {}; // Object to store errors

    // **Username validation**
    if (!username.trim()) newErrors.username = "Required";



    // **Password validation**
    if (!password.trim()) newErrors.password = "Required";
  

    setErrors(newErrors); // Update error state
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
        setLoading(true);
        const res = await axios.post(`https://${apiUrl}/login`, {
            username: username.trim(), // Trim the username before sending
            password: password,
        });

        // Store token and userId in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("username", username.trim().toLowerCase());

        // Update current user and navigate
        setCurrentUser(res.data.userId);
        navigate("/"); // Navigate instead of reloading the page
    } catch (err) {
        console.error(err);
        setErrors({ general: "Login Failed!" });
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login"  src="/Codeslot-logo.png" alt="Logo" />
      </div>
      <div className="login-box-wrapper">
        <div className="login-heading">
          <Box sx={{ padding: 1 }}>
            <PageHeader>
              <PageHeader.TitleArea variant="large">
                <PageHeader.Title>Log In</PageHeader.Title>
              </PageHeader.TitleArea>
            </PageHeader>
          </Box>
        </div>
        <div className="login-box">
          <div>
            <label className="label" htmlFor="Username">Username</label> {/* Updated Label */}
            <input
              autoComplete="off"
              name="Username"
              id="Username"
              className="input"
              type="text" // Username is text, not email
              value={username}
              onKeyDown={handleKeyDown}
              onChange={(e) => setUsername(e.target.value)} // Updated state setter
            />
              {errors.username && <p className="error-message">&nbsp;&nbsp;&#9888;&nbsp;{errors.username}</p>}
          </div>
          <div className="div">
            <label className="label" htmlFor="Password">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              onKeyDown={handleKeyDown}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
               {errors.password && <p className="error-message">&nbsp;&nbsp;&#9888;&nbsp;{errors.password}</p>}
          </div>
          {errors.general && <p className="error-message">&nbsp;&nbsp;&#9888;&nbsp;{errors.general}</p>}
          <div className='the-auth-btn-container'>
          <button
            variant="primary"
            className={loading ? 'disabled create-repo-btn the-auth-btn' : 'create-repo-btn the-auth-btn'}            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Wait..." : "Login"}
          </button>
          </div>
        </div>
        <div className="pass-box">
          <p>
            New to CodeSlot? <Link to="/signup" className="the-auth-link"style={{color: "#74b9ff"}}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
