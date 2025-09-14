// SingleBlog.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "@/hooks/usefetch";
import { getEnv } from "@/helpers/getEnv";
import Loading from "@/components/Loading";
import moment from "moment";
import CommentSection from "@/components/CommentSection";
import CommentCount from "@/components/CommentCount";
import BlogLike from "@/components/BlogLike";
import RelatedBlog from "@/components/RelatedBlog";

// DOMPurify to sanitize HTML content before rendering
import DOMPurify from "dompurify";

function Avatar({ src, name, size = 10 }) {
  const initials =
    name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "AB";

  return (
    <div
      className={`rounded-full overflow-hidden bg-gray-100 flex items-center justify-center`}
      style={{ width: `${size}rem`, height: `${size}rem`, minWidth: `${size}rem` }}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div className="text-xs font-medium text-gray-600">{initials}</div>
      )}
    </div>
  );
}

const SingleBlog = () => {
  const { blog, category, id } = useParams();

  const Blogrepsonse = useFetch(
    `${getEnv("VITE_BASE_URL")}/blog/single-blog/${category}/${blog}/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  const { data: BlogData, loading, error } = Blogrepsonse;
  const blogdata = BlogData?.blog;

  // safe counts (replace with real values when available)
  const likesCount = blogdata?.likes?.length ?? 0;
  const commentsCount = blogdata?.commentsCount ?? 0;

  // sanitize content if present
  const sanitizedContent = blogdata?.content
    ? DOMPurify.sanitize(blogdata.content, { USE_PROFILES: { html: true } })
    : null;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <main className="max-w-5xl mx-auto px-4 py-12 relative">
        {loading && <Loading />}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-md mb-6">
            {String(error)}
          </div>
        )}

        {/* Top-right small like + comment counts */}
        {blogdata && (
          <div className="absolute right-6 top-6 z-20">
            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
              {/* Like */}
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <BlogLike props={id} />
              </div>

              <div className="w-px h-4 bg-gray-200" />

              {/* Comments */}
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <CommentCount props={id} />
              </div>
            </div>
          </div>
        )}

        {blogdata ? (
          <article className="w-full">
            {/* Meta row: date + category */}
            <p className="text-center text-sm text-gray-500 mb-4">
              Published{" "}
              <span className="font-medium text-gray-700">
                {moment(blogdata.createdAt).format("MMMM DD, YYYY")}
              </span>{" "}
              in{" "}
              <span className="font-medium text-indigo-600">
                {blogdata.category?.name ?? "General"}
              </span>
            </p>

            {/* Author row (centered) */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {blogdata.author?.profilePicture ? (
                <img
                  src={blogdata.author.profilePicture}
                  alt={blogdata.author.username}
                  className="w-10 h-10 rounded-full object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-xs font-medium text-gray-600">
                  {blogdata.author?.username
                    ? blogdata.author.username
                        .split(" ")
                        .map(n => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "AB"}
                </div>
              )}

              <span className="text-sm font-medium text-gray-700">
                {blogdata.author?.username ?? "Unknown Author"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-center text-gray-900 mb-8">
              {blogdata.title}
            </h1>

            {/* Cover Image */}
            {blogdata.image && (
              <div className="w-full rounded-lg overflow-hidden mb-10 shadow-sm">
                <div className="w-full h-64 md:h-96 bg-gray-100">
                  <img
                    src={blogdata.image}
                    alt={blogdata.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none mx-auto text-gray-700">
              {sanitizedContent ? (
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
              ) : (
                <>
                  <p>
                    This post is authored by <strong>{blogdata.author?.username}</strong> and categorized under{" "}
                    <strong>{blogdata.category?.name ?? "General"}</strong>.
                  </p>

                  <h2>About this post</h2>
                  <p>
                    There is no article content stored for this post yet — use the editor to add a description or full content.
                  </p>

                  <h3>Quick metadata</h3>
                  <ul>
                    <li><strong>Slug:</strong> {blogdata.slug}</li>
                    <li><strong>Created:</strong> {moment(blogdata.createdAt).format("DD MMM YYYY, hh:mm A")}</li>
                  </ul>
                </>
              )}

              {/* Optional call to action */}
              <div className="mt-8">
                <a
                  href="#"
                  className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-md shadow hover:bg-indigo-700 transition"
                >
                  Read more posts
                </a>
              </div>
            </div>
          </article>
        ) : (
          !loading && (
            <div className="text-center py-20 text-gray-500">
              Blog not found or no data available.
            </div>
          )
        )}
      </main>

      {/* Comment section (pass blog _id) */}
      <CommentSection props={blogdata?._id} />

      {/* Related blog (pass category and id) */}
      <RelatedBlog props={{ category, id }} />
    </div>
  );
};

export default SingleBlog;
