import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./RepoNavbar.css";
import {  useNavigate } from "react-router-dom";

const RepoNavbar = () => {
  const [isStarred, setIsStarred] = useState(false); // State to manage whether the repository is starred
  const [pendingRequest, setPendingRequest] = useState(false); // Track ongoing backend requests
  const lastActionRef = useRef(null); // Keep track of the latest click action
  const [repoName, setRepoName] = useState("");
  const [repoId, setRepoId] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
    const navigate = useNavigate();

  // Function to check if the repository is starred on page load
  const checkIfStarred = () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!username || !token) {
      console.error("Username or token not found in localStorage");
      return;
    }

    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const repoName = pathParts.slice(-2).join("/"); // Join the last two parts of the path
    setRepoName(repoName);
    const encodedRepoName = encodeURIComponent(repoName);

    const url = `https://gitspace.duckdns.org:3002/starProfile/${username}/${encodedRepoName}?token=${encodeURIComponent(
      token
    )}&check=starCheck`;

    axios
      .get(url)
      .then((response) => {
        console.log("Check if repository is starred response:", response.data);
        setIsStarred(response.data.isStarred);
        setRepoId(response.data.repo_id);
        setVisibility(response.data.visibility);
        if (userId.toString() === response.data.owner.toString()) {
          setIsOwner(true);
      }
      
      })
      .catch((error) => {
        console.error("Error checking if repository is starred:", error);
      });
  };


  const handleVisibilityClick = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
  
    if (!repoId || !token) {
      console.error("Repository ID or token not found.");
      return;
    }
    setVisibility(!visibility);
     // Optimistic UI update
     const newVisibilityState = !visibility;
     setVisibility(newVisibilityState);
  
    const url = `https://gitspace.duckdns.org:3002/repo/toggle/${repoId}?&userId=${userId}`;

    lastActionRef.current = newVisibilityState;
  
    try {
      if (!pendingRequest) {
        setPendingRequest(true);
      const response = await axios.patch(url);
      console.log(response);
  
      if (response.data) {
        console.log("Visibility toggled successfully:", response.data);
        setVisibility(response.data.visibility); // Assuming `newVisibility` is returned in the response
      } else {
        console.error("Failed to toggle visibility:", response.data.message);
        setVisibility((prev) => !prev);
      }
      setPendingRequest(false); 
    }
    } catch (error) {
      console.error("Error toggling visibility:", error);
      setVisibility((prev) => !prev);
      setPendingRequest(false); 
    }
  };
  
  // Function to handle star toggle with backend request
  const handleStarClick = () => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (!username || !token) {
      console.error("Username or token not found in localStorage");
      return;
    }

    // Optimistic UI update
    const newStarredState = !isStarred;
    setIsStarred(newStarredState);

    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const repoName = pathParts.slice(-2).join("/"); // Join the last two parts of the path
    const encodedRepoName = encodeURIComponent(repoName);

    const url = `https://gitspace.duckdns.org:3002/starProfile/${username}/${encodedRepoName}?token=${encodeURIComponent(
      token
    )}&type=star`;

    // Track the latest click action
    lastActionRef.current = newStarredState;

    // Send the request only if no other request is pending
    if (!pendingRequest) {
      setPendingRequest(true);
      axios
        .get(url)
        .then((response) => {
          console.log("Repository starred/unstarred successfully:", response.data);

          // No need to retry anymore, as we're not calling handleStarClick recursively anymore
        })
        .catch((error) => {
          console.error("Error starring/un-starring repository:", error);

          // Revert state in case of an error (if necessary)
          setIsStarred((prev) => !prev);
        })
        .finally(() => {
          setPendingRequest(false); // Reset the pending request flag
        });
    }
  };

  // Use `useEffect` to check if the repository is starred when the page loads
  useEffect(() => {
    checkIfStarred();
  }, []);
  const handleDeleteClick = async () => {
    const confirmation = window.confirm("Are you sure you want to delete this repository?");
    if (!confirmation) return; // If the user cancels, do nothing
  
    // Ask for repository name to confirm the action
    const inputRepoName = prompt("Please type the repository name to confirm deletion:");
    if (inputRepoName.toLowerCase() !== repoName.split("/")[1].toLowerCase()) {
      alert("The repository name you entered is incorrect. Deletion aborted.");
      return;
    }
  
    const userId = localStorage.getItem("userId");
  
    if (!repoId || !userId) {
      console.error("Repository ID or user ID not found.");
      return;
    }
  
    // Send delete request to the backend
    try {
      const url = `https://gitspace.duckdns.org:3002/repo/delete/${repoId}?userId=${userId}`;
      const response = await axios.delete(url);
      console.log("Repository deleted successfully:", response.data);
      alert("Repository deleted successfully!");
      navigate("/"); // Redirect to home page after deletion
    } catch (error) {
      console.error("Error deleting repository:", error);
      alert("Failed to delete the repository. Please try again.");
    }
  };
  

  return (
    <nav className="navbar">
      <div className="nav-right">
        <ul>
        <li className="the-user-link " onClick={() =>navigate(`/${repoName.split("/")[0]}`)}>{repoName.split("/")[0]}</li>
        <li  style={{color: "#b7bdc8"}}>/</li>
        <li className="the-user-link " onClick={() =>navigate(`/${window.location.reload()}`)}><b>{repoName.split("/")[1]}</b></li>
          <li><div
          className="repo-visibility"
          onClick={isOwner ? handleVisibilityClick : null}
          >&nbsp;{visibility? "Public": "Private"}</div></li>
          <li>
            <div
              className={`the-star-repo ${isStarred ? "starred" : ""}`}
              onClick={handleStarClick}
            >
              <i
                className={`fa-${isStarred ? "solid" : "regular"} fa-star the-star ${
                  isStarred ? "the-starred" : ""
                }`}
              ></i>
              &nbsp;{isStarred ? "Starred" : "Star"}
            </div>
          </li>
          { isOwner &&
          <li><div className='the-delete-btn' onClick={handleDeleteClick}>
            Delete
            </div>
            </li>}
        </ul>
      </div>
    </nav>
  );
};

export default RepoNavbar;
