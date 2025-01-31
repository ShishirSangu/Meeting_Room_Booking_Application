import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./register.module.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    role: "Employee",
    company_id: "",
    email: "",
    password: "",
    dob: "",
  });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "company_id") {
      let formattedValue = value.toUpperCase(); // Convert to uppercase
      if (!/^[A-Z]{0,5}\d*$/.test(formattedValue)) {
        return; // Prevent invalid input
      }
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Registration successful!");
        navigate("/Login");
      } else {
        alert("Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.register_container}>
      <form onSubmit={handleSubmit} className={styles.register_form}>
        <h2 className={styles.register_h2}>Register</h2>

        <p className={styles.register_p}>Role</p>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={styles.register_select}
        >
          <option value="Admin">Admin</option>
          <option value="HR">HR</option>
          <option value="Team Lead">Team Lead</option>
          <option value="Employee">Employee</option>
        </select>

        <p className={styles.register_p}>Company Id</p>
        <input
          type="text"
          name="company_id"
          placeholder="Company Id"
          value={formData.company_id}
          onChange={handleChange}
          className={styles.register_input}
          required
        />

        <p className={styles.register_p}>Name</p>
        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          value={formData.fullname}
          onChange={handleChange}
          className={styles.register_input}
          required
        />

        <p className={styles.register_p}>Email</p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={styles.register_input}
          required
        />

        <p className={styles.register_p}>Password</p>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={styles.register_input}
          required
        />

        <p className={styles.register_p}>Date of birth</p>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className={styles.register_input}
          required
        />
        <button type="submit" className={styles.register_button}>
          Register
        </button>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className={styles.register_button}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Register;
