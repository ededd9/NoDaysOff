import WorkoutForm from "../components/WorkoutForm";
import Navbar from "../components/Navbar";
import CalendarView from "../components/CalendarView";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
export default function Dashboard({ workout }) {
  const [activeTab, setActiveTab] = useState("/");
  const [showForm, setShowForm] = useState(false);
  const date = new Date();

  return (
    <>
      <div className="pt-16 min-h-screen flex flex-col items-center justify-start">
        <div className="w-full max-w-4xl px-4 py-8">
          {workout.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              {workout.map((item, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <h3 className="text-xl font-bold text-gray-800">
                    Name: {item.name}
                  </h3>
                  <p className="text-gray-600">Weight: {item.weight} lbs/kg</p>
                  <p className="text-gray-600">Sets: {item.sets}</p>
                  <p className="text-gray-600">Reps: {item.reps}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              No workouts recorded yet
            </p>
          )}

          <div className="text-center text-gray-700">
            <h1 className="text-2xl font-semibold">
              Today's Date: {date.toLocaleDateString()}
            </h1>
          </div>
        </div>
        <CalendarView />
      </div>
    </>
  );
}
