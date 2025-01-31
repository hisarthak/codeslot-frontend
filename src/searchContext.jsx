import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const SearchContext = createContext();

export const useSearch = () => {
    return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
    const location = useLocation();
    
    // Search state
    const [searchQuery, setSearchQuery] = useState(new URLSearchParams(location.search).get('query') || "");
    const [searchKey, setSearchKey] = useState(0); 
    const [repositories, setRepositories] = useState([]);
    const [users, setUsers] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(true);

    
  

    const apiUrl = import.meta.env.VITE_API_URL;

     // Function to set the query and force re-fetch
     const handleSetSearchQuery = (newQuery) => {
        setSearchQuery(newQuery);
        setSearchKey((prevKey) => prevKey + 1); // Increment the key to force re-fetch
    };
 

    // Fetch search results based on the query parameter
    useEffect(() => {
        if (searchQuery) {
            console.log('Fetching search results for query:', searchQuery);
            setRepositories([]);
            setUsers([]);
    
      
            const fetchSearchResults = async () => {
                setIsSearchLoading(true);
                try {
                    const response = await axios.get(
                        `https://${apiUrl}/repo/search?query=${encodeURIComponent(searchQuery)}`
                    );
                    console.log('Search Results Response:', response);

                    // Assuming response.data contains { users, repositories }
                    const { users, repositories } = response.data;
                    setUsers(users);
                    setRepositories(repositories);
                } catch (err) {
                    console.error("Error while fetching search results: ", err);
                } finally {
                    setIsSearchLoading(false);
                }
            };

            fetchSearchResults();
        } else {
            console.log('No search query provided');
        }
    }, [searchQuery, searchKey]);

    

  
 
    
      
    return (
        <SearchContext.Provider value={{
            searchQuery,
            setSearchQuery:  handleSetSearchQuery,
            repositories,
            users,
            isSearchLoading,
    
        }}>
            {children}
        </SearchContext.Provider>
    );
};
