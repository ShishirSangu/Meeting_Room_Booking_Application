import React, { useState } from "react";
import axios from "./api/axios";
import { useNavigate } from "react-router-dom";
import styles from "./register.module.css";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", formData);

      if (response.status === 200) {
        const { id, fullname, role, status, dob, email, company_id } =
          response.data;

        // For Employee, HR, and Team Lead: Check if their status is 'approved'
        if (["Employee", "HR", "Team Lead"].includes(role)) {
          if (status === "approved") {
            // Store all user data in localStorage
            localStorage.setItem(
              "user",
              JSON.stringify({
                id,
                fullname,
                role,
                status,
                dob,
                email,
                company_id,
              })
            );
            setIsAuthenticated(true);
            navigate("/home"); // Redirect to home page if approved
          } else {
            alert(`Your registration status is: ${status}`);
            navigate("/login"); // Redirect back to login if not approved
          }
        }

        // For Admin role, no status check needed
        if (role === "Admin") {
          // Store all user data in localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              id,
              fullname,
              role,
              status,
              dob,
              email,
              company_id,
            })
          );
          setIsAuthenticated(true); // Admin is automatically authenticated
          navigate("/home"); // Redirect directly to home for admin
        }
      }
    } catch (error) {
      console.error(error);
      alert("Login failed! Please check your email and password.");
    }
  };

  return (
    <div className={styles.register_container}>
      <form onSubmit={handleSubmit} className={styles.register_form}>
        <h2 className={styles.register_h2}>Login</h2>
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
        <button type="submit" className={styles.register_button}>
          Login
        </button>
        <button
          type="button"
          onClick={() => navigate("/register")}
          className={styles.register_button}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Login;

// import React, { useState } from "react";
// import axios from "./api/axios";
// import { useNavigate } from "react-router-dom";

// const Login = ({ setIsAuthenticated }) => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   // const [fullName, setFullName] = useState(""); // State to store full name
//   // const [message, setMessage] = useState(""); // State to store the login message

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/login", formData);
//       // setMessage(() => navigate("/Home"));

//       // Set the welcome message with the full name
//       // setFullName(response.data.fullname); // Store full name from the response
//       // setMessage(response.data.message); // Display login success message
//       // const { fullName } = response.data.fullname;
//       // console.log(fullName);
//       // localStorage.setItem("fullName", fullName);
//       // setIsAuthenticated(true);
//       // navigate("/home");

//       if (response.status === 200) {
//         const { fullname, status } = response.data; // Extract fullname from the response
//         localStorage.setItem("fullName", fullname);
//         localStorage.setItem("status", status); // Save fullname in local storage
//         setIsAuthenticated(true); // Update authentication state
//         navigate("/home"); // Redirect to Home
//         // console.log(status);
//       }
//     } catch (error) {
//       console.error(error);
//       // setMessage("Login failed!");
//       alert("Login failed! Please check your credentials.");
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       {/* {message && <p>{message}</p>}
//       {fullName && <h3>Welcome, {fullName}!</h3>}{" "} */}
//       {/* Display welcome message if full name is available */}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Login</button>
//         <button type="button" onClick={() => navigate("/register")}>
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;
