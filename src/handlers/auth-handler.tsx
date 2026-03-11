import {useAuth, useUser} from "@clerk/clerk-react";
import {useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const AuthHandler=()=>{
    const {isSignedIn}= useAuth();
    const {user} = useUser();
    const pathname = useLocation().pathname;
    const navigate = useNavigate();

    const [loading,setLoading] = useState(false);

    useEffect(()=>{},[isSignedIn,user,pathname,navigate]);

    return null;
};

export default AuthHandler;
