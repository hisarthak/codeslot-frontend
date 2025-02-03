import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from "../Navbar";
import './repo.css';
const apiUrl = import.meta.env.VITE_API_URL;
// const apiUrl = "127.0.0.1:3002";



const Repo = () => {
  
    const [repoName, setRepoName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [error, setError] = useState(''); // State to store custom validation messages
    const navigate = useNavigate(); // Initialize useNavigate
    const [isLoading, setIsLoading] = useState(false);


   const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
   let username;
    // Validate required fields
    if (!repoName) {
        setError("Repository name is required.");
        setIsLoading(false); 
        return;
    }

    if (/\s/.test(repoName.trim())) {
        setError("No spaces allowed in repository name.");
        setIsLoading(false);
        return;
    }

const finalRepoName = repoName.trim().replace(/\s+/g, ' '); // Trim and remove extra spaces
const specialCharacterRegex = /^[a-zA-Z0-9-_ ]*$/; // Allows only letters, numbers, hyphen, underscore, and spaces
const hasLetter = /[a-zA-Z]/.test(finalRepoName); // Checks for at least one letter
const hyphenPositionRegex = /^(?!-).*(?<!-)$/; // Ensures no hyphen at the start or end

// Check for special characters
if (!specialCharacterRegex.test(finalRepoName)) {
    setError("Only letters, numbers, hyphens, underscores allowed.");
    setIsLoading(false); 
    return;
}

// Check for at least one letter
if (!hasLetter) {
    setError("Repository name must contain at least one letter.");
    setIsLoading(false); 
    return;
}

// Check for hyphen position
if (!hyphenPositionRegex.test(finalRepoName)) {
    setError("Hyphens can't be at the start or end of the name.");
    setIsLoading(false); 
    return;
}
 

    // If validation passes, reset error
    setError("");
  
const getUsername = localStorage.getItem("username");
const userId = localStorage.getItem("userId");

        username = getUsername; // Set the username

    // Create the payload
    const payload = {
        username: getUsername,
        owner: userId, // Replace with actual owner ID if needed
        name: finalRepoName,
        visibility: visibility === 'public', // Set true for public, false for private
        issues: [],
        content: [],
        description: description || "", // Optional description
    };

    try {
        // Send POST request
        const response = await axios.post(
            `https://${apiUrl}/repo/create`,
            payload
        );

        // Handle success response
        console.log("Repository created successfully:", response.data);

        // Optional: Show success message or redirect
        // alert("Repository created successfully!");
        navigate(`/${username}/${finalRepoName}`); // Redirect to the final repo page
    } catch (err) {
        setIsLoading(false); 
        if (err.response) {
            const errorMessage = err.response.data.err;
            // Check if status code is 400 (Bad Request)
            if (errorMessage ===`Repository name already exists` ) {
              // Access the custom error message in the response body
              
              console.log(errorMessage); // log the custom error message from the backend
              // If it's a 400 error, set the error state to the specific message
              setError(`The repository ${payload.name} already exists on this account.`);
            } else {
              // For other errors, display a generic error message
              setError("Failed to create repository. Please try again.");
              console.error(err.response.data.err || 'An unknown error occurred');
            }
          } else {
              // Handle other errors (e.g., network errors)
              setError("Failed to create repository. Please try again.");
              console.error(err.message || 'An unknown error occurred');
            }
      
    }finally {
        setIsLoading(false); // Set loading to false when the process is done
    }
};

 

    const handleRepoNameChange = (e) => {
        setRepoName(e.target.value);
        if (error) {
            setError(''); // Clear error as soon as user types
        }
    };


  



    return (
        <>
        <Navbar/>
        <div className="repo-container">
            <h2 style={{
                display: "flex",
                flexDirection: "column",
                alignSelf: "flex-start",
                marginBottom: "-0.8rem"
            }}>Create a New Repository</h2>
            <p>A repository contains all project files, including the revision history.</p>
            <p style={{
                marginTop: "-1.5rem",
                color: "#b7bdc8"
            }}>________________________________________________________________________</p>
            <form onSubmit={(e) => { handleSubmit(e); }} noValidate>
                <div style={{
                    marginBottom: "1rem",
                    marginLeft: "8.5rem"
                }}>
                    <label htmlFor="owner"><b>Repository owner : </b><i>&nbsp;{localStorage.getItem("username")}</i></label>
                   <input hidden value={localStorage.getItem("username")}/>
                </div>

                <div className="inp">
                    <label htmlFor="repo-name"><b>Repository name</b></label>
                    <input 
                    className={`repo-input ${error ? 'invalid' : ''}`} // Add 'invalid' class for error styling
                        type="text"
                        id="repo-name"
                        value={repoName}
                        onChange={handleRepoNameChange}
                        required
                    />
                         {error && <p className="error-message">&#9888; {error}</p>}
                </div>

                <div className='inp'>
                    <label htmlFor="description"><b>Description</b> (optional)</label>
                    <input 
                    className='repo-input'
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                       
                    />
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifySelf: "center",
                    marginBottom: "1rem",
                    marginTop: "1rem",
                    cursor: "default"
                }}>
                    <label><b>Visibility : </b></label>
                   &nbsp;&nbsp;
                        <input
                        className='repo-radio'
                            type="radio"
                            id="public"
                            name="visibility"
                            value="public"
                            checked={visibility === 'public'}
                            onChange={(e) => setVisibility(e.target.value)}
                        /> <span className="radio-btn"></span>
                        <label htmlFor="public" className='custom-radio'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><i className="fa-solid fa-eye"></i> Public</b></label>
                   
                    &nbsp; &nbsp;
                        <input
                        className='repo-radio'
                            type="radio"
                            id="private"
                            name="visibility"
                            value="private"
                            checked={visibility === 'private'}
                            onChange={(e) => setVisibility(e.target.value)}
                        /> <span className="radio-btn"></span>
                         <label htmlFor="private" className='custom-radio'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><i className="fa-solid fa-lock"></i> Private</b></label>
                </div>

                <button
               type="submit"
               className={isLoading ? 'disabled create-repo-btn ' : 'create-repo-btn '}
               disabled={isLoading}
                 >{isLoading ? 'Creating the repo...' : 'Create Repository '}</button>
                
            </form>
        </div>
        </>
    );
};

export default Repo;
