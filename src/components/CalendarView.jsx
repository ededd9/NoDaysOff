import React from "react";
import WorkoutForm from "./WorkoutForm";
export default function CalendarView() {
  const daysOfWeek = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDate = new Date();
  const currentDayIndex = currentDate.getDay();
  const adjustedCurrentDayIndex =
    currentDayIndex === 0 ? 6 : currentDayIndex - 1;
  return (
    <>
      <div>CalendarView</div>
      <div className="grid grid-cols-1 gap-4 mb-2">
        {daysOfWeek.map((num, index) => {
          //fix the logic in ordering current date at top
          const difference = index - adjustedCurrentDayIndex;
          const date = new Date(currentDate);
          date.setDate(currentDate.getDate() + difference);
          return (
            <>
              <div
                className="text-center font-medium text-sm py-1
                aspect-square w-full border rounded-md p-10"
              >
                {date.toLocaleDateString()}
              </div>
              {/* <WorkoutForm /> */}
            </>
          );
        })}
      </div>
    </>
  );
}
