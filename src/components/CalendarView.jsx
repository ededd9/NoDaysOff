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
    <>
      <div className="space-x-2">
        <button
          className="
          mt-2 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium rounded-md transition-colors shadow-sm"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          Previous
        </button>
        <button
          className="
          mt-2 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium rounded-md transition-colors shadow-sm"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          Next
        </button>
        <button
          className="
          mt-2 px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium rounded-md transition-colors shadow-sm"
          onClick={() => setisAIModalOpen(true)}
        >
          AI Suggestions
        </button>
        {isAIModalOpen && (
          <AIChatModal
            onClose={() => setisAIModalOpen(false)}
            workoutData={workoutData}
          />
        )}
      </div>

      {/* <div className="grid grid-cols-7 gap-1 mb-1">
        {daysOfWeek.map((day, i) => (
          <div className="text-center " key={i}>
            {day}
          </div>
        ))}
      </div> */}
      <div className="grid grid-cols-7 gap-2 w-full">
        {daysInMonth.map((day, i) => {
          const date = format(day, "yyyy-MM-dd");

          //fix the logic in ordering current date at top
          return (
            <div
              key={i}
              className={`text-center cursor-pointer font-small h-[150px] overflow-hidden text-sm py-1
                aspect-square w-full border rounded-md ${
                  isToday(day)
                    ? "bg-blue-200 font-bold"
                    : fullUser.some((item) => date === item.date?.split("T")[0])
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              onClick={() => {
                const workoutsForDate = fullUser.filter(
                  (item) => date === item.date?.split("T")[0]
                );
                setSelectedDate(date);
                // console.log(
                //   `Inside Calendar View: Workouts for ${date}:`,
                //   workoutsForDate
                // );
                setIsModalOpen(true);
              }}
            >
              <div className="text-center mb-1">
                {isToday(day) ? "TODAY" : date}
              </div>
              <div
                className={`h-[calc(100%-30px)] overflow-y-auto p-1 pb-6 ${
                  fullUser.some((item) => date === item.date?.split("T")[0])
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                {format(day, "EEEE")}
              </div>
            </div>
          );
        })}
      </div>
      {isModalOpen && (
        <WorkoutModal
          workouts={selectedWorkouts}
          onClose={() => setIsModalOpen(false)}
          fetchUser={fetchUser}
        />
      )}
    </>
  );
}
