import React, { useState, useEffect } from "react";
import axios from "./api/axios"; // Ensure axios is configured correctly
import { useNavigate } from "react-router-dom"; // For navigation

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newFullname, setNewFullname] = useState("");
  const [newDob, setNewDob] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setNewFullname(storedUser.fullname);
      setNewDob(storedUser.dob);
    } else {
      // Redirect to login if no user data is found
      alert("Please log in to view your profile.");
      navigate("/login");
    }
    setIsLoading(false);
  }, [navigate]);

  // Handle the start of the edit mode
  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    if (!newFullname || !newDob) {
      alert("Full name and Date of Birth are required.");
      return;
    }

    const userId = user?.id;
    if (!userId) {
      alert("User not found. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      // Make the PUT request to update the profile
      const response = await axios.put(
        `http://localhost:8000/api/users/${userId}/update`, // Use the correct userId in the URL
        {
          fullname: newFullname,
          dob: newDob,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the auth token in headers
          },
        }
      );

      // If the update was successful, update the localStorage and user state
      if (response.data) {
        const updatedUser = { ...user, fullname: newFullname, dob: newDob };
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Update localStorage
        setUser(updatedUser); // Update state
        setIsEditing(false); // Exit editing mode
        setError(null);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      setError("Failed to update profile. Please try again later.");
      console.error("Error updating profile:", err);
    }
  };

  // Handle sign out and clear localStorage
  const handleSignOut = () => {
    localStorage.clear();
    navigate("/login"); // Redirect to login page after signing out
  };

  // Show loading text while fetching user data
  if (isLoading) return <div>Loading...</div>;

  if (!user) return <div>No user data found.</div>;

  return (
    <div>
      <h2 className="ms-5">Welcome, {user.fullname || "Guest"}!</h2>
      <div className="card ms-5 p-5" style={{ width: "40%" }}>
        <h2>User Profile</h2>
        <div className="card-body">
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p>
            <strong>Name: </strong>
            {isEditing ? (
              <input
                type="text"
                value={newFullname}
                onChange={(e) => setNewFullname(e.target.value)}
              />
            ) : (
              user.fullname
            )}
          </p>
          <p>
            <strong>Email: </strong>
            {user.email}
          </p>
          <p>
            <strong>Role: </strong>
            {user.role}
          </p>

          {user.role !== "Admin" && (
            <p>
              <strong>Status: </strong>
              {user.status}
            </p>
          )}

          <p>
            <strong>Company ID: </strong>
            {user.company_id}
          </p>
          <p>
            <strong>Date of Birth: </strong>
            {isEditing ? (
              <input
                type="date"
                value={newDob}
                onChange={(e) => setNewDob(e.target.value)}
              />
            ) : (
              user.dob
            )}
          </p>
          <div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="btn btn-outline-info me-2"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="btn btn-outline-success me-2"
              >
                Save
              </button>
            )}
            <button onClick={handleSignOut} className="btn btn-outline-warning">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
