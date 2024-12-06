import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../Navbar";
import './repo.css';


const Repo = () => {
    const [owner, setOwner] = useState('');
    const [repoName, setRepoName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [error, setError] = useState(''); // State to store custom validation messages

   const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!repoName) {
        setError("Repository name is required.");
        return;
    }

    // If validation passes, reset error
    setError("");
const userId = localStorage.getItem("userId");
    // Create the payload
    const payload = {
        owner: userId, // Replace with actual owner ID if needed
        name: repoName,
        visibility: visibility === 'public', // Set true for public, false for private
        issues: [],
        content: [],
        description: description || "", // Optional description
    };

    try {
        // Send POST request
        const response = await axios.post(
            "https://gitspace.duckdns.org:3002/repo/create",
            payload
        );

        // Handle success response
        console.log("Repository created successfully:", response.data);

        // Optional: Show success message or redirect
        alert("Repository created successfully!");
    } catch (err) {
        // Handle error response
        console.error("Error creating repository:", err);
        setError("Failed to create repository. Please try again.");
    }
};

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
                    marginBottom: "1rem"
                }}>
                    <label htmlFor="owner"><b>Repository owner : </b><i>&nbsp;{owner}</i></label>
                   <input hidden value={owner}/>
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
                    <small>Repository names must be unique within the system.</small>
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
                        /> <span class="radio-btn"></span>
                        <label htmlFor="public" className='custom-radio'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><i class="fa-solid fa-eye"></i> Public</b></label>
                   
                    &nbsp; &nbsp;
                        <input
                        className='repo-radio'
                            type="radio"
                            id="private"
                            name="visibility"
                            value="private"
                            checked={visibility === 'private'}
                            onChange={(e) => setVisibility(e.target.value)}
                        /> <span class="radio-btn"></span>
                         <label htmlFor="private" className='custom-radio'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b><i class="fa-solid fa-lock"></i> Private</b></label>
                </div>

                <button type="submit">Create Repository</button>
            </form>
        </div>
        </>
    );
};

export default Repo;
