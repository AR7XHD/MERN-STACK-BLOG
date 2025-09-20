import React from 'react'
import { useFetch } from '@/hooks/usefetch';
import { getEnv } from '@/helpers/getEnv';
import BlogCard from './BlogCard';

const RelatedBlog = ({props}) => {
    const {data:RelatedData,loading,error} = useFetch(`${getEnv("VITE_BASE_URL")}/blog/related-blog/${props.category}/${props.id}/`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 mt-5 cursor-pointer">Related Blogs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {RelatedData && 
          RelatedData?.blog?.map((blog,index) => (
            <BlogCard post={blog} key={index} />
        ))}
      </div>
    </div>
  )
}

export default RelatedBlog