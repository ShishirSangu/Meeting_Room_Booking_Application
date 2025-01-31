import React, { useState, useEffect } from "react";
import axiosInstance from "./api/axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function AvailableRooms() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [personName, setPersonName] = useState("");
  const [personEmail, setPersonEmail] = useState("");
  const [formDate, setFormDate] = useState("");
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
  console.log(startTime);
  console.log(endTime);
  console.log(formDate);

  // Calendar ******************

  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [filterCal, setFilterCal] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

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

  // const [weekDates, setWeekDates] = useState(getWeekDates(date));
  const weekDates = getWeekDates(date);
  // console.log(weekDates);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setSelectedSlots([]);
    // console.log(date);
    // setWeekDates(getWeekDates(date));
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

  const handleAddEvent = () => {
    if (filterCal.date && filterCal.startTime && filterCal.endTime) {
      const startTime = parseInt(filterCal.startTime.split(":")[0]);
      const endTime = parseInt(filterCal.endTime.split(":")[0]);

      if (startTime >= endTime) {
        alert("End time must be after start time.");
        return;
      }

      const event = {
        date: new Date(filterCal.date),
        startHour: startTime,
        endHour: endTime,
      };

      setEvents((prevEvents) => [...prevEvents, event]);

      setSelectedSlots([]);
      setFilterCal({ date: "", startTime: "", endTime: "" });
      alert("Event added successfully!");
    } else {
      alert("Please fill in all fields.");
    }
  };

  console.log(handleAddEvent);

  // Calendar **********

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
    const weekDates = getWeekDates(date);
    console.log(weekDates);

    setSelectedRoom(room);
    setIsUpdate(false);
    clearForm();
    // setWeekDates(getWeekDates(date));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("You must be logged in to book a room.");
      return;
    }

    // const today = new Date().toISOString().split("T")[0];
    // if (formDate < today) {
    //   alert("You cannot book a room for a past date.");
    //   return;
    // }

    // const today = new Date();
    // const bookingDate = new Date(formDate);

    // if (bookingDate < today.setHours(0, 0, 0, 0)) {
    //   alert("You cannot book a room for a past date.");
    //   return;
    // }
    const today = new Date().toISOString().split("T")[0];
    if (filterCal.date < today) {
      alert("You cannot book a room for a past date.");
      return;
    }

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
      date: filterCal.date,
      start_time: filterCal.startTime,
      end_time: filterCal.endTime,
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
    setFormDate("");
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
      </div>
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
        // <div>
        //   <h3>
        //     {isUpdate ? "Update Booking" : "Book Room"}: {selectedRoom.name}
        //   </h3>
        //   <form onSubmit={handleBookingSubmit}>
        //     {role !== "Employee" && (
        //       <>
        //         <div>
        //           <label>Person Name</label>
        //           <input
        //             type="text"
        //             value={personName}
        //             onChange={(e) => setPersonName(e.target.value)}
        //             required
        //           />
        //         </div>
        //         <div>
        //           <label>Person Email</label>
        //           <input
        //             type="email"
        //             value={personEmail}
        //             onChange={(e) => setPersonEmail(e.target.value)}
        //             required
        //           />
        //         </div>
        //       </>
        //     )}
        //     <div>
        //       <label>Date</label>
        //       <input
        //         type="date"
        //         value={formDate}
        //         onChange={(e) => setFormDate(e.target.value)}
        //         required
        //       />
        //     </div>
        //     <div>
        //       <label>Meeting Start Time</label>
        //       <input
        //         type="time"
        //         value={startTime}
        //         onChange={(e) => {
        //           const timeWithSeconds = `${e.target.value}:00`;
        //           setStartTime(timeWithSeconds);
        //         }}
        //         required
        //       />
        //     </div>
        //     <div>
        //       <label>Meeting End Time</label>
        //       <input
        //         type="time"
        //         value={endTime}
        //         onChange={(e) => {
        //           const timeWithSeconds = `${e.target.value}:00`;
        //           setEndTime(timeWithSeconds);
        //         }}
        //         required
        //       />
        //     </div>
        //     <button type="submit">
        //       {isUpdate ? "Update Booking" : "Book Room"}
        //     </button>
        //   </form>
        // </div>

        // Calendar
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

              {/* <div
                className="add-event"
                // style={{
                //   marginTop: "30px",
                //   width: "100%",
                //   display: "flex",
                //   flexDirection: "column",
                //   // alignItems: "center",
                // }}
              >
                <h2>Add a Custom time</h2>
                <div>
                  <label>Date: </label>
                  <input
                    type="date"
                    value={filterCal.date}
                    onChange={(e) =>
                      setFilterCal({ ...filterCal, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Start Time: </label>
                  <input
                    type="time"
                    value={filterCal.startTime}
                    onChange={(e) =>
                      setFilterCal({ ...filterCal, startTime: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>End Time: </label>
                  <input
                    type="time"
                    value={filterCal.endTime}
                    onChange={(e) =>
                      setFilterCal({ ...filterCal, endTime: e.target.value })
                    }
                  />
                </div>
                <button style={{ marginTop: "10px" }} onClick={handleAddEvent}>
                  Book Room
                </button>
              </div> */}
              <div>
                <h3>
                  {isUpdate ? "Update Booking" : "Book Room"}:{" "}
                  {selectedRoom.name}
                </h3>
                <form onSubmit={handleBookingSubmit}>
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
                      // value={formDate}
                      // onChange={(e) => setFormDate(e.target.value)}
                      value={filterCal.date}
                      onChange={(e) =>
                        setFilterCal({ ...filterCal, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label>Meeting Start Time</label>
                    <input
                      type="time"
                      // value={startTime}
                      // onChange={(e) => {
                      //   const timeWithSeconds = `${e.target.value}:00`;
                      //   setStartTime(timeWithSeconds);
                      // }}
                      value={filterCal.startTime}
                      onChange={(e) =>
                        setFilterCal({
                          ...filterCal,
                          startTime: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label>Meeting End Time</label>
                    <input
                      type="time"
                      // value={endTime}
                      // onChange={(e) => {
                      //   const timeWithSeconds = `${e.target.value}:00`;
                      //   setEndTime(timeWithSeconds);
                      // }}
                      value={filterCal.endTime}
                      onChange={(e) =>
                        setFilterCal({ ...filterCal, endTime: e.target.value })
                      }
                      required
                    />
                  </div>
                  <button type="submit">
                    {isUpdate ? "Update Booking" : "Book Room"}
                  </button>
                </form>
              </div>
            </div>

            {/* Week View Section with Fixed Header */}
            <div
              style={{
                width: "80%",
                height: "800px",
                overflowY: "scroll",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* <h2 style={{ textAlign: "center" }}>Week View</h2> */}
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
                                ? "#add8e6"
                                : events.some(
                                    (event) =>
                                      event.date.toDateString() ===
                                        weekDate.toDateString() &&
                                      hour >= event.startHour &&
                                      hour < event.endHour
                                  )
                                ? "#d0e8ff"
                                : "white",
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

          {/* Add Event Form Section */}
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default AvailableRooms;
