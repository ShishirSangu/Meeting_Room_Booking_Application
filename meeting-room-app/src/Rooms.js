import React, { useState, useEffect } from "react";
import axiosInstance from "./api/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Rooms() {
  const [rooms, setRooms] = useState([]); // State to store room data
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null); // For room editing
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const companyId = user ? user.company_id : null;

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axiosInstance.get("/rooms");
      const allRooms = response.data;

      // Extract the first 5 characters of the logged-in user's company_id
      const companyIdPrefix = companyId ? companyId.slice(0, 5) : "";

      // Filter rooms where the first 5 characters of company_id match
      const filteredRooms = allRooms.filter(
        (room) => room.company_id.slice(0, 5) === companyIdPrefix
      );

      setRooms(filteredRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();

    try {
      const roomData = {
        room_name: roomName,
        capacity: capacity,
        company_id: companyId,
      };
      console.log(roomData.room_name);
      console.log(roomData.capacity);

      const response = await axiosInstance.post("/rooms", roomData); // POST request to add room
      setMessage(response.data.message);
      setRoomName("");
      setCapacity("");
      fetchRooms(); // Refresh the room list after adding
    } catch (error) {
      setMessage("Error adding room, please try again.");
    }
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();

    try {
      const roomData = {
        room_name: roomName,
        capacity: capacity,
        company_id: companyId,
      };

      const response = await axiosInstance.put(
        `/rooms/${selectedRoom.id}`,
        roomData
      ); // PUT request to update room
      setMessage(response.data.message);
      setRoomName("");
      setCapacity("");
      setSelectedRoom(null);
      fetchRooms(); // Refresh the room list after updating
    } catch (error) {
      setMessage("Error updating room, please try again.");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await axiosInstance.delete(`/rooms/${roomId}`); // DELETE request to remove room
      setMessage("Room deleted successfully!");
      fetchRooms(); // Refresh the room list after deletion
    } catch (error) {
      setMessage("Error deleting room, please try again.");
    }
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room); // Set selected room to edit
    setRoomName(room.name);
    setCapacity(room.capacity);
  };

  return (
    <div>
      <div style={{ display: "flex" }} className="mt-5">
        <div>
          <form
            onSubmit={selectedRoom ? handleUpdateRoom : handleAddRoom}
            className="card card text-center ms-5 me-5 mt-5"
            style={{ width: "35rem" }}
          >
            <h2 className="card-header">
              {selectedRoom ? "Update Room" : "Add New Room"}
            </h2>

            <div className="card-body ">
              <div className="m-3 ">
                <label className="card-title w-100 fs-5 fw-bolder">
                  Room Name
                </label>
                <input
                  type="text"
                  value={roomName}
                  className="w-100 ps-3 pt-2 pb-2"
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter Room Name"
                  required
                />
              </div>
              <div className="m-3">
                <label className="card-title w-100 fs-5 fw-bolder">
                  Room Capacity
                </label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Enter Room Capacity"
                  className="w-100 ps-3 pt-2 pb-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary mt-2 w-5 ps-3 pe-3 pt-2 pb-2 mb-4"
              >
                {selectedRoom ? "Update Room" : "Add Room"}
              </button>
            </div>
          </form>
        </div>

        <div className="card text-center pb-0" style={{ width: "62%" }}>
          <h5 className="card-title f-5 fw-bold m-3">Room Details</h5>
          <table border="1" className="table">
            <thead className="table-dark">
              <tr>
                <th>Room Name</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.name}</td>
                  <td>{room.capacity}</td>
                  <td>
                    <button
                      onClick={() => handleEditRoom(room)}
                      className="btn btn-outline-info me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="btn btn-outline-warning"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <h2 className="ms-5 text-success">{message && <p>{message}</p>}</h2>
    </div>
  );
}

export default Rooms;
