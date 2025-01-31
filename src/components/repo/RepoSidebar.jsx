import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RepoSidebar.css";

const RepoSidebar = () => {
  const [description, setDescription] = useState("Loading...");
  const [canEdit, setCanEdit] = useState(false); // State to control visibility of the edit icon

  // Extract and decode repoName and username from the URL
  const getRepoDetails = () => {
    const pathParts = window.location.pathname.split("/");
    const username = pathParts[pathParts.length - 2]; // Get the second last part
    const repoName = pathParts.slice(-2).join("/"); // Get last two parts
    return { username: decodeURIComponent(username), repoName: decodeURIComponent(repoName) };
  };

  // Fetch the description from the backend and check username on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { username, repoName } = getRepoDetails();
        const localUsername = localStorage.getItem("username"); // Get username from local storage

        // Check if the username matches the one in localStorage
        if (localUsername && localUsername === username) {
          setCanEdit(true); // Allow editing if usernames match
        }

        const encodedRepoName = encodeURIComponent(repoName);

        // Make the GET request to fetch the description
        const response = await axios.put(
          `https://gitspace.duckdns.org:3002/repo/update/${encodedRepoName}`
        );

        setDescription(response.data.description || "No description provided");
      } catch (error) {
        console.error("Error fetching description:", error);
        setDescription("No description provided");
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once on mount

  const updateDescription = async () => {
    const newDescription = window.prompt(
      "Edit description (max 130 characters):",
      description
    );

    if (newDescription !== null) {
      if (newDescription.length <= 130) {
        try {
          const userId = localStorage.getItem("userId"); // Get userId from local storage
          if (!userId) {
            alert("User ID not found in local storage.");
            return;
          }

          const { repoName } = getRepoDetails();
          const encodedRepoName = encodeURIComponent(repoName);

          // Make the PUT request using axios
          const response = await axios.put(
            `https://gitspace.duckdns.org:3002/repo/update/${encodedRepoName}`, // Endpoint
            { description: newDescription }, // Body
            {
              params: { userId }, // Query parameters
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (newDescription.trim().length === 0) {
            setDescription("No description provided");
            alert("Description updated successfully!");
            return;
          }

          setDescription(newDescription); // Update the description locally
          alert("Description updated successfully!");
        } catch (error) {
          console.error("Error updating description:", error);
          alert(
            error.response?.data?.error ||
              "An error occurred while updating the description."
          );
        }
      } else {
        alert("Description cannot exceed 130 characters (including spaces).");
      }
    }
  };

  return (
    <div className="repo-side">
      <div className="repo-side-about">
        <h3 style={{margin: "0"}}>About</h3>&nbsp;&nbsp;
        {canEdit && ( // Conditionally render the edit icon
          <p
            title="Edit description"
            className="repo-side-pencil"
            onClick={updateDescription}
          >
            <i className="fa-solid fa-pencil"></i>&nbsp;
          </p>
        )}
      </div>
      <p className="about-para" style={{ padding: "5px" }}>
        {description}
      </p>
    </div>
  );
};

export default RepoSidebar;
