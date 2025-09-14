import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showtoast";
import slugify from "slugify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/usefetch";
import Dropzone from "react-dropzone";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RouteBlog } from "@/helpers/RouteNames";
import { useNavigate, useParams } from "react-router-dom";

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [preview, setPreview] = useState(false);
  const [file, setFile] = useState(false);

  // fetch single blog
  const Blogresponse = useFetch(`${getEnv("VITE_BASE_URL")}/blog/get-blog/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const { data: blogData } = Blogresponse;

  // fetch categories
  const Categoryresponse = useFetch(`${getEnv("VITE_BASE_URL")}/category/all-category`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const { data: categoryData } = Categoryresponse;

  // schema now includes content
  const formSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }).max(20, {message: "Title is too long"}),
    slug: z.string().min(6, { message: "Slug must be at least 6 characters." }),
    category: z.string().min(1, { message: "Category must be at least 1 character." }),
    content: z.string().min(20, { message: "Content must be at least 20 characters." }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      category: "",
      content: "",
    },
  });

  // populate form when blogData arrives
  useEffect(() => {
    if (blogData?.blog) {
      form.setValue("title", blogData.blog.title || "");
      form.setValue("slug", blogData.blog.slug || "");
      form.setValue("category", blogData.blog.category?._id || "");
      form.setValue("content", blogData.blog.content || "");
      // preview can be the image URL returned by API
      setPreview(blogData.blog.image || false);
    }
  }, [blogData, form]);

  // auto-generate slug when title changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title") {
        const currentName = value.title;
        if (currentName && currentName.trim().length > 0) {
          form.setValue("slug", slugify(currentName));
        } else {
          form.setValue("slug", "");
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleDrop = (acceptedFiles) => {
    const f = acceptedFiles[0];
    if (!f) return;
    const previewUrl = URL.createObjectURL(f);
    setPreview(previewUrl);
    setFile(f);
  };

  const onSubmit = async (values) => {
    try {
      const newValues = { ...values, author: user.user._id };
      const payload = new FormData();
      payload.append("data", JSON.stringify(newValues));
      // only append file if user selected a new one
      if (file) payload.append("file", file);

      const response = await fetch(`${getEnv("VITE_BASE_URL")}/blog/update-blog/${id}`, {
        method: "PUT",
        credentials: "include",
        body: payload,
      });

      const result = await response.json();

      if (!response.ok) {
        showToast("error", result.message || "Failed to update blog");
        return;
      }

      showToast("success", result.message || "Blog updated");
      navigate(RouteBlog);
    } catch (err) {
      showToast("error", err.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <Card className="w-full">
        <CardHeader>
          <h2>Edit Blog</h2>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col gap-4">
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryData?.category?.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug */}
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

              {/* Featured image dropzone */}
              <div className="flex gap-4 flex-col w-32 h-32 ">
                <FormLabel>Featured Image</FormLabel>
                <Dropzone onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="w-32 h-32">
                      <input {...getInputProps()} />
                      <div className="w-32 h-32 border-2 border-gray-400 ml-2">
                        {preview ? (
                          // preview could be a URL from server or object URL for newly selected file
                          <img src={preview} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <p className="text-center mt-7 text-sm">
                            Drag and drop files here, or click to select files
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </Dropzone>
              </div>

              {/* Content textarea */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={10}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 text-sm"
                        placeholder="Write your blog content here..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Update Blog
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogEdit;
