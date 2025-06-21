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
  let token = localStorage.getItem("token");
  //context
  const { user } = useAuth();

  const toggleModal = () => {
    setCreatingPost(!creatingPost);
  };
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5050/api/posts/feed`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        if (response.data.status === "success") {
          setPosts(response.data.data);
        }
      } catch (err) {
        console.log("Failed to load feed", err);
      }
    };
    fetchFeed();
  }, []);
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
              />
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
                <input type="checkbox" className="mr-2" />
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
