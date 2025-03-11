import React, { useEffect, useState } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import { useAuth } from "./authContext";

// Pages List
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Repo from "./components/repo/Repo";
import Blog from "./components/Blog";
import UserRepo from "./components/repo/UserRepo";
import RepoFile from "./components/repo/RepoFile";
import Search from "./components/search/Search";
import NotFound from "./components/NotFound";
import AutoLogin from "./components/AutoLogin";


const ProjectRoutes = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const navigate = useNavigate();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const userIdFromStorage = localStorage.getItem("userId");

        if (userIdFromStorage) {
            if (!currentUser) setCurrentUser(userIdFromStorage);

            // If logged in, prevent access to auth/signup pages
            if (["/auth", "/signup"].includes(window.location.pathname)) {
                navigate("/", { replace: true });
            }
        } else {
            // If not logged in, allow only specific pages
            const allowedRoutes = ["/auth", "/signup", "/auto-login"];
            if (!allowedRoutes.includes(window.location.pathname.toLowerCase())) {
                console.log("Redirecting to /auth because", window.location.pathname);
                navigate("/auth", { replace: true });
            }
        }

        setAuthChecked(true); // Authentication check is complete
    }, [currentUser, navigate, setCurrentUser]);

    // **Always call hooks in the same order, and use conditional rendering in JSX**
    let element = useRoutes([
        { path: "/auth", element: <Login /> },
        { path: "/signup", element: <Signup /> }, // Now accessible without login
        { path: "/", element: <Dashboard /> },
        { path: "/new", element: <Repo /> },
        { path: "/:username/:repo", element: <UserRepo /> },
        { path: "/repo/:filePath", element: <RepoFile /> },
        { path: "/blog", element: <Blog /> },
        { path: "/search", element: <Search /> },
        { path: "/not-found", element: <NotFound /> },
        { path: "/:username", element: <Profile /> },
        {path:"/auto-login", element: <AutoLogin/>},
        { path: "*", element: <NotFound/> }, // Catch-all route
    ]);

    return authChecked ? element : <></>; // Use conditional JSX rendering
};

export default ProjectRoutes;
