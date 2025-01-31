import React, { useState, useEffect } from "react";
import axiosInstance from "./api/axios";
// import BookingPage from "./BookingPage";

function AvailableRooms() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [personName, setPersonName] = useState("");
  const [personEmail, setPersonEmail] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState({
    date: "",
    startTime: "",
    endTime: "",
    capacity: "",
  });
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("");

  console.log(rooms);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
      setRole(parsedUser.role); // Set user role
    }
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.get("/rooms");
      setRooms(response.data);
      setFilteredRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setIsUpdate(false);
    clearForm();
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("You must be logged in to book a room.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      alert("You cannot book a room for a past date.");
      return;
    }

    // If role is Employee, don't use personName and personEmail from the form
    const bookingData = {
      room_id: selectedRoom.id,
      person_name:
        role === "Employee"
          ? JSON.parse(localStorage.getItem("user")).fullname
          : personName,
      person_email:
        role === "Employee"
          ? JSON.parse(localStorage.getItem("user")).email
          : personEmail,
      date,
      start_time: startTime,
      end_time: endTime,
      user_id: userId,
    };

    try {
      if (isUpdate) {
        await axiosInstance.put(`/book-room/${selectedRoom.id}`, bookingData);
        setMessage("Booking updated successfully!");
      } else {
        await axiosInstance.post("/book-room", bookingData);
        setMessage("Room booked successfully!");
      }

      clearForm();
      setSelectedRoom(null);
      fetchRooms();
    } catch (error) {
      console.error("Error submitting booking:", error);
      setMessage(
        error.response?.data?.message ||
          "Error processing request. Please try again."
      );
    }
  };

  const clearForm = () => {
    setPersonName("");
    setPersonEmail("");
    setDate("");
    setStartTime("");
    setEndTime("");
  };

  const handleSearchRooms = async () => {
    try {
      const response = await axiosInstance.get("/available-rooms", {
        params: {
          date: filter.date,
          start_time: filter.startTime,
          end_time: filter.endTime,
          capacity: filter.capacity,
        },
      });

      const availableRooms = response.data;
      setFilteredRooms(availableRooms);
    } catch (error) {
      console.error("Error fetching filtered rooms:", error);
      setMessage("Error fetching filtered rooms. Please try again.");
    }
  };

  return (
    <div>
      <h2>Meeting Room Booking</h2>
      {/* Filter Section */}
      <div>
        <h5>Filter Available Rooms</h5>
        <label>Date</label>
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />
      </div>{" "}
      <div>
        <div>
          <label>Start Time</label>
          <input
            type="time"
            value={filter.startTime}
            onChange={(e) =>
              setFilter({ ...filter, startTime: e.target.value })
            }
          />
        </div>
        <div>
          <label>End Time</label>
          <input
            type="time"
            value={filter.endTime}
            onChange={(e) => setFilter({ ...filter, endTime: e.target.value })}
          />
        </div>
        <div>
          <label>Capacity</label>
          <input
            type="number"
            value={filter.capacity}
            onChange={(e) => setFilter({ ...filter, capacity: e.target.value })}
            min="1"
          />
        </div>
        <button onClick={handleSearchRooms}>Search Rooms</button>
      </div>
      {/* Room Details */}
      <h5>Room Details</h5>
      <table border="1">
        <thead>
          <tr>
            <th>Room Name</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.capacity}</td>
              <td>
                <button onClick={() => handleBookRoom(room)}>Book</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Booking Form */}
      {selectedRoom && (
        <div>
          <h3>
            {isUpdate ? "Update Booking" : "Book Room"}: {selectedRoom.name}
          </h3>
          <form onSubmit={handleBookingSubmit}>
            {/* Only show name and email if the role is not Employee */}
            {role !== "Employee" && (
              <>
                <div>
                  <label>Person Name</label>
                  <input
                    type="text"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Person Email</label>
                  <input
                    type="email"
                    value={personEmail}
                    onChange={(e) => setPersonEmail(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Meeting Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => {
                  const timeWithSeconds = `${e.target.value}:00`;
                  setStartTime(timeWithSeconds);
                }}
                required
              />
            </div>
            <div>
              <label>Meeting End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => {
                  const timeWithSeconds = `${e.target.value}:00`;
                  setEndTime(timeWithSeconds);
                }}
                required
              />
            </div>
            <button type="submit">
              {isUpdate ? "Update Booking" : "Book Room"}
            </button>
          </form>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default AvailableRooms;
