import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { PageHeader } from "@primer/react/drafts";
import { Box, Button } from "@primer/react";
import "./auth.css";
import logo from "../../assets/sloth.png";
import { Link, useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
// const apiUrl = "127.0.0.1:3002";

const Login = () => {
  const [username, setUsername] = useState(""); // Replace email with username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate(); // Use navigate instead of window.location.href

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        setLoading(true);
        const res = await axios.post(`https://${apiUrl}/login`, {
            username: username.trim(), // Trim the username before sending
            password: password,
        });

        // Store token and userId in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("username", username.trim());

        // Update current user and navigate
        setCurrentUser(res.data.userId);
        navigate("/"); // Navigate instead of reloading the page
    } catch (err) {
        console.error(err);
        alert("Login Failed!");
    } finally {
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
              onChange={(e) => setUsername(e.target.value)} // Updated state setter
            />
          </div>
          <div className="div">
            <label className="label" htmlFor="Password">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            className="login-btn"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </div>
        <div className="pass-box">
          <p>
            New to GitHub? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
