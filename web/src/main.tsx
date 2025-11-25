import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("❌ Elemento root não encontrado!");
  document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif; background: red; color: white;"><h1>❌ Erro: Elemento root não encontrado</h1></div>';
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("❌ Erro ao renderizar:", error);
    rootElement.innerHTML = '<div style="padding: 20px; font-family: sans-serif; background: red; color: white;"><h1>❌ Erro ao carregar aplicação</h1><pre>' + String(error) + '</pre></div>';
  }
}
