
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import { ToastContainer } from "react-toastify";
import HomePage from "./Components/Esign/HomePage";
import Home from "./Components/Esign/MyDocuments";
import AddTemplatePage from "./Components/Esign/ProductTemplate/ProductTemplate";
// import AddTemplatePage from "./Components/Esign/ProductTemplate";
import ProtectedRoute from "./Components/ProtectedRoute"

export const version = 1.1;
let url;

if (window.location.href.includes("localhost")) {
  // url = `http://localhost:5000`;
  url = `http://staging.console.api.credin.in`;
  // url = 'https://consoleapi.credin.in'

} else if (window.location.href.includes("staging")) {
  url = `https://staging.cpanel.api.credin.in`;
} else {
  url = "https://cpanelapi.credin.in";
}

export { url };

function App() {

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<HomePage />} />

        <Route path="/documents" element={<Home />} />
        <Route path="/addtemplate" element={<AddTemplatePage />} />


         {/* <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addtemplate"
          element={
            <ProtectedRoute>
              <AddTemplatePage />
            </ProtectedRoute>
          }
        /> */}
        
      </Routes> 

      
    </BrowserRouter>
  );
}

export default App;