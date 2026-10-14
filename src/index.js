import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

try {
  document.documentElement.dataset.theme = localStorage.getItem("forsa-theme") || "light";
} catch {
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
