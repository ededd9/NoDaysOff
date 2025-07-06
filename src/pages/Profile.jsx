import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
export default function Profile() {
  const { user, login } = useAuth(); // currently logged in user
  const { userId } = useParams(); //user id from url
  const token = localStorage.getItem("token");
  const [editProfile, setEditProfile] = useState(false);
  const [editingPost, setEditingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followList, setFollowList] = useState([]);
  //check if user is viewing their own profile
  const isOwnProfile = !userId || userId === user._id;
  const displayUser = isOwnProfile ? user : profileUser;
  const [formData, setFormData] = useState({});
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        //viewing another users profile, fetch their data, set the profile user state to the viewed users data
        if (!isOwnProfile) {
          const response = await axios.get(
            `http://localhost:5050/api/users/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          setProfileUser(response.data);
        }
        const followResponse = await axios.get(
          `http://localhost:5050/api/users/${userId}/is-following`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setIsFollowing(followResponse.data.isFollowing);
        //setUserPosts(response.data);
        //console.log(userPosts);
        //grab the targetted user id posts , whether it be the own user or someone elses
        //already have own users data, so need data of the profile user is viewing
        const targetUserId = isOwnProfile ? user._id : userId;
        const postResponse = await axios.get(
          `http://localhost:5050/api/posts/user/${targetUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setUserPosts(postResponse.data);

        const followingResponse = await axios.get(
          `http://localhost:5050/api/users/${targetUserId}/following`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setFollowList(followingResponse.data);
      } catch (err) {
        console.log("Failed to load posts: ", err);
      }
    };
    //only fetch user/post data if llogged in user exists
    if (user && user._id && token) {
      fetchUserPosts();
    }
  }, [user, userId, isOwnProfile]);
  useEffect(() => {
    if (displayUser) {
      setFormData({
        name: displayUser.name || "",
        email: displayUser.email || "",
        bio: displayUser.bio || "",
      });
    }
  }, [displayUser]);
  //console.log(userPosts);
  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `http://localhost:5050/api/users/${displayUser._id}/follow`,
        {}, // empty data object
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.status === "success") {
        setIsFollowing(response.data.following);
        console.log(`Successfully ${response.data.action} user`);
      }
    } catch (err) {
      console.log("Error in following or unfollowing user:", err);
    }
  };
  const handleDelete = async (id) => {
    const prevPosts = [...userPosts];
    try {
      setUserPosts(userPosts.filter((post) => post._id !== id));
      await axios.delete(`http://localhost:5050/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: "true",
      });
      console.log("Success");
    } catch (err) {
      setUserPosts(prevPosts);
      console.log("Error in deleting post: ", err);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5050/api/users/${user._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      const updatedUser = response.data;
      login(updatedUser);
      setEditProfile(false);
      if (!isOwnProfile) {
        setProfileUser(updatedUser);
      }
    } catch (err) {
      console.log("Update failed ", err);
    }
  };
  const handleSaveEdit = async (postId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5050/api/posts/${postId}`,
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, content: editedContent } : post
        )
      );
      setEditingPostId(null);
      setEditedContent("");
    } catch (err) {
      console.log("Error updating post: ", err);
    }
  };
  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setEditedContent(post.content);
  };
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
        setUserPosts((prevPosts) =>
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
      {/* Profile Section - Top of page under navbar */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto mb-12">
          {editProfile && isOwnProfile ? (
            <>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <input
                  placeholder={displayUser?.name}
                  onChange={handleChange}
                  value={formData.name}
                  name="name"
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <input
                  placeholder="Email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <input
                  placeholder="Bio"
                  name="bio"
                  onChange={handleChange}
                  value={formData.bio}
                  className="w-full p-2 border rounded"
                />
              </label>
            </>
          ) : isOwnProfile ? (
            <>
              <h2 className="text-2xl font-semibold mb-2">
                {displayUser?.name}
              </h2>
              <h3>{displayUser?.bio}</h3>

              <p className="text-gray-600 mb-1">Email | {displayUser?.email}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-2">
                {displayUser?.name}'s posts!
              </h2>
              <h5>{displayUser?.bio ? displayUser?.bio : "No bio"} </h5>

              <button
                onClick={() => handleFollow()}
                className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition"
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            </>
          )}

          {isOwnProfile && (
            <div className="mt-4 space-x-2">
              <button
                onClick={() => setEditProfile(!editProfile)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editProfile ? "Cancel" : "Edit"}
              </button>
              {editProfile && (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleUpdate}
                >
                  Save
                </button>
              )}
            </div>
          )}
        </div>
        <div className="container mx-auto px-4 pb-8">
          <h3 className="text-2xl font-bold mb-8 text-center">Following</h3>

          {followList.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4">
              {followList.map((user, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-lg shadow-md text-center w-60"
                >
                  <Link
                    to={`/Profile/${user._id}`}
                    style={{ textDecoration: "none" }}
                    className="flex items-center gap-3 no-underline"
                  >
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No one yet :)</p>
          )}
        </div>
      </div>
      {/* Posts Section - 4x4 Grid */}
      <div className="container mx-auto px-4 pb-8">
        <h3 className="text-2xl font-bold mb-8 text-center">
          {isOwnProfile ? "Your posts" : `${displayUser?.name}'s posts`}
        </h3>

        {userPosts.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md mx-auto">
            <p className="text-gray-500">
              {isOwnProfile ? "Start posting !" : "No Posts Yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">
                      {displayUser?.name}
                    </h4>
                    <p className="text-gray-500 text-xs">
                      {" "}
                      {new Date(post.createdAt).toLocaleString("en-US", {
                        timeZone: "America/New_York",
                      })}
                    </p>
                  </div>
                </div>

                {isOwnProfile && (
                  <div className="flex space-x-1 mb-3">
                    <button
                      onClick={() => handleLike(post._id)}
                      className="text-xs bg-green-100 text-green-600 px-1 py-1 rounded hover:bg-green-200 transition"
                    >
                      🤍
                      {post.likes.length}
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                    {editingPostId === post._id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(post._id)}
                          className="text-xs bg-green-100 text-green-600 px-1 py-1 rounded hover:bg-green-200 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingPostId(null);
                            setEditedContent("");
                          }}
                          className="text-xs bg-gray-100 text-gray-600 px-1 py-1 rounded hover:bg-gray-200 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                )}
                {editingPostId === post._id ? (
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                ) : (
                  <p className="text-gray-800 text-sm line-clamp-4">
                    {post.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
