import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:4000");

export default function Home() {
  const [chairs, setChairs] = useState([]);

  useEffect(() => {
    // Fetch initial occupancy data
    axios.get("http://localhost:4000/api/occupancy")
      .then((response) => setChairs(response.data))
      .catch((error) => console.error(error));

    // Listen for real-time updates
    socket.on("occupancyUpdate", (data) => {
      setChairs((prevChairs) =>
        prevChairs.map((chair, index) =>
          index === data.id ? { ...chair, occupied: data.occupied } : chair
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Chair Occupancy</h1>
      <ul>
        {chairs.map((chair, index) => (
          <li key={index}>
            Chair {index + 1}: {chair.occupied ? "Occupied" : "Empty"}
          </li>
        ))}
      </ul>
    </div>
  );
}
