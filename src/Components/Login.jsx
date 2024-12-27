import React, { useState } from "react";
import { url } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); 

  // Function to handle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(url + "/api/auth/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res);
        if (res.data.auth === true) {
          toast.success(res.data.message);
          localStorage.setItem("TOKEN", res.data.token);
          localStorage.setItem("EMAIL", res.data.email);
          alert("Login form submitted!");
          navigate("/");
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("An error occurred. Please try again.");
      });
  };

  return (
    <div className="equifax">
      <div className="equifax-main">
        <h2>Console Login</h2>
        <form className="equifax-form" onSubmit={handleSubmit}>
          <div className="equifax-input">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          <div className="equifax-input">
            <label htmlFor="password">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="equifax-input-one">
            <input type="checkbox" onClick={togglePasswordVisibility} />
            <p>Show Password</p>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
