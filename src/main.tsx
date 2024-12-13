import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Widget from "./Widget.tsx";
import { Fallback } from "./components/Fallback.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/debug" element={<App />} />
        <Route path="/widgets/ranking/:code" element={<Widget />} />
        <Route path="/widgets/pacemaker/:code" element={<Widget pacemaker />} />
        <Route path="*" element={<Fallback />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
