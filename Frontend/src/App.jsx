// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MenuCentral from "./pages/MenuCentral.jsx";
import ListarModelos from "./pages/ListarModelos.jsx";
import CriarModelos from "./pages/CriarModelos.jsx";
import EditarModelo from "./pages/EditarModelo.jsx";
import Pesquisas from "./pages/Pesquisas.jsx";
import CriarPesquisa from "./pages/CriarPesquisa.jsx";
import SelecionarPesquisa from "./pages/secionar_pesquisar.jsx";
import PesquisasAndamento from "./pages/pesquisas_andamento.jsx";
import ParametrosPesquisa from "./pages/parametros_pesquisa.jsx";
import VisualizarPesquisa from "./pages/VisualizarPesquisa.jsx";

// --- NOVOS IMPORTS ADICIONADOS ---
import LancarPesquisas from "./pages/LancarPesquisas.jsx";
import DispararPesquisa from "./pages/DispararPesquisa.jsx";
import ResponderPesquisa from "./pages/ResponderPesquisa.jsx";
// ---------------------------------

export default function App() {
    const navStyle = {
        padding: "10px 32px 14px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
        borderBottom: "2px solid white",
        position: "sticky",
        top: 0,
        width: "100%",
        boxSizing: "border-box",
        zIndex: 10,
    };
    const brandStyle = { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 };
    const navLinksStyle = { display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", flexWrap: "wrap" };
    const navLinkStyle = { color: "white", textDecoration: "none", fontWeight: 500 };

    return (
        <>
            <nav style={navStyle}>
                <div style={brandStyle}>
                    <span style={{ fontSize: 24, color: "white" }}>🧠 SMART SURVEYS</span>
                </div>
                <div style={navLinksStyle}>
                    <Link to="/login" style={navLinkStyle}>Login</Link>
                    <Link to="/register" style={navLinkStyle}>Cadastro</Link>
                    <Link to="/menu-central" style={navLinkStyle}>Menu</Link>
                    <Link to="/modelos" style={navLinkStyle}>Modelos</Link>
                    <Link to="/pesquisas" style={navLinkStyle}>Pesquisas</Link>
                    <Link to="/pesquisas-em-andamento" style={navLinkStyle}>Em Andamento</Link>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/menu-central" element={<MenuCentral />} />

                {/* Rotas de Modelos */}
                <Route path="/modelos" element={<ListarModelos />} />
                <Route path="/modelos/criar" element={<CriarModelos />} />
                <Route path="/modelos/editar/:id" element={<EditarModelo />} />

                {/* Rotas de Pesquisas (Admin) */}
                <Route path="/pesquisas" element={<Pesquisas />} />
                <Route path="/pesquisas/criar" element={<CriarPesquisa />} />
                <Route path="/selecionar-pesquisa" element={<SelecionarPesquisa />} />
                <Route path="/pesquisas-em-andamento" element={<PesquisasAndamento />} />
                <Route path="/resultados/:id" element={<ParametrosPesquisa />} />
                <Route path="/pesquisas/visualizar/:id" element={<VisualizarPesquisa />} />

                {/* --- NOVAS ROTAS ADICIONADAS --- */}

                {/* 1. Tela para escolher qual modelo enviar */}
                <Route path="/lancar-pesquisas" element={<LancarPesquisas />} />

                {/* 2. Tela para configurar o envio (destinatários) */}
                <Route path="/disparar-pesquisa/:pesquisaId" element={<DispararPesquisa />} />
                {/* 3. Tela pública para o usuário responder (Link do email) */}
                <Route path="/responder/:pesquisaId/:respondenteId" element={<ResponderPesquisa />} />
                {/* ------------------------------- */}

                <Route path="*" element={<div style={{ padding: 40, color: "white", textAlign: "center" }}>404 - Página não encontrada</div>} />
            </Routes>
        </>
    );
}