import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "axios";
export default function Profile() {
  const { user } = useAuth(); // currently logged in user
  const { userId } = useParams(); //user id from url

  console.log(user);
  const [editProfile, setEditProfile] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followList, setFollowList] = useState([]);
  //check if user is viewing their own profile
  const isOwnProfile = !userId || userId === user?.id;

  const displayUser = isOwnProfile ? user : profileUser;
  // console.log(user, editProfile);

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
        const targetUserId = isOwnProfile ? user?.id : userId;
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
    if (user?.id) {
      fetchUserPosts();
    }
  }, [user, userId, isOwnProfile]);
  //console.log(userPosts);
  const handleFollow = async () => {
    try {
      console.log("try to follow user:", displayUser._id);
      const token = localStorage.getItem("token");
      console.log("Using token:", token); // Debug
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
  console.log("test", followList);
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
                  name="name"
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <input
                  placeholder="Email"
                  name="email"
                  className="w-full p-2 border rounded"
                />
              </label>
              {/* <label className="block text-gray-700 text-sm font-bold mb-2">
                <input
                  placeholder="Gender"
                  name="gender"
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <input
                  placeholder="Weight"
                  name="weight"
                  className="w-full p-2 border rounded"
                />
              </label>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <input
                  placeholder="Height"
                  name="height"
                  className="w-full p-2 border rounded"
                />
              </label> */}
            </>
          ) : isOwnProfile ? (
            <>
              <h2 className="text-2xl font-semibold mb-2">
                {displayUser?.name}
              </h2>

              <p className="text-gray-600 mb-1">Email | {displayUser?.email}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-2">
                Check out {displayUser?.name}'s posts!
              </h2>
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
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Save
                </button>
              )}
            </div>
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
                      onClick={() => handleDelete(post._id)}
                      className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                    <button className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition">
                      Edit
                    </button>
                  </div>
                )}
                <p className="text-gray-800 text-sm line-clamp-4">
                  {post.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="container mx-auto px-4 pb-8">
        <h3 className="text-2xl font-bold mb-8 text-center">Following</h3>
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md mx-auto">
          {followList.map((user, i) => (
            <ul>{user.name}</ul>
          ))}
        </div>
      </div>
    </div>
  );
}
