import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx"; // Removed the .jsx extension

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <App />
);
