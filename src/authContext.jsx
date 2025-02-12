import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ FIXED

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (token && userId) {
            try {
                const decoded = jwtDecode(token); // ✅ Now works properly

                // Check if token is expired
                if (decoded.exp * 1000 > Date.now()) {
                    setCurrentUser(userId);
                } else {
                    console.warn("Token expired");
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("username");
                }
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("username");
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};
