import React, { useEffect } from 'react'
import { Card,CardHeader,CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useSelector } from "react-redux"
import { useFetch } from "../hooks/usefetch"
import { getEnv } from "../helpers/getEnv"
import Loading from "../components/Loading"
import Dropzone from "react-dropzone"
import { useState } from "react"
import { showToast } from '@/helpers/showtoast'
import { useDispatch } from "react-redux"
import { AddUser } from "../redux/user/userSlice"

const profile = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [preview, setPreview] = useState();
    const [file, setFile] = useState();

        const {data,loading,error} = useFetch(`${getEnv("VITE_BASE_URL")}/user/get-user/${user.user._id}`,{credentials: "include",method: "GET"});
    

      

    const schema = z.object({
        email: z.string().email(),
        name: z.string().min(6,{message: "Name must be at least 6 characters."}),
        bio: z.string().min(6,{message: "Bio must be at least 6 characters."}),
        password: z.string().optional(),
      });

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
          email: "",
          name: "",
          bio: "",
          password: "",
        },
      });

      useEffect(() => {
        if(data && data.success){
            form.setValue("email", data.user.email);
            form.setValue("name", data.user.username);
            form.setValue("bio", data.user.bio);
        }
      },[data]);

      const handleDrop = (acceptedFiles) => {
       
        const file = acceptedFiles[0];
        const preview = URL.createObjectURL(file);
        setPreview(preview);
        setFile(file);
        
        
      };

      const onSubmit = async (values) => {
        const formData = new FormData();
        formData.append("data", JSON.stringify(values));
        formData.append("profilePicture", file);
        // console.log(file);

        

        const response = await fetch(`${getEnv("VITE_BASE_URL")}/user/update-user/${user.user._id}`,{
            method: "PUT",
            credentials: "include",
            body: formData,
        });


        const data = await response.json();

        if(!response.ok){
            showToast("error",data.message);
            return;
        }

        dispatch(AddUser(data.user));

        showToast("success",data.message);

        
      };
    
  return (
    <>
    
    {loading?<Loading/>: error?<p>{error.message}</p>: <div className="flex justify-center">
    <Card className="w-full max-w-2xl p-6 shadow-lg">

        <CardHeader className="flex flex-col items-center text-center">

        <Dropzone onDrop={acceptedFiles => handleDrop(acceptedFiles)}>
  {({getRootProps, getInputProps, isDragActive}) => (
    
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={preview || data?.user?.profilePicture || ""} alt="" />
                <AvatarFallback>{data?.user?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
      
      </div>
  )}
</Dropzone>
            
            <h2 className="text-2xl font-bold">Profile</h2>
        </CardHeader>

        <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="bio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Save Changes</Button>
            </form>
        </Form>            
        </CardContent>
    
    </Card>
</div>
}
</>
)}

export default profile