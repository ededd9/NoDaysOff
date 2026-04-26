import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "axios";
export default function Feed() {
  //states
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [creatingPost, setCreatingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [filters, setFilters] = useState({
    popular: false,
    following: false,
  });
  //context
  const { user } = useAuth();
  if (!user) {
    return <div>Loading..</div>;
  }
  const token = localStorage.getItem("token");

  const toggleModal = () => {
    setCreatingPost(!creatingPost);
  };

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("token");
        // const response = await axios.get(
        //   `http://localhost:5050/api/posts/feed`,
        //   {
        //     headers: { Authorization: `Bearer ${token}` },
        //     withCredentials: true,
        //   }
        // );
        //condesed it by destructuring {data}, don't have to use 'response.data.data'
        const { data } = await axios.get(
          `http://localhost:5050/api/posts/feed`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          },
        );
        //error in retrieving data, return
        if (data.status !== "success") return;
        let processedPosts = [...data.data];

        if (filters.popular) {
          processedPosts = processedPosts.sort(
            (a, b) => b.likes.length - a.likes.length,
          );
        }
        if (filters.following) {
          const followedUsersResponse = await axios.get(
            `http://localhost:5050/api/users/${user._id}/following`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            },
          );
          let followedUsers = followedUsersResponse.data.map(
            (user) => user._id,
          );
          console.log("followed users ids: ", followedUsers);
          console.log("before processed posts: ", processedPosts[11].user._id);

          processedPosts = processedPosts.filter(
            (post) => post.user && followedUsers.includes(post.user._id),
          );
          console.log("after processed posts: ", processedPosts);
        }
        //set the selected filters
        setPosts(processedPosts);
      } catch (err) {
        console.log("Failed to load feed", err);
      }
    };
    fetchFeed();
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
        },
      );

      setPosts((prev) => [data, ...prev]);
      setPostContent("");
    } catch (err) {
      console.log("Cannot create a post", err);
    }
  };

  const handleDelete = async (id) => {
    const prevPosts = [...posts];
    try {
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      await axios.delete(`http://localhost:5050/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: "true",
      });
      console.log("Deleted successfully.");
    } catch (err) {
      setPosts(prevPosts);
      console.log(err);
    }
  };
  // console.log("Posts:", posts);
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
        },
      );
      //if can access like endpoint, check if the current post id matches the
      //post the user is trying to like , update only the like attribute of the post, if not, then
      //dont modify the post at all and return it
      if (response.data.status === "success") {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === id
              ? { ...post, likes: response.data.data.likes }
              : post,
          ),
        );
      }
    } catch (err) {
      console.log("Error in liking post: ", err);
    }
  };
  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditedContent(post.content);
  };

  const handleSaveEdit = async (postId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5050/api/posts/${postId}`,
        { content: editedContent },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, content: editedContent } : post,
        ),
      );
      setEditingPostId(null);
      setEditedContent("");
    } catch (err) {
      console.log("Error updating post: ", err);
    }
  };
  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      {/* Main Grid Container */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (1/3 width) */}
        <div className="lg:col-span-1 space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                What's on your mind, {user ? user.name.split(" ")[0] : null}?
              </h4>
              <textarea
                placeholder="Write something..."
                className="w-full p-3 border border-gray-100 rounded-lg mb-2 text-sm resize-none"
                rows="3"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                maxLength={1000}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {postContent.length}/1000
                </span>
                <button className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-4 py-1.5 rounded-lg hover:bg-blue-100 transition">
                  Post
                </button>
              </div>
            </div>
          </form>

          <div className="bg-white p-4 rounded-lg border border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Filters</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
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
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={filters.following}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      following: e.target.checked,
                    }))
                  }
                />
                Following
              </label>
            </div>
          </div>
        </div>

        {/* Right Column (2/3 width) - Posts Feed */}
        <div className="lg:col-span-2 space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-sm transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <Link
                  to={`/Profile/${post.user?._id}`}
                  className="flex-shrink-0"
                >
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-sm font-medium">
                    {post.user?.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <div className="flex flex-col justify-center leading-none">
                  <h5 className="text-sm font-medium m-0 p-0">
                    {post.user?.name}
                  </h5>
                  <p className="text-xs text-gray-400 m-0 p-0 mt-1">
                    {new Date(post.createdAt).toLocaleString("en-US", {
                      timeZone: "America/New_York",
                    })}
                  </p>
                </div>
              </div>

              {editingPostId === post._id ? (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-2 border rounded text-sm mb-3"
                />
              ) : (
                <p className="text-sm text-gray-800 mb-3">{post.content}</p>
              )}

              <hr className="border-gray-100 mb-3" />

              <div className="flex gap-2">
                <button
                  onClick={() => handleLike(post._id)}
                  className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-md hover:bg-green-100 transition"
                >
                  🤍 {post.likes.length}
                </button>

                {user?._id === post.user?._id && (
                  <>
                    {editingPostId === post._id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(post._id)}
                          className="text-xs bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-md hover:bg-green-100 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingPostId(null);
                            setEditedContent("");
                          }}
                          className="text-xs bg-gray-50 text-gray-600 border border-gray-100 px-2 py-1 rounded-md hover:bg-gray-100 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded-md hover:bg-blue-100 transition"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded-md hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
