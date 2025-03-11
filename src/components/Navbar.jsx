import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import "./navbar.css";
const apiUrl = import.meta.env.VITE_API_URL;
import { useSearch } from '../searchContext'; 

const Navbar = () => {
    const [isBoxVisible, setIsBoxVisible] = useState(false); // State to control visibility of the box
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const searchBoxRef = useRef(null); // Ref for the nav-search-box
    const sidebarRef = useRef(null);
    const [inputValue, setInputValue] = useState(""); // State to track input value
    const inputRef = useRef(null); // Ref for the input element
    const navigate = useNavigate(); // For programmatic navigation
    const location = useLocation();
    const { setSearchQuery, searchQuery } = useSearch();  // Destructure setSearchQuery from useSearch hook
 
const theUsername = localStorage.getItem("username");
   
useEffect(() => {
    if (isBoxVisible || isSidebarVisible) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }
    return () => {
        document.body.style.overflow = "";
    };
}, [isBoxVisible, isSidebarVisible]);

useEffect(() => {
    const handleClickOutside = (event) => {
        if (
            (searchBoxRef.current && searchBoxRef.current.contains(event.target)) ||
            (sidebarRef.current && sidebarRef.current.contains(event.target))
        ) {
            return; // Do nothing if clicking inside the search box or sidebar
        }

        // Close when clicking on fullpage-box or any outside area
        setIsBoxVisible(false);
        setIsSidebarVisible(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);

    // Function to toggle the visibility of the box
    const toggleBoxVisibility = () => {
      setIsBoxVisible((prevState) => !prevState);
      setIsSidebarVisible(false); 
    };

    const toggleSidebarVisibility = () => {
        setIsSidebarVisible((prev) => !prev);
        setIsBoxVisible(false); // Close search box if sidebar opens
    };

    // Detect "/" key press
    useEffect(() => {
      const handleKeyDown = (event) => {
          // Check if the active element is an input, textarea, or contenteditable element
          const activeElement = document.activeElement;
          const isTyping = 
              activeElement.tagName === "INPUT" || 
              activeElement.tagName === "TEXTAREA" || 
              activeElement.isContentEditable;

          if (isTyping) {
              return;
          }

          if (event.key === "/") {
            setIsSidebarVisible(false); 
              event.preventDefault(); // Prevent the default browser behavior
              setIsBoxVisible(true); // Show the box
          }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
          document.removeEventListener("keydown", handleKeyDown);
      };
  }, []);

    // Focus the input when the box becomes visible
    useEffect(() => {
      if (isBoxVisible && inputRef.current) {
          inputRef.current.focus(); // Focus on the input element
      }
  }, [isBoxVisible]);

    // Clear the input field
    const clearInput = () => {
      setInputValue(""); // Clear the input value
      if (inputRef.current) {
          inputRef.current.value = '';
          inputRef.current.focus(); // Clear the input field
      }
  };

  const handleKeyDown = async (event) => {
    // Prevent form submission behavior
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default behavior (like form submission)
        window.scrollTo({
            top: 0,
            behavior: 'instant' // Ensure instant scrolling
        });

        const trimmedQuery = inputValue.trim();
        if (location.pathname === '/search') {
            // If we're already on the search page, update the searchQuery using setSearchQuery
          
            setSearchQuery(inputValue.trim());
            setIsBoxVisible(false);
            return; // Skip navigation as we're already on the search page
        }

        // If not on the search page, proceed with navigating to the search page
        if (inputValue.trim()) {
            try {
              
                setSearchQuery(inputValue.trim());
                navigate(`/search?query=${encodeURIComponent(inputValue)}`);
                
            } catch (error) {
                console.error("Error during navigation:", error);
            }
        }
    }
};

useEffect(() => {
    if (searchQuery && !inputValue) {
        setInputValue(searchQuery);  // Set initial value if searchQuery is available
    }
}, [searchQuery]);

  // Update the input value state on typing
  const handleInputChange = (event) => {
      setInputValue(event.target.value); // Update input value
  };
    return (
        <>
        <nav>
            <div className="toggle"onClick={toggleSidebarVisibility} >
                <i className="fa-solid fa-bars"></i>
            </div>
           
                <div>
                <h3 title="Go to Dashboard" className="dash-name1" style={{color: "white",fontFamily: "Quicksand, serif", textDecoration:"none"}}>Code</h3>
                    <img
                        src="/Codeslot-logo.png"
                        alt="CodeSlot Logo"
                        onClick={() => {navigate(`/`)}}
                        style={{cursor: "pointer"}}
                        title="Go to Dashboard"
                    />  
                     <Link to="/" style={{textDecoration: "none"}}>
                    <h3 title="Go to Dashboard" className="dash-name" style={{color: "white",fontFamily: "Quicksand, serif", textDecoration: "none"}}>lot</h3>
                    </Link>
                </div>
    
            <div>
            {(isBoxVisible || isSidebarVisible) && <div className="fullpage-box"></div>}
           
              <div className='nav-search-box' ref={searchBoxRef}>
                {!isBoxVisible &&
                <button onClick={toggleBoxVisibility} className="nav-search-box-btn"><i className="fa-solid fa-magnifying-glass"></i>&nbsp;<span className='invisible-search-btn-text'>Type "/" to search&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></button>}
                  {isBoxVisible && !isSidebarVisible &&  (
                    <div className="nav-search-box-form">
                      <form>
                        <div  className='nav-search-box-inp-div'>&nbsp;&nbsp;<i className="fa fa-search search-glass"></i> &nbsp;
                        <input  className='nav-search-box-inp'ref={inputRef} placeholder='Search e.g. Netflix'   defaultValue={searchQuery || inputValue}

                            onChange={handleInputChange} onKeyDown={handleKeyDown}  ></input>   {inputValue && ( // Only show the cross button if there is input
                            <div className="cross-btn" onClick={clearInput}>
                                <i className="fa fa-times"></i> {/* Cross Icon */}
                            </div>
                          )}</div>
                   </form>
                    </div>
                )}</div>
                <Link to="/new">
                    <p className="repo-link">Create Repo</p>
                </Link>
                <div    onClick={() => {


// navigate(0);
navigate(`/${theUsername}`);  
navigate(0);
    }}
    className="profile-link">
                    <p className="btn tooltip"><b>{(localStorage.getItem("username") || "Guest").charAt(0).toUpperCase()}</b> <span className="tooltip-text">Profile</span></p>
                </div>
            </div>
        </nav>
        {isSidebarVisible && (
                <div className={`theSidebar ${isSidebarVisible ? "active": ""}`} ref={sidebarRef}>
                    <div className="sidebar-header">
                     <div>
                    <img className='logo-sidebar'
                        src="/Codeslot-logo.png"
                        alt="/CodeSlot Logo"
                    />
                </div>
                    <div className="close-sidebar" onClick={() => setIsSidebarVisible(false)}><i class="fa-solid fa-x"></i></div>
                    </div>
                    <div className="sidebar-content">
                    <ul>
                        <li  onClick={() =>{
                          window.scrollTo({
                            top: 0,
                            behavior: 'instant' // Ensure instant scrolling
                          });
                        navigate(`/`)}}><i class="fa-solid fa-house"></i>&nbsp;&nbsp;Home</li>
                        <li
                        onClick={() =>{
                        window.scrollTo({
                          top: 0,
                          behavior: 'instant' // Ensure instant scrolling
                        });
                      navigate(`/${theUsername}`)}} 
                        ><i className="fa-solid fa-user-circle"></i>&nbsp;&nbsp;Profile</li>
                          <li  onClick={() =>{
                          window.scrollTo({
                            top: 0,
                            behavior: 'instant' // Ensure instant scrolling
                          });
                        navigate(`/new`)}}><i class="fa-solid fa-book" style={{color: "#b7bdc8"}}></i>&nbsp;Create Repo</li>
                          <li onClick={toggleBoxVisibility} ><i class="fa-solid fa-magnifying-glass"></i>&nbsp;&nbsp;Search</li>
                        <li
        onClick={() => {
       const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/auth";
      setCurrentUser(null);
    }

       
        }}
      ><i className="fa-solid fa-right-from-bracket"></i>&nbsp;&nbsp;Logout</li>
                    </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
