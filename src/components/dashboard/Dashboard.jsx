import React, { useState, useEffect } from 'react';
import "./dashboard.css";
import Navbar from "../Navbar";
import {Link, useNavigate} from 'react-router-dom';
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
  const [isCopied, setIsCopied] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    

    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://${apiUrl}/repo/dashboard/${userId}`);
        const data = await response.json();
        console.log("the",data);
        setRepositories(data.repositories);
        setLoading(false);
        setSearchResults(data.repositories);  // Display repositories initially
      } catch (err) {
        setLoading(false);
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
          {loading ? (
        <p>Loading...</p>
      ) : (
        searchResults?.length > 0 &&
        searchResults.map((repo) => (
          <div key={repo._id} className="your-repo">
            <Link
              to={`/${repo.name}`}
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "instant", // Ensure instant scrolling
                });
              }}
              className="your-repo-name"
            >
              <span className="underline">{repo.name}</span>
            </Link>
          </div>
        ))
      )}
    </div>
        </aside>
<main>
    
         <div className="center-div">
         <div className="slot-instructions">
    <h2>How to Use Slot-VCS - The Version Control System</h2>
    <h3>1. Install Slot</h3>
    <p className="dash-para">To install Slot, run the following command in your terminal:</p>
    <pre className="pre-box"><code>npm i -g slot-vcs {isCopied==1 ? (
      <i
        className="fa-solid fa-check side-copy"
        style={{ color: "#2fad4e", cursor: "pointer" }}
      ></i>
    ) : (
      <i className="fa-regular fa-copy side-copy" onClick={() => {
        const textToCopy = `npm i -g slot-vcs`;
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setIsCopied(1);
            setTimeout(() => setIsCopied(0), 1000);
          })
          .catch((err) => console.error("Failed to copy text: ", err));
      }}
      tabIndex={0} // Makes it focusable for better event handling
      style={{ cursor: "pointer"}}></i>
    )}</code></pre>

    <h3>2. Initialize a Repository</h3>
    <p className="dash-para">To start tracking your project with Slot, initialize a new repository in your project directory:</p>
    <pre className="pre-box" ><code>slot init {isCopied==2 ? (
      <i
        className="fa-solid fa-check side-copy"
        style={{ color: "#2fad4e", cursor: "pointer" }}
      ></i>
    ) : (
      <i className="fa-regular fa-copy side-copy" onClick={() => {
        const textToCopy = `slot init`;
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setIsCopied(2);
            setTimeout(() => setIsCopied(0), 1000);
          })
          .catch((err) => console.error("Failed to copy text: ", err));
      }}
      tabIndex={0} // Makes it focusable for better event handling
      style={{ cursor: "pointer"}}></i>
    )}</code></pre>
    <p className="dash-para">This creates a new Slot repository and begins tracking changes.</p>

    <h3>3. Add Files to the Repository</h3>
    <p className="dash-para">To track changes in files, you need to add them to the staging area:</p>
    <pre className="pre-box"><code>slot add &lt;file_name&gt; {isCopied==3 ? (
      <i
        className="fa-solid fa-check side-copy"
        style={{ color: "#2fad4e", cursor: "pointer" }}
      ></i>
    ) : (
      <i className="fa-regular fa-copy side-copy" onClick={() => {
        const textToCopy = `slot add <file_name>`;
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setIsCopied(3);
            setTimeout(() => setIsCopied(0), 1000);
          })
          .catch((err) => console.error("Failed to copy text: ", err));
      }}
      tabIndex={0} // Makes it focusable for better event handling
      style={{ cursor: "pointer"}}></i>
    )}</code></pre>
    <p className="dash-para">Or to add all files:</p>
    <pre className="pre-box"><code>slot add . {isCopied==4 ? (
      <i
        className="fa-solid fa-check side-copy"
        style={{ color: "#2fad4e", cursor: "pointer" }}
      ></i>
    ) : (
      <i className="fa-regular fa-copy side-copy" onClick={() => {
        const textToCopy = `slot add .`;
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setIsCopied(4);
            setTimeout(() => setIsCopied(0), 1000);
          })
          .catch((err) => console.error("Failed to copy text: ", err));
      }}
      tabIndex={0} // Makes it focusable for better event handling
      style={{ cursor: "pointer"}}></i>
    )}</code></pre>

    <h3>4. Commit Changes</h3>
    <p className="dash-para">Once you've staged the changes, commit them with a message describing what you've done:</p>
    <pre className="pre-box"><code>slot commit -m "message" {isCopied==5 ? (
      <i
        className="fa-solid fa-check side-copy"
        style={{ color: "#2fad4e", cursor: "pointer" }}
      ></i>
    ) : (
      <i className="fa-regular fa-copy side-copy" onClick={() => {
        const textToCopy = `slot commit -m "message"`;
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setIsCopied(5);
            setTimeout(() => setIsCopied(0), 1000);
          })
          .catch((err) => console.error("Failed to copy text: ", err));
      }}
      tabIndex={0} // Makes it focusable for better event handling
      style={{ cursor: "pointer"}}></i>
    )}</code></pre>

<h3>5. Authenicate user</h3>
    <p className="dash-para">To authenticate the user:</p>
    <pre className="pre-box"><code>slot auth {isCopied==6 ? (
      <i
        className="fa-solid fa-check side-copy"
        style={{ color: "#2fad4e", cursor: "pointer" }}
      ></i>
    ) : (
      <i className="fa-regular fa-copy side-copy" onClick={() => {
        const textToCopy = `slot auth`;
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setIsCopied(6);
            setTimeout(() => setIsCopied(0), 1000);
          })
          .catch((err) => console.error("Failed to copy text: ", err));
      }}
      tabIndex={0} // Makes it focusable for better event handling
      style={{ cursor: "pointer"}}></i>
    )}</code></pre>

<h3>6. Manage Remote Repositories</h3>
    <p className="dash-para">To configure remote repository linked to your project:</p>
    <pre className="pre-box"><code>slot remote add &lt;url&gt; {isCopied==7 ? (
      <i
        className="fa-solid fa-check side-copy"
        style={{ color: "#2fad4e", cursor: "pointer" }}
      ></i>
    ) : (
      <i className="fa-regular fa-copy side-copy" onClick={() => {
        const textToCopy = `slot remote add <url>`;
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setIsCopied(7);
            setTimeout(() => setIsCopied(0), 1000);
          })
          .catch((err) => console.error("Failed to copy text: ", err));
      }}
      tabIndex={0} // Makes it focusable for better event handling
      style={{ cursor: "pointer"}}></i>
    )} </code></pre>


    <h3>7. Push Changes to CodeSlot</h3>
    <p className="dash-para">To send your local changes to a remote repository on <b>CodeSlot</b>:</p>
    <pre className="pre-box"><code>slot push {isCopied==8 ? (
      <i
        className="fa-solid fa-check side-copy"
        style={{ color: "#2fad4e", cursor: "pointer" }}
      ></i>
    ) : (
      <i className="fa-regular fa-copy side-copy" onClick={() => {
        const textToCopy = `slot push`;
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setIsCopied(8);
            setTimeout(() => setIsCopied(0), 1000);
          })
          .catch((err) => console.error("Failed to copy text: ", err));
      }}
      tabIndex={0} // Makes it focusable for better event handling
      style={{ cursor: "pointer"}}></i>
    )}</code></pre>

    <h3>8. Pull Changes from CodeSlot</h3>
    <p className="dash-para">If you're collaborating and want to fetch the latest updates from <b>CodeSlot</b> to your local repository:</p>
    <pre className="pre-box"><code>slot pull {isCopied== 9 ? (
      <i
        className="fa-solid fa-check side-copy"
        style={{ color: "#2fad4e", cursor: "pointer" }}
      ></i>
    ) : (
      <i className="fa-regular fa-copy side-copy" onClick={() => {
        const textToCopy = `slot pull`;
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setIsCopied(9);
            setTimeout(() => setIsCopied(0), 1000);
          })
          .catch((err) => console.error("Failed to copy text: ", err));
      }}
      tabIndex={0} // Makes it focusable for better event handling
      style={{ cursor: "pointer"}}></i>
    )}</code></pre>

    <h3>9. Clone a Repository</h3>
    <p className="dash-para">To download an existing repository from <b>CodeSlot</b>:</p>
    <pre className="pre-box"><code>slot clone &lt;repository_url&gt; {isCopied==10 ? (
      <i
        className="fa-solid fa-check side-copy"
        style={{ color: "#2fad4e", cursor: "pointer" }}
      ></i>
    ) : (
      <i className="fa-regular fa-copy side-copy" onClick={() => {
        const textToCopy = `slot clone`;
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setIsCopied(10);
            setTimeout(() => setIsCopied(0), 1000);
          })
          .catch((err) => console.error("Failed to copy text: ", err));
      }}
      tabIndex={0} // Makes it focusable for better event handling
      style={{ cursor: "pointer"}}></i>
    )}</code></pre>
    <p className="dash-para">This copies the repository to your local machine.</p>

    <h3>10. View Commit Logs</h3>
    <p className="dash-para">To view the history of your commits:</p>
    <pre className="pre-box"><code>slot log {isCopied==11 ? (
      <i
        className="fa-solid fa-check side-copy"
        style={{ color: "#2fad4e", cursor: "pointer" }}
      ></i>
    ) : (
      <i className="fa-regular fa-copy side-copy" onClick={() => {
        const textToCopy = `slot log`;
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setIsCopied(11);
            setTimeout(() => setIsCopied(0), 1000);
          })
          .catch((err) => console.error("Failed to copy text: ", err));
      }}
      tabIndex={0} // Makes it focusable for better event handling
      style={{ cursor: "pointer"}}></i>
    )}</code></pre>

<h3>11. Revert to a commit</h3>
    <p className="dash-para">To revert to a specifiic commit:</p>
    <pre className="pre-box"><code>slot revert &lt;commit_Id&gt; {isCopied==12 ? (
      <i
        className="fa-solid fa-check side-copy"
        style={{ color: "#2fad4e", cursor: "pointer" }}
      ></i>
    ) : (
      <i className="fa-regular fa-copy side-copy" onClick={() => {
        const textToCopy = `slot revert <commit_Id>`;
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setIsCopied(12);
            setTimeout(() => setIsCopied(0), 1000);
          })
          .catch((err) => console.error("Failed to copy text: ", err));
      }}
      tabIndex={0} // Makes it focusable for better event handling
      style={{ cursor: "pointer"}}></i>
    )}</code></pre>

<h3>12. View the list of available commands</h3>
    <p className="dash-para">To view the list of available commands:</p>
    <pre className="pre-box"><code>slot --help {isCopied==9 ? (
      <i
        className="fa-solid fa-check side-copy"
        style={{ color: "#2fad4e", cursor: "pointer" }}
      ></i>
    ) : (
      <i className="fa-regular fa-copy side-copy" onClick={() => {
        const textToCopy = `slot --help`;
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            setIsCopied(9);
            setTimeout(() => setIsCopied(0), 1000);
          })
          .catch((err) => console.error("Failed to copy text: ", err));
      }}
      tabIndex={0} // Makes it focusable for better event handling
      style={{ cursor: "pointer"}}></i>
    )}</code></pre>
    <br></br>
    ...and many more commnads
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
                                            <span className="the-suggested-repo-user">S</span><span  className='repo-main-info'><span className='suggested-repo-name'
                                            onClick={() =>{
                                              window.scrollTo({
                                                top: 0,
                                                behavior: 'instant' // Ensure instant scrolling
                                              });
                                            navigate(`/sarthak/TravelHaven`)}}
                                            >Sarthak/TravelHaven</span>
                                            <p className="suggested-repo-desc" >Discover and Book your perfect trip.</p>
                                           </span>
                        </p>
</div>                          
         </div>
           <div className='the-suggested-repo'>
           <div className="repo-name-link">
          <p style={{ color: "#74b9ff", display: "flex", fontWeight: "500"}}>
           <span className="the-suggested-repo-user">P</span><span  className='repo-main-info'><span  className='suggested-repo-name'
            onClick={() =>{
              window.scrollTo({
                top: 0,
                behavior: 'instant' // Ensure instant scrolling
              });
            navigate(`/pandey/Next-js-App`)}}
           >Pandey/Next-js-App</span>
           <p className="suggested-repo-desc" >Next.js app with custom domain support.</p>
                     
          </span>
</p>
</div>                          
</div>
  <div className='the-suggested-repo' style={{border: "none"}}>
  <div className="repo-name-link">
 <p style={{ color: "#74b9ff", display: "flex", fontWeight: "500"}}>
  <span className="the-suggested-repo-user">P</span><span className='repo-main-info'><span className='suggested-repo-name'
   onClick={() =>{
    window.scrollTo({
      top: 0,
      behavior: 'instant' // Ensure instant scrolling
    });
  navigate(`/programmer/Netflix-clone`)}}
  >Programmer/Netflix-clone</span>
  <p className="suggested-repo-desc" >Streaming platform with auth & playback.</p>
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
