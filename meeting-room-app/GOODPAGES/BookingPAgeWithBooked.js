import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axiosInstance from "./api/axios";
import "react-calendar/dist/Calendar.css";

const App = () => {
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [filterCal, setFilterCal] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });
  const [user, setUser] = useState({ role: "", email: "", id: "" });

  // Fetch user and bookings on mount
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
      const parsedBookings = parseBookings(response.data);
      setBookings(parsedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  // Parse bookings to extract usable data
  const parseBookings = (bookings) => {
    return bookings.map((booking) => ({
      date: new Date(booking.date),
      startHour: parseInt(booking.start_time.split(":")[0]),
      endHour: parseInt(booking.end_time.split(":")[0]),
    }));
  };

  const getWeekDates = (selectedDate) => {
    const startOfWeek = new Date(selectedDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setSelectedSlots([]);
  };

  const handleSlotClick = (slotDate, hour) => {
    const formattedDate = slotDate.toLocaleDateString("en-CA");
    const formattedTime = hour.toString().padStart(2, "0") + ":00";

    if (selectedSlots.length === 0) {
      setSelectedSlots([{ date: formattedDate, time: formattedTime }]);
      setFilterCal({
        date: formattedDate,
        startTime: formattedTime,
        endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
      });
    } else {
      const lastSelectedSlot = selectedSlots[selectedSlots.length - 1];
      const lastSelectedHour = parseInt(lastSelectedSlot.time.split(":")[0]);

      if (
        lastSelectedSlot.date === formattedDate &&
        hour === lastSelectedHour + 1
      ) {
        setSelectedSlots((prevSlots) => [
          ...prevSlots,
          { date: formattedDate, time: formattedTime },
        ]);
        setFilterCal((prevFilterCal) => ({
          ...prevFilterCal,
          endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
        }));
      } else {
        setSelectedSlots([{ date: formattedDate, time: formattedTime }]);
        setFilterCal({
          date: formattedDate,
          startTime: formattedTime,
          endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
        });
      }
    }
  };

  const weekDates = getWeekDates(date);

  return (
    <div
      className="App"
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ textAlign: "center" }}>React Calendar</h1>

      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {/* Calendar Section */}
        <div style={{ width: "20%" }}>
          <Calendar onChange={handleDateChange} value={date} />
        </div>

        {/* Week View Section */}
        <div
          style={{
            width: "80%",
            height: "800px",
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ overflowY: "auto", flexGrow: 1 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "center",
                border: "1px solid #ddd",
              }}
            >
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f4f4f4",
                  zIndex: 1,
                }}
              >
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "10px" }}>
                    Time
                  </th>
                  {weekDates.map((weekDate, index) => (
                    <th
                      key={index}
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                      }}
                    >
                      <div>
                        {weekDate.toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </div>
                      <div>
                        {weekDate.toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 24 }, (_, hour) => (
                  <tr key={hour}>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      {hour}:00
                    </td>
                    {weekDates.map((weekDate, dayIndex) => (
                      <td
                        key={dayIndex}
                        onClick={() => handleSlotClick(weekDate, hour)}
                        style={{
                          border: "1px solid #ddd",
                          padding: "10px",
                          cursor: "pointer",
                          backgroundColor: selectedSlots.some(
                            (slot) =>
                              slot.date ===
                                weekDate.toLocaleDateString("en-CA") &&
                              slot.time ===
                                `${hour.toString().padStart(2, "0")}:00`
                          )
                            ? "#add8e6" // Selected slot
                            : bookings.some(
                                (booking) =>
                                  booking.date.toDateString() ===
                                    weekDate.toDateString() &&
                                  hour >= booking.startHour &&
                                  hour < booking.endHour
                              )
                            ? "#ffcccb" // Booked slot
                            : "white", // Default
                        }}
                      ></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: "20px" }}>
        <p>
          <span style={{ backgroundColor: "#add8e6", padding: "5px" }}></span>{" "}
          Selected Slots
        </p>
        <p>
          <span style={{ backgroundColor: "#ffcccb", padding: "5px" }}></span>{" "}
          Already Booked
        </p>
      </div>
    </div>
  );
};

export default App;
