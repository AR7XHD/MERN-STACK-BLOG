import React from 'react'
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../helpers/firebase";
import { getEnv } from "../helpers/getEnv";
import { showToast } from "../helpers/showtoast";
import { useNavigate } from 'react-router-dom';
import { RouteIndex } from "../helpers/RouteNames";
import { useDispatch } from 'react-redux';
import { AddUser } from '../redux/user/userSlice';
const GoogleLogin = ({sign}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleGoogle = async () => {
        const GoogleResponse = await signInWithPopup(auth, provider);
        const values = {
            username: GoogleResponse.user.displayName,
            email: GoogleResponse.user.email,
            avatar: GoogleResponse.user.photoURL,
            sign,
        }
        try{    
        const response = await fetch(`${getEnv("VITE_BASE_URL")}/auth/google-login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
                credentials: "include",
            })
          
            const data = await response.json();
        
            if(!response.ok){
                showToast("error",data.message);
                return;
            }
        

            dispatch(AddUser(data.user));

            showToast("success",data.message);


        
            navigate(RouteIndex);

        
        }catch(error){
            showToast("error",error.message);
        }
        
    }
  return (
    <Button onClick={handleGoogle} variant="outline" className="w-full">
        <FcGoogle className="mr-2 h-5 w-5"/>
            Continue with Google
    </Button>
  )
}

export default GoogleLogin
