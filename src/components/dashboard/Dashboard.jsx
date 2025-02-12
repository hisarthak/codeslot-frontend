import React, { useState, useEffect } from 'react';
import "./dashboard.css";
import Navbar from "../Navbar";
import {Link} from 'react-router-dom';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;
// const apiUrl = "127.0.0.1:3002";





const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [repoName, setRepoName] = useState("");
  const [isPublic, setIsPublic] = useState(true);  // Default is public
  const [createError, setCreateError] = useState("");
  const [owner, setOwner] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username")

    const fetchRepositories = async () => {
      try {
        const response = await fetch(`https://${apiUrl}/repo/user/${username}?userId=${userId}`);
        const data = await response.json();
        setRepositories(data.repositories);
        setSearchResults(data.repositories);  // Display repositories initially
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    
    fetchRepositories();
  }, []);


   



  useEffect(() => {
    if (searchQuery === '') {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  
  document.addEventListener('DOMContentLoaded', () => {
    const instructionsDiv = document.querySelector('.slot-instructions');
    instructionsDiv.scrollTop = 0; // Ensure it starts at the top
});

  return (
    <>
      <Navbar />
      <section id="dashboard">
        {/* Suggested Repositories */}
        <aside>
          <div className="search-repo">
        <h3>Your Repositories</h3>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search"
            />
          </div>
          {searchResults.map((repo) => (
            <div key={repo._id} className="your-repo">
               <Link to={`/${repo.name}`} className="your-repo-name">
      <span className='underline'>{repo.name}</span>
    </Link>
            </div>
          ))}
          </div>
        </aside>
<main>
    
         <div className="center-div">
         <div className="slot-instructions">
    <h2>How to Use Slot - The Version Control System</h2>
    <h3>1. Install Slot</h3>
    <p className="dash-para">To install Slot, run the following command in your terminal:</p>
    <pre className="pre-box"><code>npm i slot</code></pre>

    <h3>2. Initialize a Repository</h3>
    <p className="dash-para">To start tracking your project with Slot, initialize a new repository in your project directory:</p>
    <pre className="pre-box"><code>slot init</code></pre>
    <p className="dash-para">This creates a new Slot repository and begins tracking changes.</p>

    <h3>3. Add Files to the Repository</h3>
    <p className="dash-para">To track changes in files, you need to add them to the staging area:</p>
    <pre className="pre-box"><code>slot add &lt;file_name&gt;</code></pre>
    <p className="dash-para">Or to add all files:</p>
    <pre className="pre-box"><code>slot add .</code></pre>

    <h3>4. Commit Changes</h3>
    <p className="dash-para">Once you've staged the changes, commit them with a message describing what you've done:</p>
    <pre className="pre-box"><code>slot commit -m "Your commit message"</code></pre>

    <h3>5. Push Changes to CodeSlot</h3>
    <p className="dash-para">To send your local changes to a remote repository on <b>CodeSlot</b>:</p>
    <pre className="pre-box"><code>slot push</code></pre>

    <h3>6. Pull Changes from CodeSlot</h3>
    <p className="dash-para">If you're collaborating and want to fetch the latest updates from <b>CodeSlot</b> to your local repository:</p>
    <pre className="pre-box"><code>slot pull</code></pre>

    <h3>7. Clone a Repository</h3>
    <p className="dash-para">To download an existing repository from <b>CodeSlot</b>:</p>
    <pre className="pre-box"><code>slot clone &lt;repository_url&gt;</code></pre>
    <p className="dash-para">This copies the repository to your local machine.</p>

    <h3>8. View Commit Logs</h3>
    <p className="dash-para">To view the history of your commits:</p>
    <pre className="pre-box"><code>slot log</code></pre>

    <h3>9. Manage Remote Repositories</h3>
    <p className="dash-para">To view or configure remote repositories linked to your project:</p>
    <pre className="pre-box"><code>slot remote</code></pre>
</div>
</div>

        </main>

        {/* Upcoming Events */}
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
          <div className='event-box'>
          <h3>Suggested Repositories</h3>
          
               <div  className='the-suggested-repo'>
                                            <div className="repo-name-link">
                                           <p style={{ color: "#74b9ff", display: "flex", fontWeight: "500"}}>
                                            <span className="the-suggested-repo-user">C</span><span  className='repo-main-info'><span className='suggested-repo-name'>codeslot/codeslot</span>
                                            <p className="suggested-repo-desc" >This is a repo...</p>
                                           </span>
                        </p>
</div>                          
         </div>
           <div className='the-suggested-repo'>
           <div className="repo-name-link">
          <p style={{ color: "#74b9ff", display: "flex", fontWeight: "500"}}>
           <span className="the-suggested-repo-user">S</span><span  className='repo-main-info'><span  className='suggested-repo-name'>codeslot/hi</span>
           <p className="suggested-repo-desc" >This is a repo...</p>
                     
          </span>
</p>
</div>                          
</div>
  <div className='the-suggested-repo' style={{border: "none"}}>
  <div className="repo-name-link">
 <p style={{ color: "#74b9ff", display: "flex", fontWeight: "500"}}>
  <span className="the-suggested-repo-user">E</span><span className='repo-main-info'><span className='suggested-repo-name'>codeslot/badshah</span>
  <p className="suggested-repo-desc" >This is a repo...</p>
 </span>
</p>
</div>                          
</div>
          
          </div>
          </div>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
