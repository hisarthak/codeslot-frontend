import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../Navbar";
import { useSearch } from '../../searchContext'; 
import "./Search.css";


const apiUrl = import.meta.env.VITE_API_URL;
const Search = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Used for programmatic navigation
    const { searchQuery, repositories, users, isSearchLoading } = useSearch();  
    const [activeFilter, setActiveFilter] = useState('repositories');
     const [starredRepos, setStarredRepos] = useState([]); // Array of starred repositories
      const [pendingRequest, setPendingRequest] = useState(false); // Track ongoing backend requests
      const lastActionRef = useRef(null); // Keep track of the latest click action
      const [followedUsers, setFollowedUsers] = useState([]); // Array of followed users
const [pendingFollowRequest, setPendingFollowRequest] = useState(false); // Track ongoing backend requests
 const [windowWidth, setWindowWidth] = useState(window.innerWidth);

 useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getMessageLength = () => {

    if (windowWidth < 450) return 25;
    return 200;
  };
      const handleStarClick = async (repoName) => {
        const username = localStorage.getItem("username");
        const token = localStorage.getItem("token");

        if (!username || !token) {
            console.error("Username or token not found in localStorage");
            return;
        }

        const isCurrentlyStarred = starredRepos.includes(repoName);
        const encodedRepoName = encodeURIComponent(repoName);
            // Update the starredRepos array
            setStarredRepos((prevRepos) =>
                isCurrentlyStarred
                    ? prevRepos.filter((repo) => repo !== repoName) // Remove from array
                    : [...prevRepos, repoName] // Add to array
            );

        const url = `https://gitspace.duckdns.org:3002/starProfile/${username}/${encodedRepoName}?token=${encodeURIComponent(
          token
        )}&type=star;`

        if (!pendingRequest) {
            setPendingRequest(true);

            try {
                await axios.get(url).then((response) => {
                    console.log("Repository starred/unstarred successfully:", response.data);
          
                    
                  });
                

                console.log(`Repository ${isCurrentlyStarred ? 'unstarred' : 'starred'}:`, repoName);
            } catch (error) {
                setStarredRepos((prevRepos) =>
                    !isCurrentlyStarred
                        ? prevRepos.filter((repo) => repo !== repoName) // Remove from array
                        : [...prevRepos, repoName] // Add to array
                );
                console.error("Error starring/un-starring repository:", error);
            } finally {
                setPendingRequest(false);
            }
        }
    };

      // Load starred repositories on component load
      useEffect(() => {
        const username = localStorage.getItem("username");
        if (!username || repositories.length === 0) return;
        console.log(repositories);

        // Extract starred repositories
        const starred = repositories
            .filter((repo) => repo.starredBy && repo.starredBy.includes(username))
            .map((repo) => repo.name);

        setStarredRepos(starred);
    }, [repositories]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId || users.length === 0) return;
    
        // Extract followed users
        const followed = users
            .filter((user) => user.followers && user.followers.includes(userId))
            .map((user) => user.username);
    
        setFollowedUsers(followed);
    }, [users]);
    

    const handleFollowClick = async (followUsername) => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
    
        if (!userId || !followUsername || !token) {
            console.error("Missing userId, followUsername, or token");
            return;
        }
    
        const isCurrentlyFollowing = followedUsers.includes(followUsername);
    
        // Optimistically update the followedUsers array
        setFollowedUsers((prevUsers) =>
            isCurrentlyFollowing
                ? prevUsers.filter((user) => user !== followUsername) // Unfollow (remove from array)
                : [...prevUsers, followUsername] // Follow (add to array)
        );
    
        const url = `https://${apiUrl}/followProfile/${userId}?followUsername=${followUsername}` 
    
        if (!pendingFollowRequest) {
            setPendingFollowRequest(true);
            try {
                await axios.get(url);
                console.log(`User ${isCurrentlyFollowing ? "unfollowed" : "followed"}:`, followUsername);
            } catch (error) {
                // Revert state on error
                setFollowedUsers((prevUsers) =>
                    !isCurrentlyFollowing
                        ? prevUsers.filter((user) => user !== followUsername) // Remove on failure
                        : [...prevUsers, followUsername] // Add back on failure
                );
                console.error("Error following/unfollowing user:", error);
            } finally {
                setPendingFollowRequest(false);
            }
        }
    };
  
   
    return (
      
            <>
                <div>
                    <Navbar />
                    <section id="dashboard">
                    <aside>
                            <div className="the-search-filter-repo">
                                <div><h4>Filter by</h4></div>
                                
                              <div className='the-repo-filter' onClick={() => setActiveFilter('repositories')} style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "0.7rem"}}>
                                <div className={`${activeFilter === 'repositories' ? 'filter-blue-line ' : 'filter-invisible-line'}`}></div>
                                <div className={`filter-options  ${activeFilter === 'repositories' ? 'filter-active' : ''}`}>&nbsp;&nbsp;<p><i class="fa-solid fa-book" style={{color: "#b7bdc8"}}></i>&nbsp;&nbsp;Repositories&nbsp;&nbsp; </p><p className='filter-options-length'>{repositories.length}</p>
                                </div>
                                </div>
                              
                               <div className="the-repo-filter"    onClick={() => setActiveFilter('users')} style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "0.7rem"}}>
                                <div  className={`${activeFilter === 'users' ? 'filter-blue-line ' : 'filter-invisible-line'}`}></div>
                                <div className={`filter-options  ${activeFilter === 'users' ? 'filter-active' : ''}`}>&nbsp;&nbsp;<p><i class="fa-solid fa-user"></i>&nbsp;&nbsp;Users&nbsp;&nbsp; </p><p className='filter-options-length'>{users.length}</p>
                                 </div>
                                 </div>
                              
                              
                            </div>
                        </aside>
                        <main className="center-div">
                            
            
        
                       
                           <div style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", width: "50vw", marginBottom: "0"}}>
                             <h4 style={{fontWeight: 500}}>Search Results for:&nbsp;&nbsp;<b>{searchQuery}</b></h4>
                             </div>
                                  {/* Show loading message while fetching */}
                            {isSearchLoading && <p className='center-the-div'>Loading...</p>}
        
                            {/* Render repositories */}
                            {activeFilter === 'repositories' && repositories.length > 0 && (
                                <div>
                                    <h4 className='heading4'>Repositories:</h4>
                                    <div
                                    className='media-search-filter d-none'
        >
        <div className='the-repo-filter d-none' onClick={() => setActiveFilter('repositories')} style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "0.7rem", width: "100%"}}>
            
                                <div className={`filter-options d-none ${activeFilter === 'repositories' ? 'filter-active' : ''}`} style={{ display: "flex", justifyContent: "flex-start", fontSize: "14px"}}>&nbsp;&nbsp;<p className='dNonei-600'><i class="fa-solid fa-book dNone dVis-600" style={{color: "#b7bdc8"}}></i><span className='dNone-600'>&nbsp;&nbsp;Repositories&nbsp;&nbsp;</span></p><p className='filter-options-length'>{repositories.length}</p>
                                </div>
                                </div>
                                <div className="the-repo-filter d-none"    onClick={() => setActiveFilter('users')} style={{display: "flex", flexDirection: "row", alignItems: "flex-end", marginBottom: "0.7rem", width: "100%", justifyContent: "flex-end"}}>
                
                                <div className={`filter-options  d-none ${activeFilter === 'users' ? 'filter-active' : ''}`} style={{ display: "flex", justifyContent: "flex-start", fontSize: "14px"}}>&nbsp;&nbsp;<p className='dNonei-600'><i class="fa-solid fa-user dNone dVis-600"></i><span className='dNone-600'>&nbsp;&nbsp;Users&nbsp;&nbsp;</span></p><p className='filter-options-length'>{users.length}</p>
                                 </div>
                                 </div>
                                 </div>
                                 <div className="repositories-list">
                                    {repositories.map((repo) => (
                                        <div key={repo._id} className='the-srch-box'>
                                            <div className="repo-name-link">
                                           <p style={{ color: "#74b9ff", display: "flex", fontWeight: "500"}}>
                                            <span className="the-user dNone-600-user">
                                                {repo.owner.username.charAt(0).toUpperCase()}
                                            </span>
                                            <span className='repo-main-info'>
                                                <span className='repo-name-underline'  onClick={() =>{   window.scrollTo({
                        top: 0,
                        behavior: 'instant' // Ensure instant scrolling
                      }); navigate(`/${repo.name}`);}}>
                                                    {repo.name}
                                                </span>
                                            <p className="repo-desc" >
                                                {repo.description && repo.description.length >  getMessageLength()
                        ? repo.description.substring(0,  getMessageLength()) + "..."
                        : repo.description}
                        </p>
                        </span>
                        </p>

                        <div className={`the-star-repo search-star ${starredRepos.includes(repo.name) ? "starred" : ""}`}
                        onClick={() => handleStarClick(repo.name)}>
                         <i className={`fa-${starredRepos.includes(repo.name) ? "solid" : "regular"} fa-star the-star ${
                         starredRepos.includes(repo.name) ? "the-search-starred" : ""}`}></i>
                            <span className='dNone'>&nbsp;{starredRepos.includes(repo.name) ? "Starred" : "Star"}</span>
                                            </div>
</div>  
                   
         </div>
                                    ))}
                                </div>
                                </div>
                            )}

{activeFilter === 'users' && users.length > 0 && (
    
    <div>
        <h4 className='heading4'>Users:</h4>
        <div
          className="media-search-filter d-none"
        >
         <div className='the-repo-filter d-none' onClick={() => setActiveFilter('repositories')} style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "0.7rem", width: "100%"}}>
            
            <div className={`filter-options d-none ${activeFilter === 'repositories' ? 'filter-active' : ''}`} style={{ display: "flex", justifyContent: "flex-start", fontSize: "14px"}}>&nbsp;&nbsp;<p className='dNonei-600'><i class="fa-solid fa-book dNone dVis-600" style={{color: "#b7bdc8"}}></i><span className='dNone-600'>&nbsp;&nbsp;Repositories&nbsp;&nbsp;</span></p><p className='filter-options-length'>{repositories.length}</p>
            </div>
            </div>
            <div className="the-repo-filter d-none"    onClick={() => setActiveFilter('users')} style={{display: "flex", flexDirection: "row", alignItems: "flex-end", marginBottom: "0.7rem", width: "100%", justifyContent: "flex-end"}}>

            <div className={`filter-options  d-none ${activeFilter === 'users' ? 'filter-active' : ''}`} style={{ display: "flex", justifyContent: "flex-start", fontSize: "14px"}}>&nbsp;&nbsp;<p className='dNonei-600'><i class="fa-solid fa-user dNone dVis-600"></i><span className='dNone-600'>&nbsp;&nbsp;Users&nbsp;&nbsp;</span></p><p className='filter-options-length'>{users.length}</p>
             </div>
             </div>
             </div>
        {users.map((user) => (
            <div key={user._id} className="the-srch-box">
                  <div className="repo-name-link">
                                           <p style={{ color: "#74b9ff", display: "flex", fontWeight: "500"}}>
                                            <span className="the-user dNone-600-user">{user.username.charAt(0).toUpperCase()}</span><span  className='repo-main-info'><span className='repo-name-underline'  onClick={() => {   window.scrollTo({
                        top: 0,
                        behavior: 'instant' // Ensure instant scrolling
                      });navigate(`/${user.username}`);}}>{user.username}</span>
             
                </span>
                </p>
                </div>
                <div
    className={`the-search-star-user search-star ${followedUsers.includes(user.username) ? "followed" : ""}`}
    onClick={() => handleFollowClick(user.username)}
><span className='d-none-user'>{followedUsers.includes(user.username) ?<i class="fa-solid fa-user-minus"></i>:<i class="fa-solid fa-user-plus"></i>}</span><span className='dNone'>{followedUsers.includes(user.username) ? "Unfollow" : "Follow"}</span>
</div>
            </div>
        ))}
    </div>
)}
        
                              {/* If no results found after fetching */}
                        {activeFilter === 'repositories' && repositories.length === 0 && !isSearchLoading && (
                            <>
                               <div
                              className="media-search-filter d-none"
                            >
                             <div className='the-repo-filter d-none' onClick={() => setActiveFilter('repositories')} style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "0.7rem", width: "100%"}}>
                                
                                <div className={`filter-options d-none ${activeFilter === 'repositories' ? 'filter-active' : ''}`} style={{ display: "flex", justifyContent: "flex-start", fontSize: "14px"}}>&nbsp;&nbsp;<p className='dNonei-600'><i class="fa-solid fa-book dNone dVis-600" style={{color: "#b7bdc8"}}></i><span className='dNone-600'>&nbsp;&nbsp;Repositories&nbsp;&nbsp;</span></p><p className='filter-options-length'>{repositories.length}</p>
                                </div>
                                </div>
                                <div className="the-repo-filter d-none"    onClick={() => setActiveFilter('users')} style={{display: "flex", flexDirection: "row", alignItems: "flex-end", marginBottom: "0.7rem", width: "100%", justifyContent: "flex-end"}}>
                    
                                <div className={`filter-options  d-none ${activeFilter === 'users' ? 'filter-active' : ''}`} style={{ display: "flex", justifyContent: "flex-start", fontSize: "14px"}}>&nbsp;&nbsp;<p className='dNonei-600'><i class="fa-solid fa-user dNone dVis-600"></i><span className='dNone-600'>&nbsp;&nbsp;Users&nbsp;&nbsp;</span></p><p className='filter-options-length'>{users.length}</p>
                                 </div>
                               </div>
                           
                            </div>
                            <div className="the-srch-box no-users-repo" style={{border: "none !important"}}>
                  <div className="repo-name-link" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                           <div style={{ display: "flex", fontWeight: "400", justifyContent: "center", alignContent: "center"}}>
                                          <span >No repositories found</span>
                </div>
                
</div>
            </div>
                            </>
                        )}
                        {activeFilter === 'users' && users.length === 0 && !isSearchLoading && (
                             <>
                             <div
                            className="media-search-filter d-none"
                          >
                           <div className='the-repo-filter d-none' onClick={() => setActiveFilter('repositories')} style={{display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "0.7rem", width: "100%"}}>
                              
                              <div className={`filter-options d-none ${activeFilter === 'repositories' ? 'filter-active' : ''}`} style={{ display: "flex", justifyContent: "flex-start", fontSize: "14px"}}>&nbsp;&nbsp;<p className='dNonei-600'><i class="fa-solid fa-book dNone dVis-600" style={{color: "#b7bdc8"}}></i><span className='dNone-600'>&nbsp;&nbsp;Repositories&nbsp;&nbsp;</span></p><p className='filter-options-length'>{repositories.length}</p>
                              </div>
                              </div>
                              <div className="the-repo-filter d-none"    onClick={() => setActiveFilter('users')} style={{display: "flex", flexDirection: "row", alignItems: "flex-end", marginBottom: "0.7rem", width: "100%", justifyContent: "flex-end"}}>
                  
                              <div className={`filter-options  d-none ${activeFilter === 'users' ? 'filter-active' : ''}`} style={{ display: "flex", justifyContent: "flex-start", fontSize: "14px"}}>&nbsp;&nbsp;<p className='dNonei-600'><i class="fa-solid fa-user dNone dVis-600"></i><span className='dNone-600'>&nbsp;&nbsp;Users&nbsp;&nbsp;</span></p><p className='filter-options-length'>{users.length}</p>
                               </div>
                             </div>
                         
                          </div>
                          <div className="the-srch-box no-users-repo" style={{border: "none !important"}}>
                  <div className="repo-name-link" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                           <div style={{ display: "flex", fontWeight: "400", justifyContent: "center", alignContent: "center"}}>
                                          <span>No users found</span>
                </div>
                
</div>
            </div>
                          
                         
                          </>
                        )}
                        </main>
        
                        {/* Sidebar content */}
                        <aside>
                         <div className='right-box'>
                                    <div className='event-box'>
                                  <h3>Upcoming Events</h3>
                                  <ul className="event-box-list">
                                     <li className="event-list-item"> <Link to="/blog?id=XTR-92A4-MK7" className='event-list-item'>
                                    <p>Tech Conference - Dec 20</p>
                                    </Link></li>
                                    <li  className="event-list-item" >
                                      <Link to="/blog?id=JQ-57ZP-TX84" className='event-list-item'><p>Developer Meetup - Dec 25</p>
                                      </Link>
                                      </li>
                                    <li  className="event-list-item">
                                      <Link to="/blog?id=BLAZ-21XK-9TY" className='event-list-item'>
                                      <p>React Summit - Jan 10</p>
                                      </Link>
                                      </li>
                                    
                                  </ul>
                                  </div>
        
                                <div className="event-box">
                                    <h3  style={{color: "#f0b72f", marginLeft: "-0.1rem"}}><i class="fa-solid fa-lightbulb" style={{color: "#f0b72f"}}></i>&nbsp;&nbsp;ProTip!</h3>
                                   <p>Press the &nbsp;" / "&nbsp; key to activate the search input again and adjust your query</p> 
                                </div>
                            </div>
                        </aside>
                    </section>
                </div>
            </>
        );
    
};

export default Search;
