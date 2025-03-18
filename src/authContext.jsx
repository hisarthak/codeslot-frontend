import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom"; 

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const demoDate = localStorage.getItem("demoDate");
        const username = localStorage.getItem("username");

        const clearAuthDataAndRedirect = () => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            localStorage.removeItem("demoDate");
            navigate("/auth");
        };

        // Check if user is a "demo" user and demoDate is older than 24 hours
        if (username === "demo" && demoDate) {
            const demoTimestamp = Number(demoDate);
            const currentTimestamp = Date.now();
            const twentyFourHours = 24 * 60 * 60 * 1000;

            if (currentTimestamp - demoTimestamp > twentyFourHours) {
                console.warn("Demo user session expired.");
                clearAuthDataAndRedirect();
                return;
            }
        }

       

        if (token && userId) {
            try {
             
                const decoded = jwtDecode(token); 
        
                // Check if token is expired
                if (decoded.exp * 1000 > Date.now()) {
              
                    setCurrentUser(userId);
                } else {
                    console.warn("Token expired");
                    clearAuthDataAndRedirect();
                }
            } catch (error) {
                console.error("Invalid token", error);
                clearAuthDataAndRedirect();
            }
        } else {
            console.warn("No valid token or userId found");
        }
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
