import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import "./navbar.css";

const Navbar = () => {
    const [userDetails, setUserDetails] = useState({ username: "" });
    useEffect(() => {
      const fetchUserDetails = async () => {
        const userId = localStorage.getItem("userId");
  
        if (userId) {
          try {
            const response = await axios.get(
              `https://gitspace.duckdns.org:3002/userProfile/${userId}`
            );
  
            setUserDetails(response.data);
          } catch (err) {
            console.error("Cannot fetch user details: ", err);
          }
        }
      };
      fetchUserDetails();
    },[]);
    return (
        <>
    <nav>
    <div class="toggle">
        <i class="fa-solid fa-bars" ></i>
        </div>
        <Link to="/">
        <div><img
         src="../sloth.png"
         alt="SlotCode Logo"
         />
         <h4 title="Go to Dashboard" class="dash">SlotCode</h4>
         </div>
         </Link>
         <div>
            <Link to="/repo">
            <p class="repo-link">Create Repo</p>
            </Link>
            <Link to="/profile" class="profile-link">
            <p class="btn tooltip"><b>{userDetails.username.charAt(0).toUpperCase()}</b> <span class="tooltip-text">Profile</span></p>
            </Link>
         </div>
    </nav>
    </>);
};

export default Navbar;