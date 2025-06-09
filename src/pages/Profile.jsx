import React, { useContext, useState } from "react";
import { useAuth } from "../context/authContext";
export default function Profile() {
  const { user } = useAuth();
  const [editProfile, setEditProfile] = useState(false);
  console.log(user, editProfile);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
          {editProfile ? (
            <>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <input placeholder={user.name} name="name"></input>
              </label>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <input placeholder="Email" name="email"></input>
              </label>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <input placeholder="Gender" name="gender"></input>
              </label>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <input placeholder="Weight" name="weight"></input>
              </label>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <input placeholder="Height" name="height"></input>
              </label>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-2">{user?.name}</h2>
              <p className="text-gray-600 mb-1">Email | {user?.email}</p>
              <p className="text-gray-600 mb-1">Gender | </p>
              <p className="text-gray-600 mb-1">Weight |</p>
              <p className="text-gray-600 mb-1">Height |</p>{" "}
            </>
          )}

          <div>
            <button onClick={() => setEditProfile(true)}>Edit</button>
            <button>Save</button>
          </div>
        </div>
      </div>
    </>
  );
}
