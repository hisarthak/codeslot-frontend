import React, { useEffect, useState, useRef} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon, StarIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const apiUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [repositories, setRepositories] = useState([]);
  const [starredRepos, setStarredRepos] = useState([]); // State for starred repositories
  const [activeSection, setActiveSection] = useState("overview"); // Tracks the active section
  const { setCurrentUser } = useAuth();
  const [loadingRepositories, setLoadingRepositories] = useState(false);
  const [loadingStarredRepos, setLoadingStarredRepos] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(true);
  const [followersCount, setFollowersCount] = useState();
const [followingCount, setFollowingCount] = useState();
const [isOwner, setIsOwner] = useState(false);
const [showFollowersModal, setShowFollowersModal] = useState(false);
const [showFollowingModal, setShowFollowingModal] = useState(false);
const [followersList, setFollowersList] = useState([]);
const [followingList, setFollowingList] = useState([]);
 const [isBoxVisible, setIsBoxVisible] = useState(false);
  const searchBoxRef = useRef(null); 
 const [pendingRequest, setPendingRequest] = useState(false); // Track ongoing backend requests
 const [theStarredRepos, setTheStarredRepos] = useState([]); 

 const handleStarClick = async (repoName) => {
  if (pendingRequest) return; // Prevent multiple clicks

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  if (!username || !token) {
      console.error("Username or token not found in localStorage");
      return;
  }

  const isCurrentlyStarred = theStarredRepos.includes(repoName);
  setPendingRequest(true);

  // Optimistic UI update
  setTheStarredRepos((prevRepos) =>
      isCurrentlyStarred
          ? prevRepos.filter((repo) => repo !== repoName) // Remove name
          : [...prevRepos, repoName] // Add name
  );

  if(isOwner){
  setStarredRepos((prevRepos) =>
      isCurrentlyStarred
          ? prevRepos.filter((repo) => repo.name !== repoName) // Remove object
          : [...prevRepos, { name: repoName }] // Add placeholder
  );}

  try {
      const url = `https://gitspace.duckdns.org:3002/starProfile/${username}/${encodeURIComponent(repoName)}?token=${encodeURIComponent(token)}&type=star`;

      const response = await axios.get(url);
      console.log(`Repository ${isCurrentlyStarred ? 'unstarred' : 'starred'}:`, response.data);
if(isOwner){
      if (!isCurrentlyStarred) {
          setStarredRepos((prevRepos) => [...prevRepos, response.data]); // Replace placeholder with real data
      }}
  } catch (error) {
      console.error("Error starring/un-starring repository:", error);

      // Rollback UI if API fails
      setTheStarredRepos((prevRepos) =>
          isCurrentlyStarred
              ? [...prevRepos, repoName] // Re-add name
              : prevRepos.filter((repo) => repo !== repoName) // Remove name
      );

      setStarredRepos((prevRepos) =>
          isCurrentlyStarred
              ? [...prevRepos, { name: repoName }] // Re-add object
              : prevRepos.filter((repo) => repo.name !== repoName) // Remove object
      );
  } finally {
      setPendingRequest(false);
  }
};

  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isBoxVisible && event.key === "/") {
        event.stopPropagation();
        event.stopImmediatePropagation(); 
      }
    };
  
    if (isBoxVisible) {
      document.addEventListener("keydown", handleKeyPress, true); // Capture phase
    } else {
      document.body.style.overflow = ""; // Reset scrolling
    }
  
    return () => {
      document.body.style.overflow = ""; // Reset scrolling on unmount
      document.removeEventListener("keydown", handleKeyPress, true);
    };
  }, [isBoxVisible]);
  
 
     // Detect clicks outside the nav-search-box
     useEffect(() => {
       const handleClickOutside = (event) => {
           if (
               searchBoxRef.current &&
               !searchBoxRef.current.contains(event.target)
           ) {
            setShowFollowersModal(false);
            setShowFollowingModal(false);
               setIsBoxVisible(false); // Hide the box if clicked outside
           }
       };
 
       document.addEventListener("mousedown", handleClickOutside);
 
       return () => {
           document.removeEventListener("mousedown", handleClickOutside);
       };
   }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const username = window.location.pathname.replace(/\/$/, '').split('/').pop();
      const token = localStorage.getItem("token");

      if (userId) {
        let response;
      
          
         try{
           response = await axios.get(
            `https://${apiUrl}/userProfile/${username}?type=normal&userId=${userId}`
          )} catch(err){
            console.error("Cannot fetch user details: ", err);
            navigate(`/not-found`)
            return;
          }
          if (response.data.followers.some(follower => follower.username === localStorage.getItem("username"))) {
            setIsFollowing(true);
          } else {
            setIsFollowing(false);
          }
          setFollowingCount(response.data.followedUsers.length);
          setFollowersCount(response.data.followers.length);
          setIsLoading(false);
      if(response.data._id.toString()=== userId){
        setIsOwner(true);
      }
          setUserDetails(response.data);
      
      }
    };
    fetchUserDetails();
  }, []);

  const fetchRepositories = async () => {
    setRepositories([]);
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username"); // Get the logged-in username
   
  
// Get the current URL (href), remove hash part, and clean the pathname
const cleanPathname = window.location.href.replace(/#.*$/, '').replace(/\/$/, '');

// Now get the last part of the pathname
const pageUsername = cleanPathname.split('/').pop();
    // Get username from URL
    setLoadingRepositories(true);
    setActiveSection("repositories");

    if (userId) {
        try {
            const response = await fetch(`https://${apiUrl}/repo/user/${pageUsername}?userId=${userId}`);
            const data = await response.json();
            
            setRepositories(data.repositories); // Store all repositories

            // Extract repos where the logged-in user has starred
            const starredRepos = data.repositories
                .filter(repo => repo.starredBy.includes(username)) // Check if starredBy contains the username
                .map(repo => repo.name); // Get repo names
            
            setTheStarredRepos(starredRepos); // Update the state with starred repo names

            setLoadingRepositories(false);
        } catch (error) {
            console.error("Error fetching repositories: ", error);
            setLoadingRepositories(false);
        }
    }
};


  const fetchStarredRepos = async () => {
    setStarredRepos([]);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const username =  window.location.pathname.replace(/\/$/, '').split('/').pop();
    const loggedInUsername = localStorage.getItem("username");
    console.log(loggedInUsername);

    setLoadingStarredRepos(true);
    setActiveSection("stars");
    if (userId) {
      try {
        const response = await axios.get(
          `https://${apiUrl}/userProfile/${username}?type=star&userId=${userId}`
        );
       console.log(response.data);

       const filteredStarredRepos = response.data.filter(repo => {
        if (isOwner) {
            // Exclude only if BOTH conditions are met
            const isDifferentUser = repo.name.split('/')[0] !== loggedInUsername;
            const isHidden = repo.visibility === false;
    
            if (isDifferentUser && isHidden) {
                return false; // Exclude
            }
            return true; // Include everything else
        } else {
            // Non-owners only see repos with visibility === true
            return repo.visibility === true;
        }
    });
    
    setStarredRepos(filteredStarredRepos);
    
    
        if(isOwner){
          console.log("Owner");
        setTheStarredRepos((prevRepos) => [
          ...prevRepos,
          ...response.data.map((repo) => repo.name)
        ]);}else{
console.log("Not Owner");
          const filteredRepos = response.data
          .filter(repo => Array.isArray(repo.starredBy) && repo.starredBy.includes(loggedInUsername))
          .map(repo => repo.name); // Store only the repo name (or username)
      
        // Update the state with just the repository names
        setTheStarredRepos(filteredRepos);
      }
  
       
        setLoadingStarredRepos(false);
      
      } catch (err) {
        console.error("Error fetching starred repositories: ", err);
        setLoadingStarredRepos(false);
      }
    }
  };

  const followUser = async () => {
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const followUsername =  window.location.pathname.replace(/\/$/, '').split('/').pop();
    const apiUrl = import.meta.env.VITE_API_URL;
  
    if (!userId || !followUsername) {
      console.error("Missing userId or followUsername");
      return;
    }
  
    try {
      const response = await axios.get(`https://${apiUrl}/followProfile/${userId}`, {
        params: { followUsername },
      });
      
    if(isFollowing){
      setIsFollowing(false);
      setFollowersCount(followersCount-1);
    }else{
      setIsFollowing(true);
      setFollowersCount(followersCount+1);
      setUserDetails(prevDetails => ({
        ...prevDetails,
        followers: [...prevDetails.followers, { username }]
      }));
    }
      console.log("Follow/Unfollow action successful:", response.data);
    } catch (error) {
      console.error("Error in followUser request:", error);
      
    }
  };

  const fetchFollowersAndFollowing = async () => {
  
    try {
     
      setFollowersList(userDetails.followers);
      setFollowingList(userDetails.followedUsers);
   
    } catch (err) {
      console.error("Error fetching followers/following:", err);
    }
  };
  const handleFollowersClick = () => {
    fetchFollowersAndFollowing();
    setShowFollowingModal(false);
    setIsBoxVisible(true);
    setShowFollowersModal(true);
  };

  const handleFollowingClick = () => {
    fetchFollowersAndFollowing();
    setShowFollowersModal(false);
    setIsBoxVisible(true);
    setShowFollowingModal(true);
  };
  


  if(isLoading){
    return (
      <>
        <Navbar />
        <div className="center-the-div">Loading...</div>
      </>
    )
  }
  return (
    <>
      <Navbar />
      <UnderlineNav
        aria-label="Repository"
        sx={{
          borderBottom: "none", // Removes the bottom border of the whole nav
        }}
      >
        <UnderlineNav.Item
          aria-current={activeSection === "overview" ? "page" : undefined}
          icon={BookIcon}
          sx={{
            backgroundColor: "transparent",
            color: "white",
            "&:hover": {
              color: "white",
            },
          }}
          onClick={() => setActiveSection("overview")} // Show heatmap
        >
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item
          aria-current={activeSection === "repositories" ? "page" : undefined}
          icon={RepoIcon}
          sx={{
            backgroundColor: "transparent",
            color: "whitesmoke",
            "&:hover": {
              color: "white",
            },
          }}
          onClick={fetchRepositories} // Fetch and show repositories
        >
          Repositories
        </UnderlineNav.Item>

        <UnderlineNav.Item
          aria-current={activeSection === "stars" ? "page" : undefined}
          icon={StarIcon}
          sx={{
            backgroundColor: "transparent",
            color: "whitesmoke",
            "&:hover": {
              color: "white",
            },
          }}
          onClick={fetchStarredRepos} // Fetch and show starred repositories
        >
          Stars
        </UnderlineNav.Item>
      </UnderlineNav>


      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          <div className="profile-image">{userDetails.username.split("/").pop()[0].toUpperCase()}</div>

          <div className="profile-user-name">
          <h3>
  {userDetails.username.split("/").pop() || "Loading..."}
</h3>
          </div>
          {isOwner ? (
  <button className="follow-btn">Hello !</button>
) : (
  <button className="follow-btn" onClick={followUser} title={`Follow ${userDetails.username}`}>
    {isFollowing ? "Unfollow" : "Follow"}
  </button>
)}
{isBoxVisible &&    <div className="fullpage-box"></div>}
<div className="follow">
<div className="follower" onClick={handleFollowersClick}>
            <p><i class="fas fa-users font-followers"></i>&nbsp;{followersCount} <span className="text-follow-ing-ers">followers</span></p>
          </div>
          <div className="following" onClick={handleFollowingClick}>
            <p><span>&bull;&nbsp;&nbsp;</span>{followingCount} <span className="text-follow-ing-ers">following</span></p>
          </div>
          </div>
        </div>

        <div className="heat-map-section">

    
          {activeSection === "overview" && 
        <div className="the-heat-map">
        <p>Contributions</p>
          <div className="the-heat-map-box"><HeatMapProfile />
          </div>
          </div>}
          {activeSection === "repositories" && (
            <div className="repositories-list">
              <h3>Repositories</h3>
              { loadingRepositories ? (
                <p>Loading...</p>
              ) : 
              repositories.length > 0 ? (
                repositories.map((repo) => (
                  <div key={repo._id} className='the-srch-box'>
                    
                  <div className="repo-name-link">
                 <p style={{ color: "#74b9ff", display: "flex", fontWeight: "500"}}>
                  <div className="the-user  dNone-600">
                      {repo.owner.username.charAt(0).toUpperCase()}
                  </div>
                  <div  className='repo-main-info'>
                      <div className='repo-name-underline'  onClick={() =>{
                          window.scrollTo({
                            top: 0,
                            behavior: 'instant' // Ensure instant scrolling
                          });
                        navigate(`/${repo.name}`)}}>
                          {repo.name}
                      </div>
                  <p className="repo-desc" >{repo.description && repo.description.length > 50
? repo.description.substring(0, 100) + "..."
: repo.description}
</p>
</div>
</p>
                    <div className={`the-star-repo search-star ${theStarredRepos.includes(repo.name) ? "starred" : ""}`}
                        onClick={() => handleStarClick(repo.name)}>
                         <i className={`fa-${theStarredRepos.includes(repo.name) ? "solid" : "regular"} fa-star the-star ${
                         theStarredRepos.includes(repo.name) ? "the-starred" : ""}`}></i>
                              <span className='dNone'>&nbsp;{theStarredRepos.includes(repo.name) ? "Starred" : "Star"}</span>
                                            </div>
                  </div>
                  </div>
                ))
              ) : (
                <p>No repositories found.</p>
              )}
            </div>
          )}
          {activeSection === "stars" && (
            <div className="repositories-list">
              <h3>Starred Repositories</h3>
              { loadingStarredRepos ? (
                <p>Loading...</p>
              ) :
              starredRepos.length > 0 ? (
                starredRepos.map((repo) => (
                  <div key={repo._id} className='the-srch-box'>
                    
                  <div className="repo-name-link">
                 <p style={{ color: "#74b9ff", display: "flex", fontWeight: "500"}}>
                  <div className="the-user  dNone-600">
                      {repo.name.charAt(0).toUpperCase()}
                  </div>
                  <div  className='repo-main-info'>
                      <div className='repo-name-underline'  onClick={() =>{
                          window.scrollTo({
                            top: 0,
                            behavior: 'instant' // Ensure instant scrolling
                          });
                        navigate(`/${repo.name}`)}}>
                          {repo.name}
                      </div>
                  <p className="repo-desc" >{repo.description && repo.description.length > 50
? repo.description.substring(0, 100) + "..."
: repo.description}
</p>
</div>
</p>
                  <div className={`the-star-repo search-star ${theStarredRepos.includes(repo.name) ? "starred" : ""}`}
                        onClick={() => handleStarClick(repo.name)}>
                         <i className={`fa-${theStarredRepos.includes(repo.name) ? "solid" : "regular"} fa-star the-star ${
                         theStarredRepos.includes(repo.name) ? "the-starred" : ""}`}></i>
                              <span className='dNone'>&nbsp;{theStarredRepos.includes(repo.name) ? "Starred" : "Star"}</span>
                                            </div>
                  </div>
                  </div>
                ))
              ) : (
                <p>No starred repositories found.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {showFollowersModal && (
        <div className="modal" ref={searchBoxRef}>
          <div className="modal-content">
            <h3>Followers</h3>
            <ul>
              {followersList.length > 0 ? (
                followersList.map((follower) => (
                  <li key={follower.username}
                  onClick={() => {
                    setShowFollowersModal(false);
                    setShowFollowingModal(false);
                    setIsBoxVisible(false);
                      window.scrollTo({
                        top: 0,
                        behavior: 'instant' // Ensure instant scrolling
                      })
                    navigate(`/${follower.username}`);
                    window.location.reload(); // Reload the page after navigation
                  }}

                  >
                    <i class="fa-regular fa-user" style={{color: "#b7bdc8"}}></i>&nbsp;&nbsp;{follower.username}</li>
                ))
              ) : (
                <p>Wow, such empty</p>
              )}
            </ul>

          </div>
        </div>
      )}

      {/* Modal for Following */}
      {showFollowingModal && (
        <div className="modal" ref={searchBoxRef}>
          <div className="modal-content">
            <h3>Following</h3>
            <ul>
              {followingList.length > 0 ? (
                followingList.map((following) => (
                  <li key={following.username} onClick={() => {
                    setShowFollowersModal(false);
                    setShowFollowingModal(false);
                    setIsBoxVisible(false);
                    
                      window.scrollTo({
                        top: 0,
                        behavior: 'instant' // Ensure instant scrolling
                      });
                    navigate(`/${following.username}`);
                    window.location.reload(); // Reload the page after navigation
                  }}><i class="fa-regular fa-user"style={{color: "#b7bdc8"}}></i>&nbsp;&nbsp;{following.username}</li>
                ))
              ) : (
                <p>Wow, such empty</p>
              )}
            </ul>

          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
