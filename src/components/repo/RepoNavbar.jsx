import React from "react";
import "./RepoNavbar.css";

const RepoNavbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-right">
        <ul>
          <li>Code</li>
          <li>Issues</li>
          <li>Pull Requests</li>
          <li>Actions</li>
          <li>Projects</li>
          <li>Security</li>
        </ul>
      </div>
    </nav>
  );
};

export default RepoNavbar;
