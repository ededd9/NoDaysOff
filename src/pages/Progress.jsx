import React, { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
export default function Progress({ fullUser }) {
  const [filteredDateStart, setFilteredDateStart] = useState("");
  const [filteredDateEnd, setFilteredDateEnd] = useState("");
  console.log(fullUser);
  const workouts = fullUser.map((workout) => workout.exercises);
  console.log(workouts);
  //   //console.log(names);
  //   const weights = workouts.flat().map((weight) => weight.weight);
  //   console.log(weights);
  const data = new Map();
  fullUser.forEach((log) => {
    const logDate = new Date(log.date).toISOString().split("T")[0];
    console.log(logDate);
    log.exercises.forEach((ex) => {
      const key = ex.name;
      console.log("name: ", key);
      const weight = ex.sets.map((set) => set.weight);
      console.log(weight);
      const maxWeight = Math.max(...weight);

      console.log("weight", weight);
      if (!data.has(key)) {
        data.set(key, []);
      }
      data.get(key).push({ x: logDate, y: maxWeight });
    });
  });

  console.log(data);
  const finalData = Array.from(data, ([name, points]) => ({
    id: name,
    data: points,
  }));
  console.log(finalData);
  //   const data = [
  //     {
  //       id: "japan",
  //       data: [
  //         {
  //           x: "plane",
  //           y: 281,
  //         },
  //         {
  //           x: "helicopter",
  //           y: 40,
  //         },
  //         {
  //           x: "boat",
  //           y: 131,
  //         },
  //         {
  //           x: "train",
  //           y: 34,
  //         },
  //         {
  //           x: "subway",
  //           y: 76,
  //         },
  //         {
  //           x: "bus",
  //           y: 294,
  //         },
  //         {
  //           x: "car",
  //           y: 169,
  //         },
  //         {
  //           x: "moto",
  //           y: 112,
  //         },
  //         {
  //           x: "bicycle",
  //           y: 98,
  //         },
  //         {
  //           x: "horse",
  //           y: 279,
  //         },
  //         {
  //           x: "skateboard",
  //           y: 35,
  //         },
  //         {
  //           x: "others",
  //           y: 172,
  //         },
  //       ],
  //     },
  //     {
  //       id: "france",
  //       data: [
  //         {
  //           x: "plane",
  //           y: 20,
  //         },
  //         {
  //           x: "helicopter",
  //           y: 202,
  //         },
  //         {
  //           x: "boat",
  //           y: 124,
  //         },
  //         {
  //           x: "train",
  //           y: 23,
  //         },
  //         {
  //           x: "subway",
  //           y: 196,
  //         },
  //         {
  //           x: "bus",
  //           y: 82,
  //         },
  //         {
  //           x: "car",
  //           y: 267,
  //         },
  //         {
  //           x: "moto",
  //           y: 65,
  //         },
  //         {
  //           x: "bicycle",
  //           y: 14,
  //         },
  //         {
  //           x: "horse",
  //           y: 168,
  //         },
  //         {
  //           x: "skateboard",
  //           y: 39,
  //         },
  //         {
  //           x: "others",
  //           y: 179,
  //         },
  //       ],
  //     },
  //     {
  //       id: "us",
  //       data: [
  //         {
  //           x: "plane",
  //           y: 99,
  //         },
  //         {
  //           x: "helicopter",
  //           y: 241,
  //         },
  //         {
  //           x: "boat",
  //           y: 268,
  //         },
  //         {
  //           x: "train",
  //           y: 250,
  //         },
  //         {
  //           x: "subway",
  //           y: 174,
  //         },
  //         {
  //           x: "bus",
  //           y: 282,
  //         },
  //         {
  //           x: "car",
  //           y: 129,
  //         },
  //         {
  //           x: "moto",
  //           y: 138,
  //         },
  //         {
  //           x: "bicycle",
  //           y: 249,
  //         },
  //         {
  //           x: "horse",
  //           y: 162,
  //         },
  //         {
  //           x: "skateboard",
  //           y: 19,
  //         },
  //         {
  //           x: "others",
  //           y: 187,
  //         },
  //       ],
  //     },
  //     {
  //       id: "germany",
  //       data: [
  //         {
  //           x: "plane",
  //           y: 162,
  //         },
  //         {
  //           x: "helicopter",
  //           y: 282,
  //         },
  //         {
  //           x: "boat",
  //           y: 224,
  //         },
  //         {
  //           x: "train",
  //           y: 85,
  //         },
  //         {
  //           x: "subway",
  //           y: 174,
  //         },
  //         {
  //           x: "bus",
  //           y: 19,
  //         },
  //         {
  //           x: "car",
  //           y: 24,
  //         },
  //         {
  //           x: "moto",
  //           y: 265,
  //         },
  //         {
  //           x: "bicycle",
  //           y: 110,
  //         },
  //         {
  //           x: "horse",
  //           y: 250,
  //         },
  //         {
  //           x: "skateboard",
  //           y: 50,
  //         },
  //         {
  //           x: "others",
  //           y: 90,
  //         },
  //       ],
  //     },
  //     {
  //       id: "norway",
  //       data: [
  //         {
  //           x: "plane",
  //           y: 31,
  //         },
  //         {
  //           x: "helicopter",
  //           y: 102,
  //         },
  //         {
  //           x: "boat",
  //           y: 270,
  //         },
  //         {
  //           x: "train",
  //           y: 112,
  //         },
  //         {
  //           x: "subway",
  //           y: 164,
  //         },
  //         {
  //           x: "bus",
  //           y: 183,
  //         },
  //         {
  //           x: "car",
  //           y: 225,
  //         },
  //         {
  //           x: "moto",
  //           y: 39,
  //         },
  //         {
  //           x: "bicycle",
  //           y: 252,
  //         },
  //         {
  //           x: "horse",
  //           y: 267,
  //         },
  //         {
  //           x: "skateboard",
  //           y: 41,
  //         },
  //         {
  //           x: "others",
  //           y: 4,
  //         },
  //       ],
  //     },
  //   ];
  console.log(filteredDateEnd, filteredDateStart);
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full h-[600px] mx-4">
          <div>
            <h1>Choose Dates</h1>
            <input
              placeHolder="Start"
              type="date"
              name="dateTo"
              value={filteredDateStart}
              onChange={(e) => setFilteredDateStart(e.target.value)}
            ></input>
            <input
              placeHolder="End"
              type="date"
              name="dateFrom"
              value={filteredDateEnd}
              onChange={(e) => setFilteredDateEnd(e.target.value)}
            ></input>
          </div>
          <ResponsiveLine /* or Line for fixed dimensions */
            data={finalData}
            margin={{ top: 50, right: 200, bottom: 50, left: 60 }}
            yScale={{
              type: "linear",
              min: "0",
              max: "500",
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
