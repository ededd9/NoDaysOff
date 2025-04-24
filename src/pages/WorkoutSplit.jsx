import React, { useState } from "react";

export default function WorkoutSplit({ split, setSplit }) {
  return (
    <div className="min-h-screen p-4">
      <div className="flex justify-center mb-8">
        <h2 className="text-2xl font-bold">WorkoutSplit Page</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-gray-100 p-4 rounded-lg">
          <p className="mb-4">Current split:</p>
          <div className="bg-white p-3 rounded shadow">
            <h3 className="font-semibold">Current Split:</h3>
            <p>{split}</p>
          </div>
        </div>

        <div className="flex-1 bg-gray-100 p-4 rounded-lg">
          <label className="block mb-2 font-medium">Select Split:</label>
          <select
            required
            className="w-full p-2 border rounded-md"
            value={split}
            onChange={(e) => setSplit(e.target.value)}
          >
            <option>Push / Pull / Legs</option>
            <option>Upper / Lower</option>
            <option>Full Body</option>
            <option>Bro Split</option>
          </select>
        </div>
      </div>
      <div className="flex-1 bg-gray-100 p-4 rounded-lg">
        <p className="mb-4">Upper A</p>
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold">Current Split:</h3>
          <p>{split}</p>
        </div>
      </div>
      <div className="flex-1 bg-gray-100 p-4 rounded-lg">
        <p className="mb-4">Lower A</p>
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold">Current Split:</h3>
          <p>{split}</p>
        </div>
      </div>
      <div className="flex-1 bg-gray-100 p-4 rounded-lg">
        <p className="mb-4">Upper B</p>
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold">Current Split:</h3>
          <p>{split}</p>
        </div>
      </div>
      <div className="flex-1 bg-gray-100 p-4 rounded-lg">
        <p className="mb-4">Lower B</p>
        <div className="bg-white p-3 rounded shadow">
          <h3 className="font-semibold">Current Split:</h3>
          <p>{split}</p>
        </div>
      </div>
    </div>
  );
}
