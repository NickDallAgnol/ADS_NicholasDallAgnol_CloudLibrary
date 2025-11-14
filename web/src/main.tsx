import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

console.log("🔍 main.tsx carregado");

const rootElement = document.getElementById("root");
console.log("📍 Root element:", rootElement);

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  console.log("✅ App renderizado com sucesso");
} else {
  console.error("❌ Elemento root não encontrado!");
}
