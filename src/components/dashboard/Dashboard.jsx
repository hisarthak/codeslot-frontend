import React, { useState, useEffect } from 'react';
import "./dashboard.css";
import Navbar from "../Navbar";
import {Link} from 'react-router-dom';
import axios from 'axios';




const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [repoName, setRepoName] = useState("");
  const [isPublic, setIsPublic] = useState(true);  // Default is public
  const [createError, setCreateError] = useState("");
  const [owner, setOwner] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(`https://gitspace.duckdns.org:3002/repo/user/${userId}`);
        const data = await response.json();
        setRepositories(data.repositories);
        setSearchResults(data.repositories);  // Display repositories initially
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`https://gitspace.duckdns.org:3002/repo/all`);
        const data = await response.json();
    
        // Shuffle the data to ensure randomness
        const shuffled = data.sort(() => 0.5 - Math.random());
    
        // Take the first 4 items
        const randomRepositories = shuffled.slice(0, 6);
    
        // Update the state with the selected repositories
        setSuggestedRepositories(randomRepositories);
      } catch (err) {
        console.error("Error while fetching suggested repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  
  useEffect(() => {
    const fetchUserDetails = async () => {
        const userId = localStorage.getItem("userId");

        if (userId) {
            try {
                const response = await axios.get(
                    `https://gitspace.duckdns.org:3002/userProfile/${userId}`
                );
                // Set the owner to the fetched username
                setOwner(response.data.username);
            } catch (err) {
                console.error("Cannot fetch user details: ", err);
            }
        }
    };

    fetchUserDetails();
}, []); // Empty dependency array to run once on mount


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

  // Function to handle repository creation
  const handleCreateRepository = async () => {
    const userId = localStorage.getItem("userId");
    
    // Input validation
    if (!repoName) {
      setCreateError("Repository name is required.");
      return;
    }

    const newRepo = {
      name: repoName,
      visibility: isPublic ? 'public' : 'private',
      userId: userId,
    };

    try {
      const response = await fetch('https://gitspace.duckdns.org:3002/repo/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRepo),
      });

      if (response.ok) {
        const data = await response.json();
        setRepositories((prev) => [...prev, data.repository]);  // Add new repo to the list
        setRepoName("");  // Clear the input field after creation
        setCreateError("");  // Clear any previous errors
      } else {
        throw new Error('Failed to create repository');
      }
    } catch (err) {
      console.error('Error while creating repository:', err);
      setCreateError("Failed to create repository.");
    }
  };

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
            <div key={repo._id} class="your-repo">
              <p class="your-repo-name">{owner ? owner : "Loading..."}/{repo.name}</p>
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

    <h3>5. Push Changes to Slotcode</h3>
    <p className="dash-para">To send your local changes to a remote repository on <b>Slotcode</b>:</p>
    <pre className="pre-box"><code>slot push</code></pre>

    <h3>6. Pull Changes from Slotcode</h3>
    <p className="dash-para">If you're collaborating and want to fetch the latest updates from <b>Slotcode</b> to your local repository:</p>
    <pre className="pre-box"><code>slot pull</code></pre>

    <h3>7. Clone a Repository</h3>
    <p className="dash-para">To download an existing repository from <b>Slotcode</b>:</p>
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
          <ul>
             <li> <Link to="/blog">
            <p>Tech Conference - Dec 20</p>
            </Link></li>
            <li><p><a>Developer Meetup - Dec 25</a></p></li>
            <li><p><a>React Summit - Jan 10</a></p></li>
            
          </ul>
          </div>
          <div className='event-box'>
          <h3>Suggested Repositories</h3>
          {suggestedRepositories.map((repo) => (
            <div key={repo._id}>
              <h4>{repo.name}</h4>
            </div>
            
          ))}
          </div>
          </div>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
