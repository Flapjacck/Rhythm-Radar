import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import Callback from "./Callback.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
