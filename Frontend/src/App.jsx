import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; // Nova dependencia do projeto: React Router
import Login from "./pages/Login.jsx";								   // Forma de instelar: npm install react-router-dom
import Register from "./pages/Register.jsx";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Registro</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} /> {/* página inicial */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
