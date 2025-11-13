// src/components/PerimeterBox.jsx
import React from "react";

const baseStyle = {
  backgroundColor: "black",                 // cor interna do card
  color: "white",
  padding: "24px",                          // espaço interno
  borderRadius: "12px",                     // bordas arredondadas
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // sombra
  border: "3px solid black",
  margin: "24px",                           // “perímetro” em volta
};

function PerimeterBox({ children, style }) {
  // junta o estilo base com o estilo específico daquela tela
  return <div style={{ ...baseStyle, ...style }}>{children}</div>;
}

export default PerimeterBox;
