import React from "react";
import { createRoot } from "react-dom"; // Update import

// Include your styles into the webpack bundle
import "../styles/index.css";

// Import your own components
import Home from "./component/home.jsx";

// Render your React application with strict mode
createRoot(document.querySelector("#app")).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
