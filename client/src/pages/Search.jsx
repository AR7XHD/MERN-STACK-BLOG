import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFetch } from '@/hooks/usefetch'
import { getEnv } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import BlogCard from '@/components/BlogCard'

const Search = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query");

  const SearchResponse = useFetch(
    `${getEnv("VITE_BASE_URL")}/blog/search?query=${searchQuery}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  const { data, loading, error } = SearchResponse;
  return (
    <div className="px-6 py-10">
      {loading && <Loading />}
      {error && <div className="text-red-500">{String(error)}</div>}

      {!loading && (
        <>
          <h2 className="text-xl font-semibold mb-6">
            Search Results for: <span className="text-purple-600">{searchQuery}</span>
          </h2>

          {data?.blog?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.blog.map((blog, index) => (
                <BlogCard post={blog} key={index} />
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No results found.</div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
