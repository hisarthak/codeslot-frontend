import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import "./navbar.css";
const apiUrl = import.meta.env.VITE_API_URL;
import { useSearch } from '../searchContext'; 

const Navbar = () => {
    const [isBoxVisible, setIsBoxVisible] = useState(false); // State to control visibility of the box
    const searchBoxRef = useRef(null); // Ref for the nav-search-box
    const [inputValue, setInputValue] = useState(""); // State to track input value
    const inputRef = useRef(null); // Ref for the input element
    const navigate = useNavigate(); // For programmatic navigation
    const location = useLocation();

    const { setSearchQuery, searchQuery } = useSearch();  // Destructure setSearchQuery from useSearch hook
 
const theUsername = localStorage.getItem("username");
   
    // Update body overflow when `isBoxVisible` changes
    useEffect(() => {
      if (isBoxVisible) {
          document.body.style.overflow = "hidden"; // Disable scrolling
          
      } else {
          document.body.style.overflow = ""; // Reset scrolling
      }

      // Cleanup to avoid side effects
      return () => {
          document.body.style.overflow = ""; // Reset scrolling on unmount
      };
  }, [isBoxVisible]);

    // Detect clicks outside the nav-search-box
    useEffect(() => {
      const handleClickOutside = (event) => {
          if (
              searchBoxRef.current &&
              !searchBoxRef.current.contains(event.target)
          ) {
              setIsBoxVisible(false); // Hide the box if clicked outside
          }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);

    // Function to toggle the visibility of the box
    const toggleBoxVisibility = () => {
      setIsBoxVisible((prevState) => !prevState);
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
              return; // Do nothing if typing in an input or textarea
          }

          if (event.key === "/") {
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
            <div className="toggle">
                <i className="fa-solid fa-bars"></i>
            </div>
            <Link to="/">
                <div>
                    <img
                        src="../sloth.png"
                        alt="SlotCode Logo"
                    />
                    <h4 title="Go to Dashboard" className="dash">SlotCode</h4>
                </div>
            </Link>
            <div>
              {isBoxVisible &&    <div className="fullpage-box"></div>}
           
              <div className='nav-search-box' ref={searchBoxRef}>
                {!isBoxVisible &&
                <button onClick={toggleBoxVisibility} className="nav-search-box-btn"><i className="fa-solid fa-magnifying-glass"></i>&nbsp;Type "/" to search&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>}
                {isBoxVisible && (
                    <div className="nav-search-box-form">
                      <form>
                        <div  className='nav-search-box-inp-div'>&nbsp;&nbsp;<i className="fa fa-search search-glass"></i> &nbsp;
                        <input  className='nav-search-box-inp'ref={inputRef}   defaultValue={searchQuery || inputValue}

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



navigate(`/${theUsername}`);  
window.location.reload();
    }}
    className="profile-link">
                    <p className="btn tooltip"><b>{(localStorage.getItem("username")?.toString()?.charAt(0)?.toUpperCase()) || ""
                    }</b> <span className="tooltip-text">Profile</span></p>
                </div>
            </div>
        </nav>
        </>
    );
};

export default Navbar;
