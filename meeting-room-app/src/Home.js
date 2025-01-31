import React, { useState } from "react";
// import axiosInstance from "./api/axios";
import Rooms from "./Rooms";
import AvailableRooms from "./AvailableRooms";
import BookedRooms from "./BookedRooms";
import Access from "./Access";
import Profile from "./Profile";
// import BookingPage from "./BookingPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Home() {
  const [activeTab, setActiveTab] = useState("AvailableRooms");

  // Retrieve user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));

  // Check if the user is Employee, Team Lead, or HR
  const isRestrictedRole =
    userData && ["Employee", "Team Lead", "HR"].includes(userData.role);

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return <Profile />;
      case "Rooms":
        return <Rooms />;
      case "AvailableRooms":
        return <AvailableRooms />;
      case "BookedRooms":
        return <BookedRooms />;
      case "Access":
        return <Access />;
      // case "BookingPage":
      //   return <BookingPage />;
      default:
        return null;
    }
  };

  const getTabStyle = (tabName) => {
    return activeTab === tabName
      ? {
          cursor: "pointer",
          backgroundColor: "yellow",
          padding: "5px",
          borderRadius: "4px",
        }
      : { cursor: "pointer" };
  };

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h4 onClick={() => setActiveTab("Profile")} className="mt-5 ms-4 mb-1">
          <i
            className="bi bi-person-circle text-primary bg-dark rounded-circle p-3"
            style={{ fontSize: "2rem", cursor: "pointer" }}
          ></i>
        </h4>
        <h4
          style={getTabStyle("Home")}
          onClick={() => {
            setActiveTab("Home");
            setTimeout(() => setActiveTab("AvailableRooms"), 0); // After Home is set, switch to Rooms
          }}
          className="m-5"
        >
          Home
        </h4>
      </div>
      {activeTab !== "Profile" && (
        <nav
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            justifyContent: "space-around",
            background: "dodgerblue",
            paddingTop: "12px",
            paddingBottom: "0px",
          }}
        >
          <h4
            style={getTabStyle("AvailableRooms")}
            onClick={() => setActiveTab("AvailableRooms")}
          >
            Available Rooms
          </h4>

          <h4
            style={getTabStyle("BookedRooms")}
            onClick={() => setActiveTab("BookedRooms")}
          >
            Booked Rooms
          </h4>
          {/* Hide Room Management and Access for Employee, Team Lead, or HR */}
          {!isRestrictedRole && (
            <>
              <h4
                style={getTabStyle("Rooms")}
                onClick={() => setActiveTab("Rooms")}
              >
                Room Management
              </h4>
              <h4
                style={getTabStyle("Access")}
                onClick={() => setActiveTab("Access")}
              >
                Access
              </h4>
            </>
          )}

          {/* <h4
          style={getTabStyle("BookingPage")}
          onClick={() => setActiveTab("BookingPage")}
        >
          Booking Page
        </h4> */}
        </nav>
      )}

      <div>{renderContent()}</div>
    </div>
  );
}

export default Home;
