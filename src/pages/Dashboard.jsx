import WorkoutForm from "../components/WorkoutForm";
import Nav from "react-bootstrap/Nav";
import { useState } from "react";
export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      //Navbar
      <Nav defaultActiveKey="/home" className="flex-row" variant="pills">
        <Nav.Link href="/home">Dashboard</Nav.Link>
        <Nav.Link eventKey="link-1">
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Add workout" : "Add workout"}
          </button>
        </Nav.Link>
        <Nav.Link eventKey="link-2">Statistics</Nav.Link>
      </Nav>
      {showForm && <WorkoutForm />}
    </>
  );
}
