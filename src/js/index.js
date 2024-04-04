import React from "react";
import { createRoot } from "react-dom/client";

// include your styles into the webpack bundle
import "../styles/index.css";

// import your own components
import Home from "./component/home.jsx";

// render your react application with strict mode
createRoot(document.querySelector("#app")).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);
