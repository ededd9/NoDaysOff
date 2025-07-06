import React, { useState, useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
export default function Progress({ fullUser }) {
  const [filteredDateStart, setFilteredDateStart] = useState("");
  const [filteredDateEnd, setFilteredDateEnd] = useState("");
  const [filter, setFilter] = useState(false);
  const [appliedWorkoutNames, setAppliedWorkoutNames] = useState([]);
  const [appliedDateStart, setAppliedDateStart] = useState("");
  const [appliedDateEnd, setAppliedDateEnd] = useState("");
  let maxmaxWeight = 500;
  //console.log(fullUser);
  const workouts = fullUser.map((workout) => workout.exercises);
  //console.log("WORKOUTS", workouts);
  let workoutNames = [];
  const [selectedWorkoutNames, setSelectedWorkoutNames] = useState([]);
  fullUser.forEach((log) => {
    log.exercises.forEach((ex) => {
      workoutNames.push(ex.name);
    });
  });
  const handleSelectedWorkouts = (exercise) => {
    setSelectedWorkoutNames((prev) =>
      prev.includes(exercise)
        ? prev.filter((name) => name !== exercise)
        : [...prev, exercise]
    );
  };
  const data = new Map();
  //logic in creating a map data object
  fullUser.forEach((log) => {
    const logDate = new Date(log.date).toISOString().split("T")[0];
    const isDataInRange =
      !filter ||
      ((!appliedDateStart || appliedDateStart <= logDate) &&
        (!appliedDateEnd || logDate <= appliedDateEnd));
    log.exercises.forEach((ex) => {
      const key = ex.name;

      const isSelectedWorkout =
        appliedWorkoutNames.length === 0 || appliedWorkoutNames.includes(key);
      if (isDataInRange && isSelectedWorkout) {
        const weights = ex.sets.map((set) => set.weight);
        //console.log("weights:", weights);
        const maxWeight = Math.max(...weights);

        if (!data.has(key)) {
          data.set(key, []);
        }

        data.get(key).push({ x: logDate, y: maxWeight });
      }
    });
  });
  //only get unique exercise names
  const workoutNameSet = new Set(workoutNames);
  //change it back to an array
  workoutNames = [...workoutNameSet];
  // console.log(
  //   "data being manipulated into libraries perferred structure ",
  //   data
  // );
  const finalData = Array.from(data, ([name, points]) => ({
    id: name,
    data: points,
  }));
  // console.log(
  //   "final form of data after being manipulated into libraries perferred structure ",
  //   finalData
  // );

  // console.log(filteredDateEnd, filteredDateStart);
  // console.log("NAMES", workoutNames);
  // console.log("selected", selectedWorkoutNames);

  return (
    <>
      <div className=" bg-gray-100 px-4 pt-[80px] flex items-center justify-center">
        <div
          className="p-6 rounded-lg shadow-xl w-[95%] h-[400px] max-w-2xl"
          style={{ backgroundColor: "#778da9" }}
        >
          <div>
            <h1>Filters</h1>
            <h3>Date Selection</h3>
            <label>Start Date:</label>
            <input
              placeholder="Start"
              type="date"
              name="dateTo"
              value={filteredDateStart}
              onChange={(e) => setFilteredDateStart(e.target.value)}
              className=" mt-2 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-black-800 text-xs font-medium rounded-md transition-colors shadow-sm"
            ></input>
            <label>End Date:</label>
            <input
              placeholder="End"
              type="date"
              name="dateFrom"
              value={filteredDateEnd}
              onChange={(e) => setFilteredDateEnd(e.target.value)}
              className=" mt-2 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-black-800 text-xs font-medium rounded-md transition-colors shadow-sm"
            ></input>

            <button
              onClick={() => {
                if (filter) {
                  setSelectedWorkoutNames([]);
                  setFilteredDateStart("");
                  setFilteredDateEnd("");
                  setAppliedWorkoutNames([]);
                  setAppliedDateStart("");
                  setAppliedDateEnd("");
                } else {
                  setAppliedWorkoutNames(selectedWorkoutNames);
                  setAppliedDateStart(filteredDateStart);
                  setAppliedDateEnd(filteredDateEnd);
                }
                setFilter(!filter);
              }}
              className={`
    mt-2 px-2 py-1 text-xs font-medium rounded-md transition-colors shadow-sm
    ${
      filter
        ? "bg-cyan-200 hover:bg-green-300 text-white-900"
        : "bg-blue-100 hover:bg-blue-200 text-white-800"
    }
  `}
            >
              {filter ? "Filtered" : "Unfiltered"}
            </button>
          </div>
          <h3>Workout Selection</h3>
          <div
            className="overflow-y-auto h-[150px] w-[400px] rounded-md"
            style={{ backgroundColor: "#e0e1dd" }}
          >
            {workoutNames.map((exercise, i) => {
              return (
                <label className="block px-2 py-1" key={i}>
                  <p>
                    {exercise}
                    <input
                      type="checkbox"
                      checked={selectedWorkoutNames.includes(exercise)}
                      onChange={() => handleSelectedWorkouts(exercise)}
                    />
                  </p>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full h-[800px] mx-4">
          <ResponsiveLine /* or Line for fixed dimensions */
            data={finalData}
            margin={{ top: 50, right: 200, bottom: 50, left: 60 }}
            yScale={{
              type: "linear",
              min: "0",
              max: maxmaxWeight,
              stacked: false,
              reverse: false,
            }}
            axisBottom={{
              legend: "Weight in pounds ( lbs )",
              legendOffset: 36,
            }}
            axisLeft={{ legend: "Exercises", legendOffset: -40 }}
            pointSize={12}
            pointColor={{ theme: "background" }}
            pointBorderWidth={4}
            pointBorderColor={{ from: "seriesColor" }}
            pointLabelYOffset={-2}
            enableTouchCrosshair={true}
            useMesh={true}
            legends={[
              {
                anchor: "top-right",
                direction: "column",
                translateX: 90,
                itemWidth: 50,
                itemHeight: 42,
                symbolShape: "circle",
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
