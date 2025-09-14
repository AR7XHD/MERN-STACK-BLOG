import React, { useEffect } from 'react'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from '@/helpers/showtoast'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AddUser } from '@/redux/user/userSlice'
import slugify from "slugify";


const AddCategory = () => {

    const formSchema = z.object({
            name: z.string().min(3, {
              message: "Name must be at least 3 characters.",
            }),
            slug: z.string().min(6, {
              message: "Slug must be at least 6 characters.",
            }),
          })
    
    
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          slug: "",
        },
      })

             useEffect(() => {
              form.setValue("slug", slugify(form.watch("name")));
            }, [form.watch("name")]);
    
     async function onSubmit(values) {
        const response = await fetch(`${getEnv("VITE_BASE_URL")}/category/add`, {
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
        
        showToast("success",data.message);
  
        }

return (
<div className="w-full">
<Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Add Category</Button>
            </form>
          </Form>
</div>
  )
}

export default AddCategory