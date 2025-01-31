import React, { useState, useEffect } from "react";
import axios from "./api/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function Access() {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [adminCompanyIdPrefix, setAdminCompanyIdPrefix] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchCompanyId, setSearchCompanyId] = useState("");

  useEffect(() => {
    // Get admin company_id from localStorage
    const admin = JSON.parse(localStorage.getItem("user"));
    if (admin && admin.company_id) {
      // Extract the first part (prefix) of the admin's company_id (e.g., "INFAN" from "INFAN001")
      setAdminCompanyIdPrefix(admin.company_id.slice(0, 5));
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/users`, {
          params: { status: statusFilter },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [statusFilter]);

  const handleApprove = async (userId) => {
    try {
      const response = await axios.put(`/users/${userId}/approve`);
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: "approved" } : user
          )
        );
      }
    } catch (error) {
      console.error("Error approving user:", error);
      alert("Error approving user!");
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await axios.put(`/users/${userId}/reject`);
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: "rejected" } : user
          )
        );
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      alert("Error rejecting user!");
    }
  };

  // Filter users based on status, company_id prefix, and search email/company_id
  const filteredUsers = users.filter((user) => {
    const isAdmin = user.role === "Admin";
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const userCompanyIdPrefix = user.company_id.slice(0, 5);
    const matchesCompanyIdPrefix = userCompanyIdPrefix === adminCompanyIdPrefix;

    const matchesSearchEmail = user.email
      .toLowerCase()
      .includes(searchEmail.trim().toLowerCase());

    const matchesSearchCompanyId = user.company_id
      .toLowerCase()
      .includes(searchCompanyId.trim().toLowerCase());

    return (
      !isAdmin &&
      matchesStatus &&
      matchesCompanyIdPrefix &&
      (matchesSearchEmail || matchesSearchCompanyId) // Search by email or company_id
    );
  });

  return (
    <div style={{ display: "flex", margin: "10px" }}>
      <div>
        <nav
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "15rem",
            textAlign: "center",
          }}
          className="nav flex-column card ms-5 me-5"
        >
          {["all", "pending", "approved", "rejected"].map((status) => (
            <h4
              key={status}
              style={{
                cursor: "pointer",
                backgroundColor:
                  statusFilter === status ? "orange" : "transparent",
              }}
              onClick={() => setStatusFilter(status)}
              className="nav-link active list-group list-group-flush"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </h4>
          ))}
        </nav>
      </div>

      <div style={{ width: "80%" }}>
        <div className="card text-center">
          <h3 className="card-header">{statusFilter} user details.</h3>

          {/* Search by Email */}
          <input
            type="text"
            placeholder="Search by email or Company ID"
            value={searchEmail || searchCompanyId} // Allow both values to be controlled by the same input
            onChange={(e) => {
              const value = e.target.value.replace(/\s+/g, "");
              setSearchEmail(value); // Set value for email
              setSearchCompanyId(value); // Set value for company_id
            }}
            className="form-control"
            style={{
              borderColor: "orange",
              backgroundColor: "dodgerblue",
            }}
          />

          <table
            style={{
              width: "100%",
              marginTop: "20px",
              border: "1px solid #ddd",
            }}
            className="card-body table"
          >
            <thead className="table-dark">
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Company ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody style={{ width: "100%", textAlign: "center" }}>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.status}</td>
                    <td>{user.company_id}</td>
                    <td>
                      <button
                        onClick={() => handleApprove(user.id)}
                        disabled={user.status === "approved"}
                        className="btn btn-info me-3 "
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        disabled={user.status === "rejected"}
                        className="btn btn-warning"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No users match your search criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Access;
