import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

let socket;

export default function Home() {
  const [chairs, setChairs] = useState([]);

  // Fetch initial chair occupancy data from backend and set up Socket.io
  useEffect(() => {
    // Initialize socket connection with reconnection options
    socket = io("http://localhost:4000", {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  
    // Fetch initial occupancy data
    axios.get("http://localhost:4000/api/occupancy")
      .then((response) => {
        console.log("Initial data fetched:", response.data);
        setChairs(response.data);
      })
      .catch((error) => console.error("Error fetching initial data", error));
  
    // Listen for real-time updates from the backend
    socket.on("occupancyUpdate", (data) => {
      console.log("Real-time update received:", data);
  
      // Update the specific chair that was changed
      setChairs((prevChairs) => {
        const updatedChairs = prevChairs.map((chair, index) =>
          index === data.id ? { ...chair, occupied: data.occupied } : chair
        );
        console.log("Updated chairs state:", updatedChairs);  // Log the updated state
        return updatedChairs;
      });
      
    });
  
    socket.on("reconnect", () => {
      console.log("Reconnected to the server");
    });
  
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  
    return () => {
      socket.disconnect();  // Clean up the socket connection when component unmounts
    };
  }, []);  

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Chair Occupancy</h1>
      <div style={styles.grid}>
        {chairs.map((chair, index) => (
          <div key={index} style={chair.occupied ? styles.occupied : styles.empty}>
            Chair {index + 1}: {chair.occupied ? "Occupied" : "Empty"}
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple styling for the occupancy display
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#282c34",
    height: "100vh",
    color: "white",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "20px",
    width: "80%",
  },
  occupied: {
    padding: "20px",
    backgroundColor: "red",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "1.2rem",
  },
  empty: {
    padding: "20px",
    backgroundColor: "green",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "1.2rem",
  },
};
