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
    path:"/profile",
    element:<Profile/>
   },
   {
    path:"/repo",
    element: <Repo/>
   },

   {
    path: "/repo/:id",
    element: <UserRepo/>
   },
   {
    path:"/blog",
    element: <Blog/>
   }

    ]);

    return element;
}

export default ProjectRoutes;
