import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const App = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [filter, setFilter] = useState({
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

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setSelectedSlots([]);
  };

  const handleSlotClick = (slotDate, hour) => {
    const formattedDate = slotDate.toLocaleDateString("en-CA");
    const formattedTime = hour.toString().padStart(2, "0") + ":00";

    if (selectedSlots.length === 0) {
      setSelectedSlots([{ date: formattedDate, time: formattedTime }]);
      setFilter({
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
        setFilter((prevFilter) => ({
          ...prevFilter,
          endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
        }));
      } else {
        setSelectedSlots([{ date: formattedDate, time: formattedTime }]);
        setFilter({
          date: formattedDate,
          startTime: formattedTime,
          endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
        });
      }
    }
  };

  const handleAddEvent = () => {
    if (filter.date && filter.startTime && filter.endTime) {
      const startTime = parseInt(filter.startTime.split(":")[0]);
      const endTime = parseInt(filter.endTime.split(":")[0]);

      if (startTime >= endTime) {
        alert("End time must be after start time.");
        return;
      }

      const event = {
        date: new Date(filter.date),
        startHour: startTime,
        endHour: endTime,
      };

      setEvents((prevEvents) => [...prevEvents, event]);

      setSelectedSlots([]);
      setFilter({ date: "", startTime: "", endTime: "" });
      alert("Event added successfully!");
    } else {
      alert("Please fill in all fields.");
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

          <div
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
                value={filter.date}
                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
              />
            </div>
            <div>
              <label>Start Time: </label>
              <input
                type="time"
                value={filter.startTime}
                onChange={(e) =>
                  setFilter({ ...filter, startTime: e.target.value })
                }
              />
            </div>
            <div>
              <label>End Time: </label>
              <input
                type="time"
                value={filter.endTime}
                onChange={(e) =>
                  setFilter({ ...filter, endTime: e.target.value })
                }
              />
            </div>
            <button style={{ marginTop: "10px" }} onClick={handleAddEvent}>
              Book Room
            </button>
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
  );
};

export default App;
