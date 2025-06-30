import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import CreateFeedPost from "../components/CreateFeedPost";
import axios from "axios";
export default function Feed() {
  //states
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [creatingPost, setCreatingPost] = useState(false);
  const [filters, setFilters] = useState({
    recent: false,
    popular: false,
    following: false,
  });
  //context
  const { user } = useAuth();

  const toggleModal = () => {
    setCreatingPost(!creatingPost);
  };
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("using token,", token);
        const response = await axios.get(
          `http://localhost:5050/api/posts/feed`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (response.data.status === "success") {
          if (filters.popular) {
            let popularPosts = response.data.data;
            let sortedP = response.data.data.sort(
              (a, b) => b.likes.length - a.likes.length
            );
            console.log("popular posts", popularPosts);
            console.log("sorted", sortedP);
            setPosts(sortedP);
          } else {
            setPosts(response.data.data);
          }
        }
      } catch (err) {
        console.log("Failed to load feed", err);
      }
    };
    fetchFeed();
    console.log("Refreshed feed since filters have been applied");
  }, [filters]);
  const handleSubmit = async (e) => {
    if (postContent === "") {
      alert("Can't post nothing !");
    }
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5050/api/posts",
        {
          content: postContent,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPosts((prev) => [data, ...prev]);
      setPostContent("");
    } catch (err) {
      console.log("Cannot create a post", err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5050/api/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: "true",
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      console.log("Deleted successfully.");
    } catch (err) {
      console.log(err);
    }
  };
  console.log("Posts:", posts);
  //console.log("current post added: ", postContent);
  //handle liking/unliking a post
  const handleLike = async (id) => {
    const token = localStorage.getItem("token");
    try {
      //url, data, config
      const response = await axios.put(
        `http://localhost:5050/api/posts/${id}/like`,
        {}, //not sending data so {}
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: "true",
        }
      );
      //if can access like endpoint, check if the current post id matches the
      //post the user is trying to like , update only the like attribute of the post, if not, then
      //dont modify the post at all and return it
      if (response.data.status === "success") {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === id
              ? { ...post, likes: response.data.data.likes }
              : post
          )
        );
      }
    } catch (err) {
      console.log("Error in liking post: ", err);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      {/* Main Grid Container */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Post Creation Card */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                What's on your mind {user ? user.name.split(" ")[0] : null}?
              </h2>
              <textarea
                placeholder="What's on your mind?"
                className="w-full p-3 border rounded-lg mb-4"
                rows="4"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                maxLength={1000}
              />
              <div className="text-sm text-gray-500 mb-1">
                {postContent.length < 1000
                  ? postContent.length
                  : "Cannot exceed 1000 characters"}
              </div>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                Post
              </button>
            </div>
          </form>

          {/* Filters Section */}
          <div className="bg-white p-6 rounded-lg shadow-md ">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Recent Posts
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.popular}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      popular: e.target.checked,
                    }))
                  }
                />
                Popular
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Following
              </label>
            </div>
          </div>
        </div>

        {/* Right Column (2/3 width) - Posts Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Example Posts */}
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Link to={`/Profile/${post.user._id}`}>
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                </Link>
                <div>
                  <h3 className="font-bold">{post.user.name.split(" ")[0]}</h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(post.createdAt).toLocaleString("en-US", {
                      timeZone: "America/New_York",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleLike(post._id)}
                  className="text-xs bg-green-100 text-green-600 px-1 py-1 rounded hover:bg-green-200 transition"
                >
                  🤍
                  {post.likes.length}
                </button>
              </div>
              {user && user.id === post.user._id && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-xs bg-red-100 text-red-600 px-1 py-1 rounded hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                  <button className="text-xs bg-blue-100 text-blue-600 px-1 py-1 rounded hover:bg-blue-200 transition">
                    Edit
                  </button>
                </div>
              )}

              <p>{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
