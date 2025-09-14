import React, { useState } from 'react'
import { IoChatbubbleOutline } from "react-icons/io5";
import { useFetch } from '@/hooks/usefetch'
import { getEnv } from '@/helpers/getEnv'

const CommentCount = ({props}) => {
    // console.log("props",props)
    const [refresh, setRefresh] = useState(false);
    const {data:CommentData,loading,error} = useFetch(`${getEnv("VITE_BASE_URL")}/comment/commentcount/${props}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }, [refresh]);

      // console.log("CommentData",CommentData);

  return (
    <div className='flex items-center gap-x-1.5'>
        <IoChatbubbleOutline />
        <span className='text-sm font-medium'>{CommentData?.count}</span>
    </div>
  )
}

export default CommentCount