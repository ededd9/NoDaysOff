import { useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
export default function AIChatModal({ onClose, workoutData }) {
  const [userQuery, setUserQuery] = useState("");
  const { user } = useAuth();
  console.log("GOT THE DATA, ", workoutData);
  console.log("USER: ", user);
  const sendQueryToAI = () => {
    console.log(userQuery);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">AI Chat Assistant</h2>
          <p className="text-blue-100">What can I help you with today?</p>
        </div>

        <div className="p-6">
          <textarea
            placeholder="Can you recommend me a workout for building strength? Or ask me anything about fitness..."
            className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-base"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
          />

          <div className="flex gap-3 mt-6">
            <button
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              onClick={() => sendQueryToAI()}
            >
              Send Message
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
