import React, { useEffect, useState } from 'react'
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/usefetch";
import { useSelector } from "react-redux";
import { showToast } from "@/helpers/showtoast";


const BlogLike = ({props}) => {
    const [userLiked , setuserLiked] = useState(false)
    const user = useSelector((state) => state.user);
    const [likesCount,setLikesCount] = useState(0);

    const {data:LikeData,loading,error} = useFetch(`${getEnv("VITE_BASE_URL")}/bloglike/count/${props}/${user && user.user._id ? user.user._id : ''}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
          },
        credentials: "include",
      });

      const handleLike = async () => {
        if(user?.user._id){
            const response = await fetch(`${getEnv("VITE_BASE_URL")}/bloglike/add`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
              },
            credentials: "include",
            body: JSON.stringify({blog: props, author: user.user._id}),
          });
          const data = await response.json();
          if(!response.ok){
            showToast("error",data.message);
            return;
          }
          setLikesCount(data.totalCount);
          if(data.userCount > 0){
              setuserLiked(true)
          }else{
              setuserLiked(false)
          }
        }
        else{
            showToast("error","Login to like this blog");
        }
        


    }

    useEffect(() => {
        if(LikeData){
            setLikesCount(LikeData?.totalCount);
            setuserLiked(LikeData?.userCount > 0 ? true : false);
            // .log("userLiked",userLiked);
            // .log("likesCount",likesCount);
        }
    }, [LikeData]);

    
  return (
    <div className='flex items-center gap-1'>
        {userLiked && <FaHeart onClick={handleLike} className='w-4 h-4' color='red'/> }
        {!userLiked && <CiHeart onClick={handleLike} className='w-4 h-4' />}
        <span>{likesCount}</span>
    </div>
  )
}

export default BlogLike