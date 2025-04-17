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
        <div className="text-center text-gray-700">
          <h1 className="text-2xl font-semibold">
            Today's Date: {date.toLocaleDateString()}
          </h1>
        </div>
        {/* </div> */}
        <CalendarView workout={workout} />
      </div>
    </>
  );
}
