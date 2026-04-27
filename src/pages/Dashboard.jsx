import WorkoutForm from "../components/WorkoutForm";
import Navbar from "../components/Navbar";
import CalendarView from "../components/CalendarView";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
export default function Dashboard({ workout, fullUser, fetchUser }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("/");
  const [showForm, setShowForm] = useState(false);
  const date = new Date();
  const welcomeText = `Welcome ${user.name}, begin tracking today!`;
  return (
    <div className="bg-gray-100 min-h-screen px-4 pt-[80px] pb-8">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-400">this week</p>
            <p className="text-xl font-medium mt-1">
              {
                fullUser.filter((w) => {
                  const d = new Date(w.date);
                  const now = new Date();
                  const weekAgo = new Date(now.setDate(now.getDate() - 7));
                  return d >= weekAgo;
                }).length
              }{" "}
              workouts
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-400">total logged</p>
            <p className="text-xl font-medium mt-1">
              {fullUser.length} workouts
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-400">welcome back</p>
            <p className="text-xl font-medium mt-1">
              {user.name.split(" ")[0]}
            </p>
          </div>
        </div>

        {/* Calendar */}
        <CalendarView
          workout={workout}
          fullUser={fullUser}
          fetchUser={fetchUser}
        />
      </div>
    </div>
  );
}
