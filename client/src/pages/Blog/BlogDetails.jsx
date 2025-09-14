import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader,CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { RouteBlogAdd, RouteBlogEdit } from '@/helpers/RouteNames'
import { useFetch } from '@/hooks/usefetch'
import { getEnv } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import { showToast } from '@/helpers/showtoast'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";


const BlogDetails = () => {
  const [Refresh, setRefresh] = useState(false);
  const response = useFetch(`${getEnv("VITE_BASE_URL")}/blog/all-blog`, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: "include",
  },[Refresh])

const {data, loading, error} = response;
// console.log(data?.blog)


if(error){
  showToast("error",error.message);
}


const handleDelete = async (id) => {


  const response = await fetch(`${getEnv("VITE_BASE_URL")}/blog/delete-blog/${id}`, {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: "include",
  },[Refresh])

const data = await response.json();

if(!response.ok){
  showToast("error",data.message);
  return;
}

showToast("success",data.message);

setRefresh(!Refresh);
}



  return (
    <div className="w-full">
    <Card className="w-full">
      <CardHeader>
        <Link to={RouteBlogAdd}>
        <Button>Add Blog</Button>
        </Link>
      </CardHeader>
       {loading ? <Loading /> : data && <CardContent>
       <Table>
        <TableHeader>
          <TableRow>    
            <TableHead>Sr No.</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
         {data?.blog?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.author.username}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.slug}</TableCell>
              <TableCell>{item.category.name}</TableCell>
              <TableCell className="flex gap-2">
                <Link to={RouteBlogEdit(item._id)}>
                  <Button><FaEdit /></Button>
                </Link>
                <Button onClick={() => handleDelete(item._id)}><MdDelete /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
    
       </Table>
      </CardContent>
      } 

    </Card>
    </div>
  ) 

}

export default BlogDetails