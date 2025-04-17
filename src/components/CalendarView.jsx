import React, { useState } from "react";
import WorkoutForm from "./WorkoutForm";
import {
  isToday,
  format,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
} from "date-fns";
import { monthsInQuarter } from "date-fns/constants";
export default function CalendarView({ workout }) {
  const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay();
  console.log(currentDate);
  console.log({ workout });
  return (
    <>
      <div>CalendarView</div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {daysOfWeek.map((day) => (
          <div className="text-center ">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 w-full">
        {daysInMonth.map((day) => {
          const date = format(day, "yyyy-MM-dd");

          //fix the logic in ordering current date at top
          return (
            <div
              className={`text-center font-small h-[150px] overflow-hidden text-sm py-1
                aspect-square w-full border rounded-md ${
                  isToday(day) ? "bg-blue-50 font-bold" : "bg-white"
                }`}
            >
              <div className="text-center mb-1">
                {isToday(day) ? "TODAY" : date}
              </div>
              <div className="h-[calc(100%)] overflow-y-auto p-1">
                {workout.length > 0 ? (
                  <div className="space-y-1">
                    {workout.map((item, index) =>
                      date == item.date ? (
                        <div key={index} className="mb-6 last:mb-0">
                          <h7 className="text-l font-bold text-gray-800">
                            {item.name}
                          </h7>
                          <li className="text-gray-600">
                            Weight: {item.weight} lbs
                          </li>
                          <li className="text-gray-600">Sets: {item.sets}</li>
                          <li className="text-gray-600">Reps: {item.reps}</li>
                          <button>Edit </button>
                        </div>
                      ) : (
                        <p>{null}</p>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    No workouts recorded yet
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
