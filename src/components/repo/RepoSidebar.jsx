import React from "react";
import "./RepoSidebar.css";

const RepoSidebar = () => {
  return (
    <div className="repo-side">
      <h3>About</h3>
      <p>
        TravelHaven is a web application for discovering unique accommodations,
        featuring listings, reviews, and location maps.
      </p>
      <a href="http://www.travelhaven.co.in" target="_blank"> <i class="fa-solid fa-link"></i>&nbsp;www.travelhaven.co.in</a>
    </div>
  );
};

export default RepoSidebar;
