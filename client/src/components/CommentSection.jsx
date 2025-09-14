import React, { useState } from 'react'
import { Card , CardContent} from './ui/card'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getEnv } from '@/helpers/getEnv'
import { showToast } from '@/helpers/showtoast'
import { useFetch } from '@/hooks/usefetch'
import moment from "moment";


const CommentSection = ({props}) => {
    const [refresh, setRefresh] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const {id} = useParams();
    const user = useSelector((state) => state.user);
    const formSchema = z.object({
        comment: z.string().min(2, {
          message: "Comment must be at least 2 characters.",
        }),
      })

      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          comment: "",
        },
      })
      
      const onSubmit = async (values) => {
        
        const newValues = {...values , author: user.user._id , blog: id}
        
        const CommentResponse = await fetch(`${getEnv("VITE_BASE_URL")}/comment/add`,{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newValues),
        })

        const data = await CommentResponse.json();

        if(!CommentResponse.ok){
            showToast("error",data.message);
            return;
        }

        showToast("success",data.message);
        setRefresh(!refresh);
        // console.log(refresh);
      }

      const {data:CommentData,loading,error} = useFetch(`${getEnv("VITE_BASE_URL")}/comment/allcomments/${id} `,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }, [refresh]);
      
      const commentsToDisplay = showAllComments
      ? CommentData?.comments
      : CommentData?.comments?.slice(0, 1);
      
  return (
    <>
    <Card>
        <CardContent>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium mb-2">Comment</FormLabel>
              
              <FormControl>
                <Textarea placeholder="comment" {...field} className="h-20" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </CardContent>
    </Card>

    <div className="w-full">
      {/* Header */}
      <div className="mb-4 mt-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {CommentData?.comments?.length} Comments
        </h3>
      </div>

      {/* List */}
      <div className="space-y-4">
        {commentsToDisplay?.map((comment) => (
          <div
            key={comment._id}
            className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border"
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {comment.author?.profilePicture ? (
                  <img
                    src={comment.author.profilePicture}
                    alt={comment.author.username || "author"}
                    className="w-full h-full object-cover"
                    // onError={(e) => {
                    //   e.currentTarget.onerror = null;
                    //   e.currentTarget.src = AVATAR_PLACEHOLDER;
                    // }}
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-600">
                    {comment.author?.username
                      ? comment.author.username
                          .split(" ")
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "AB"}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">
                      {comment.author?.username ?? "Unknown"}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    {/* blog title (optional link)
                    {comment.blog?.title ? (
                      <Link
                        to={`/blog/${comment.blog.slug ?? ""}/${comment.blog._id ?? ""}`}
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        {comment.blog.title}
                      </Link>
                    ) : null} */}
                  </div>
                  <div className="text-xs text-gray-400">
                    {moment(comment.createdAt).fromNow()}
                  </div>
                </div>

                {/* optional actions */}
                <div className="ml-4 flex items-center gap-2">
                  {/* example small action buttons; uncomment/use if needed */}
                  {/* <button className="text-xs text-gray-500 hover:text-gray-700">Reply</button> */}
                </div>
              </div>

              {/* The comment text */}
              <p className="mt-2 text-sm text-gray-700 leading-relaxed line-clamp-4">
                {comment.comment}
              </p>
            </div>
          </div>
        ))}

        {CommentData?.comments?.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No comments yet — be the first to comment!
          </div>
        )}
        {CommentData?.comments?.length > 1 && !showAllComments && (
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setShowAllComments(true)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Show all {CommentData.comments.length} comments
            </Button>
          </div>
        )}
        {CommentData?.comments?.length > 1 && showAllComments && (
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setShowAllComments(false)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Show less
            </Button>
          </div>
        )}
      </div>
    </div>

</>

  )


}

export default CommentSection