import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import connect from "../../connect/Esign/HomeConnect";

const LoginStaff = () => {
  const [emailid, setEmailid] = useState("");
  const [password, setPassword] = useState("");
  const [loginData, setLoginData] = useState([]);
  const [error, setError] = useState("");
  const [checkLogin, setCheckLogin] = useState(true);
  const navigate = useNavigate();

  // Prevent back navigation on component unmount
  useEffect(() => {
    const handleBackNavigation = () => {
      window.history.forward();
    };
    handleBackNavigation();
    window.onunload = () => null;
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    const inputField = document.getElementById("passwordInput");
    if (inputField.type === "password") {
      inputField.type = "text";
    } else {
      inputField.type = "password";
    }
  };

  // Handle login
  const goToDashboard = async () => {
    setCheckLogin(false);
    try {
      const response = await connect.getlogindata(emailid, password);
      setLoginData(response);
      if (response[0]?.auth) {
        localStorage.setItem("CREDINTOKEN", response[0].token);
        localStorage.setItem("USER", response[0].email);
        navigate("/esign");
      } else {
        alert("Invalid User or Password");
      }
    } catch (error) {
      setError("An error occurred during login");
      console.error(error);
    }
  };

  return (
    <div className="equifax">
      <div className="equifax-main">
        <h1>Console Login</h1>
        <div className="equifax-form">
          <div className="equifax-input">
            <label htmlFor="EmailID">Email ID</label>
            <input
              type="text"
              value={emailid}
              onChange={(e) => setEmailid(e.target.value)}
            />
          </div>
          <div className="equifax-input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="passwordInput"
            />
          </div>
          <div className="equifax-input-one">
            <input type="checkbox" onClick={togglePasswordVisibility} />
            <p>Show Password</p>
          </div>
          <div className="equifax-input">
            <button onClick={goToDashboard}>Login</button>
          </div>
        </div>
      </div>
      <p>{error}</p>
    </div>
  );
};

export default LoginStaff;
