import React, { useState, useEffect } from "react";
import axiosInstance from "./api/axios";

function BookedRooms() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [personName, setPersonName] = useState("");
  const [personEmail, setPersonEmail] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

  const [user, setUser] = useState({ role: "", email: "", id: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
    }
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      fetchBookings(userData.role, userData.email, userData.id);
    }
  }, []);

  const fetchBookings = async (role, email, userId) => {
    try {
      const response = await axiosInstance.get("/bookings", {
        params: { role, email, user_id: userId },
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setMessage("Error fetching bookings. Please try again.");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axiosInstance.delete(`/book-room/${bookingId}`);
      setMessage("Booking deleted successfully!");
      fetchBookings(user.role, user.email, user.id);
    } catch (error) {
      console.error("Error deleting booking:", error);
      setMessage("Error deleting booking. Please try again.");
    }
  };

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setPersonName(booking.person_name);
    setPersonEmail(booking.person_email);
    setDate(booking.date);
    setStartTime(booking.start_time);
    setEndTime(booking.end_time);
  };

  const handleUpdateBooking = async (event) => {
    event.preventDefault();

    try {
      const updatedBooking = {
        room_id: selectedBooking.room_id,
        person_name: personName,
        person_email: personEmail,
        date: date,
        start_time: startTime,
        end_time: endTime,
        user_id: userId,
      };

      await axiosInstance.put(
        `/book-room/${selectedBooking.id}`,
        updatedBooking
      );
      setMessage("Booking updated successfully!");
      fetchBookings(user.role, user.email, user.id);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error updating booking:", error);
      setMessage("Error updating booking. Please try again.");
    }
  };

  return (
    <div>
      <h2>All Bookings</h2>
      {message && <p>{message}</p>}

      <table border="1">
        <thead>
          <tr>
            <th>Person Name</th>
            <th>Person Email</th>
            <th>Date</th>
            <th>Room Name</th>
            <th>Room Capacity</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.person_name}</td>
              <td>{booking.person_email}</td>
              <td>{booking.date}</td>
              <td>{booking.room?.name || "N/A"}</td>
              <td>{booking.room?.capacity || "N/A"}</td>
              <td>{booking.start_time}</td>
              <td>{booking.end_time}</td>
              <td>
                <button onClick={() => handleEditBooking(booking)}>Edit</button>
                <button onClick={() => handleDeleteBooking(booking.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedBooking && (
        <div>
          <h3>Edit Booking</h3>
          <form onSubmit={handleUpdateBooking}>
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
              <label>Start Time</label>
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
              <label>End Time</label>
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
            <button type="submit">Update Booking</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default BookedRooms;
