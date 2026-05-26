import api from "../utils/api";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api.get("/sessions")
      .then(res => setSessions(res.data));
  }, []);

  return (
    <div>
      <h2>Sessions</h2>
      {sessions.map((s,i)=>(
        <div key={i}>
          <h3>{s.title}</h3>
          <p>{s.type} - {s.location}</p>
        </div>
      ))}
    </div>
  );
}