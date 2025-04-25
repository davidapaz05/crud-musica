// Importo o ReactDOM pra renderizar a aplicação
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Importo o CSS do Bootstrap pra usar os componentes prontos e responsivos
import "bootstrap/dist/css/bootstrap.min.css";

// Aqui é onde o React monta a aplicação dentro da div "root" no HTML
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App /> {/* Chamo o componente principal */}
  </React.StrictMode>
);
