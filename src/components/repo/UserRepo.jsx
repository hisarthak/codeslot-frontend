import React from "react";
import RepoNavbar from "./RepoNavbar";
import RepoList from "./RepoList";
import RepoSidebar from "./RepoSidebar";
import "./UserRepo.css";
import Navbar from "../Navbar";


const UserRepo = () => {
  return (
    <>
    <Navbar/>
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
