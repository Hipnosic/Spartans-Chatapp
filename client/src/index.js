import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// It creates a new root for rendering React components and returns a Root object that can be used to render components asynchronously
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
      <App />
);

reportWebVitals();
