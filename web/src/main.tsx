import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("❌ Elemento root não encontrado!");
  document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif;"><h1>❌ Erro: Elemento root não encontrado</h1></div>';
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error("❌ Erro ao renderizar:", error);
    rootElement.innerHTML = '<div style="padding: 20px; font-family: sans-serif;"><h1>❌ Erro ao carregar aplicação</h1><pre>' + error + '</pre></div>';
  }
}
