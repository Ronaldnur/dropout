import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // tambahkan ini
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>   {/* bungkus App dengan Router */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
