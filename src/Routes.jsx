import React,{useEffect} from "react";
import {useNavigate, useRoutes} from 'react-router-dom';

// Pages List 

import Dashboard from "./components/dashboard/Dashboard";
import Profile  from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Repo from "./components/repo/Repo";
import Blog from "./components/Blog";
import UserRepo from "./components/repo/UserRepo"
import RepoFile from "./components/repo/RepoFile"
import Search from "./components/search/Search"
import NotFound from "./components/NotFound"

// Auth Context
import { useAuth } from "./authContext";


const ProjectRoutes = ()=>{
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const userIdFromStorage = localStorage.getItem("userId")

        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }

        if(!userIdFromStorage && ["/auth"].includes(window.location.pathname))
            {
           navigate("/auth");
        }

        if(userIdFromStorage && window.location.pathname=="/auth"){
            navigate("/");
        }
    }, [currentUser, navigate, setCurrentUser]);

    let element = useRoutes([
   {
    path:"/",
    element:<Dashboard/>
   },
   {
    path:"/auth",
    element:<Login/>
   },
   {
    path:"/signup",
    element:<Signup/>
   },
  
   {
    path:"/new",
    element: <Repo/>
   },

   {
    path: "/:username/:repo",
    element: <UserRepo/>
   },
   {
    path: "/repo/:filePath",
    element: <RepoFile/>
   },
   {
    path:"/blog",
    element: <Blog/>
   },
   {
    path: "/search",
    element: <Search/>
   },
   {
    path: "/not-found",
    element: <NotFound />
  },
  {
    path:"/:username",
    element:<Profile/>
   },
  // Catch-all route for unmatched paths (optional)
  {
    path: "*",
    element: <NotFound /> // This renders as a fallback route if no other routes match
  }

    ]);

    return element;
}

export default ProjectRoutes;
