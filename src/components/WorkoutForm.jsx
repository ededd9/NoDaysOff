import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export default function WorkoutForm() {
  const [exercises, setExercises] = useState({
    name: "",
    weight: 0,
    reps: 0,
    sets: 0,
  });

  const [workout, setWorkout] = useState([]);
  //handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setWorkout([...workout, exercises]);
    setExercises({ name: "", weight: 0, reps: 0, sets: 0 });
  };
  console.log(workout);
  return (
    <>
      <div className="container mt-4">
        <div
          className="card p-4"
          style={{ maxWidth: "500px", margin: "0 auto" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Exercise Name</label>
              <input
                className="form-control"
                placeholder="e.g. Bench Press"
                value={exercises.name}
                onChange={(e) =>
                  setExercises((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Weight (lbs/kg)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 135"
                value={exercises.weight}
                onChange={(e) =>
                  setExercises((prev) => ({ ...prev, weight: e.target.value }))
                }
              />
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label">Sets</label>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={exercises.sets}
                  onSelect={(e) =>
                    setExercises((prev) => ({ ...prev, sets: parseInt(e) }))
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <Dropdown.Item eventKey={num} key={num}>
                      {num}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </div>

              <div className="col-md-6">
                <label className="form-label">Reps</label>

                <DropdownButton
                  id="dropdown-basic-button"
                  title={exercises.reps}
                  onSelect={(e) =>
                    setExercises((prev) => ({ ...prev, reps: parseInt(e) }))
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                    (num) => (
                      <Dropdown.Item eventKey={num} key={num}>
                        {num}
                      </Dropdown.Item>
                    )
                  )}
                </DropdownButton>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Save Workout
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
