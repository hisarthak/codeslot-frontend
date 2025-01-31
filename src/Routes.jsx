import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

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

// Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      const normalizedPath = window.location.pathname.replace(/\/$/, '').split('#')[0];
        const userIdFromStorage = localStorage.getItem("userId");

        // If user is logged in but not set in context, update it
        if (userIdFromStorage && !currentUser) {
            setCurrentUser(userIdFromStorage);
        }

        // Redirect to login if not authenticated and trying to access a protected route
        const protectedRoutes = ["/", "/new", "/blog", "/search"];
        if (!userIdFromStorage && protectedRoutes.includes(window.location.pathname)) {
            navigate("/auth");
        }

        // If already logged in, prevent access to login/signup
        if (userIdFromStorage && ["/auth", "/signup"].includes(window.location.pathname)) {
            navigate("/");
        }
    }, [currentUser, navigate, setCurrentUser]);

    let element = useRoutes([
        { path: "/", element: <Dashboard /> },
        { path: "/auth", element: <Login /> },
        { path: "/signup", element: <Signup /> },
        { path: "/new", element: <Repo /> },
        { path: "/:username/:repo", element: <UserRepo /> },
        { path: "/repo/:filePath", element: <RepoFile /> },
        { path: "/blog", element: <Blog /> },
        { path: "/search", element: <Search /> },
        { path: "/not-found", element: <NotFound /> },
        { path: "/:username", element: <Profile /> },
        { path: "*", element: <NotFound /> }, // Catch-all route
    ]);

    return element;
};

export default ProjectRoutes;
