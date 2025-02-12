import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";

import { PageHeader } from "@primer/react/drafts";
import { Box, Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/sloth.png";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Store validation errors

  const { setCurrentUser } = useAuth();
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSignup(e);
    }
  };
  const validateInputs = () => {
    let newErrors = {}; // Object to store errors

    // **Username validation**
    if (!username.trim()) newErrors.username = "Required";
    else if (username.includes(" ")) newErrors.username = "No spaces allowed";

    // **Email validation**
    if (!email.trim()) newErrors.email = "Required";

    // **Password validation**
    if (!password.trim()) newErrors.password = "Required";
    else if (password.includes(" ")) newErrors.password = "No spaces allowed";

    setErrors(newErrors); // Update error state
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return; // Stop if validation fails

    try {
      setLoading(true);
      const res = await axios.post(`https://${apiUrl}/signup`, {
        email: email.trim(),
        password: password.trim(),
        username: username.trim(),
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("username", username.trim());

      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setErrors({ general: "Signup Failed! Please try again." });
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <Box sx={{ padding: 1 }}>
            <PageHeader>
              <PageHeader.TitleArea variant="large">
                <PageHeader.Title>Sign Up</PageHeader.Title>
              </PageHeader.TitleArea>
            </PageHeader>
          </Box>
        </div>

        <div className="login-box">
          <div>
            <label className="label">Username</label>
            <input
              autoComplete="off"
              className="input"
              type="text"
              value={username}
              onKeyDown={handleKeyDown}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <p className="error-message">&nbsp;&nbsp;&#9888;&nbsp;{errors.username}</p>}
          </div>

          <div>
            <label className="label">Email address</label>
            <input
              autoComplete="off"
              className="input"
              type="email"
              value={email}
              onKeyDown={handleKeyDown}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error-message">&nbsp;&nbsp;&#9888;&nbsp;{errors.email}</p>}
          </div>

          <div>
            <label className="label">Password</label>
            <input
              autoComplete="off"
              className="input"
              type="password"
              value={password}
              onKeyDown={handleKeyDown}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="error-message">&nbsp;&nbsp;&#9888;&nbsp;{errors.password}</p>}
          </div>

          {errors.general && <p className="error-message">&nbsp;&nbsp;&#9888;&nbsp;{errors.general}</p>}
          <div className='the-auth-btn-container'>
          <button
            variant="primary"
            className={loading ? 'disabled create-repo-btn the-auth-btn' : 'create-repo-btn the-auth-btn'}
            disabled={loading}
            onClick={handleSignup}
          >
            {loading ? "Wait..." : "Sign Up"}
          </button>
          </div>
        </div>

        <div className="pass-box">
          <p>
            Already have an account? <Link to="/auth" className="the-auth-link"style={{color: "#74b9ff"}}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
