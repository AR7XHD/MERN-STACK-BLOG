import React from 'react'
import { Card, CardContent } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { RouteSingleBlog } from '@/helpers/RouteNames'

const BlogCard = ({ post }) => {
  const initials = post?.author?.username
    ? post.author.username.split(' ').map(n => n[0]).slice(0, 2).join('')
    : 'AB';

  return (
    <Link to={RouteSingleBlog(post?.category?.slug, post?.slug, post?._id)}>
      <Card className="rounded-xl shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 duration-200">
        <CardContent className="p-4">
          {/* Top row */}
          <div className="flex items-center gap-2">
            <Avatar className="w-10 h-10 rounded-full overflow-hidden bg-white">
              {post?.author?.profilePicture ? (
                <AvatarImage
                  src={post.author.profilePicture}
                  className="w-full h-full object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{post.author?.username}</p>
              {post?.author?.role === "admin" && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700 font-medium">
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Image */}
          <div className="mt-3">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-36 object-cover rounded-lg"
            />
          </div>

          {/* Bottom */}
          <div className="mt-3">
            <p className="text-xs text-gray-500">{moment(post.createdAt).format("DD MMM YYYY")}</p>
            <h3 className="text-base font-semibold line-clamp-2">{post.title}</h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default BlogCard
