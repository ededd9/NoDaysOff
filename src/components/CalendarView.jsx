import React, { useEffect, useState } from "react";
import WorkoutForm from "./WorkoutForm";
import { useAuth } from "../context/authContext";
import AIChatModal from "./AIChatModal.jsx";
import axios from "axios";

import {
  isToday,
  parseISO,
  format,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { monthsInQuarter } from "date-fns/constants";
import WorkoutModal from "./WorkoutModal";
import EditForm from "./EditForm";

export default function CalendarView({ workout, fullUser, fetchUser }) {
  const token = localStorage.getItem("token");
  const [isEditing, setIsEditing] = useState(false);
  const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay();
  const [selectedDate, setSelectedDate] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setisAIModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setSelectedDate(null);
      setIsModalOpen(false);
      setIsEditing(false);
    }
    grabWorkoutData();
  }, [user]);
  //compute selected workouts b ased on selectedDate so find all workouts on the date of
  //ex 2025-05-05, if none found empty []
  const selectedWorkouts = selectedDate
    ? fullUser.filter((item) => item.date?.split("T")[0] === selectedDate)
    : [];

  //grabbing workout data for currently logged in user from backend api workouts to send to AI chatbox
  const [workoutData, setWorkoutData] = useState([]);
  const grabWorkoutData = async () => {
    try {
      const response = await axios.get(`http://localhost:5050/api/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (response.data.status === "success") {
        setWorkoutData(response.data.data);
      }
    } catch (error) {
      console.log("Error in fetching workouts for user");
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="text-xs bg-gray-50 text-gray-600 border border-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="text-xs bg-gray-50 text-gray-600 border border-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
          >
            Next
          </button>
          <button
            onClick={() => setisAIModalOpen(true)}
            className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
          >
            AI suggestions
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day, i) => (
          <div
            key={i}
            className="text-center text-xs text-gray-400 py-1 font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Empty cells before first day */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="rounded-lg min-h-[70px] bg-gray-50"
          />
        ))}

        {/* Day cells */}
        {daysInMonth.map((day, i) => {
          const date = format(day, "yyyy-MM-dd");
          const hasWorkout = fullUser.some(
            (item) => date === item.date?.split("T")[0],
          );
          const today = isToday(day);

          return (
            <div
              key={i}
              onClick={() => {
                setSelectedDate(date);
                setIsModalOpen(true);
              }}
              className={`rounded-lg min-h-[70px] p-2 cursor-pointer transition border ${
                today
                  ? "bg-blue-50 border-blue-100"
                  : hasWorkout
                    ? "bg-white border-green-100"
                    : "bg-white border-gray-100 hover:bg-gray-50"
              }`}
            >
              <p
                className={`text-xs font-medium ${today ? "text-blue-600" : "text-gray-700"}`}
              >
                {today ? "today" : format(day, "d")}
              </p>
              {hasWorkout && (
                <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                  workout
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {isAIModalOpen && (
        <AIChatModal
          onClose={() => setisAIModalOpen(false)}
          workoutData={workoutData}
        />
      )}
      {isModalOpen && (
        <WorkoutModal
          workouts={selectedWorkouts}
          onClose={() => setIsModalOpen(false)}
          fetchUser={fetchUser}
        />
      )}
    </div>
  );
}
