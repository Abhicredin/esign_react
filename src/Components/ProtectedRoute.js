 
//  import {Navigate } from "react-router-dom";

//  const ProtectedRoute = ({ children }) => {

//   console.log(children);
//   const token = localStorage.getItem("token");
//   const email = localStorage.getItem("email");

//   console.log(token);
//   console.log(email);


//   if (!token || !email) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;