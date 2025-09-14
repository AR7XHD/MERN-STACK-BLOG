import React from 'react'
import { useParams } from 'react-router-dom'
import { useFetch } from '@/hooks/usefetch'
import { getEnv } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import BlogCard from '@/components/BlogCard'
import { BiCategory } from "react-icons/bi";


const BlogByCategory = () => {
  const {category} = useParams()
  const {data:BlogData,loading,error} = useFetch(`${getEnv("VITE_BASE_URL")}/blog/get-blog-by-category/${category}`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  // console.log(BlogData)
  return (
    <div className="container mx-auto px-4 py-8">
      {loading && <Loading />}
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div className="flex items-center gap-3 border-b border-gray-300 pb-4 mb-8">
        <BiCategory className="text-4xl text-gray-700" />
        <h2 className="text-4xl font-bold text-gray-800 tracking-tight">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {BlogData && 
          BlogData?.blog?.map((blog,index) => (
            <BlogCard post={blog} key={index} />
        ))}
      </div>
    </div>
  )
}

export default BlogByCategory