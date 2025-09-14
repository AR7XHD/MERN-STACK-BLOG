import BlogCard from '@/components/BlogCard'
import React from 'react'
import { useFetch } from '@/hooks/usefetch'
import { getEnv } from '@/helpers/getEnv'
import Loading from '@/components/Loading'


const index = () => {
  const Blogrepsonse = useFetch(getEnv("VITE_BASE_URL") + "/blog/blogs", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: "include",
  })

  const {data:BlogData,loading,error} = Blogrepsonse;


  return (
    <>
    {loading && <Loading />}
    {error && <div>{error}</div>}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {BlogData && 
    BlogData?.blog?.map((blog,index) => (
    <BlogCard post={blog} key={index} />
    ))}
    </div>
    </>
  )
}

export default index