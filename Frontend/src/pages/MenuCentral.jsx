import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";

export default function MenuCentral() {
    const navigate = useNavigate();
    const nomeExibicao = localStorage.getItem("nome_usuario") || "Usuário";

    const logged = localStorage.getItem("logged") === "true";

    useEffect(() => {
        if (!logged) {
            navigate("/login?msg=Faça%20login%20para%20acessar%20o%20menu", { replace: true });
        }
    }, [logged, navigate]);
    function logout() {
        localStorage.removeItem("nome_usuario");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("logged");
        localStorage.removeItem("usuarioId");
        navigate("/login", { replace: true });
    }
    if (!logged) return null;
    return (
        <div style={outer}>
            <PerimeterBox style={{ padding: 0, background: "transparent", boxShadow: "none" }}>
                <div style={blackCard}>
                    <header style={header}>
                        <h2 style={{ margin: 0, fontSize: "28px" }}>SMART SURVEYS</h2>
                        <div style={{ color: "#ddd", fontSize: 16 }}>Bem-vinda(o), {nomeExibicao}</div>
                    </header>

                    <main style={gridContainer}>
                        <button style={bigCardButton} onClick={() => navigate("/modelos")}>
                            <span style={{ fontSize: "40px", display: "block", marginBottom: 10 }}>📂</span>
                            Gerenciar Modelos
                        </button>

                        <button style={bigCardButton} onClick={() => navigate("/pesquisas")}>
                            <span style={{ fontSize: "40px", display: "block", marginBottom: 10 }}>📋</span>
                            Minhas Pesquisas
                        </button>

                        <button style={wideCardButton} onClick={() => navigate("/resultados")}>
                            <span style={{ marginRight: 15, fontSize: "24px" }}>📊</span>
                            Ver Resultados e Relatórios
                        </button>

                        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center", marginTop: 20 }}>
                            <button style={logoutBtn} onClick={logout}>Sair</button>
                        </div>
                    </main>
                </div>
            </PerimeterBox>
        </div>
    );
}

const outer = {
    minHeight: "calc(100vh - 50px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
    padding: 20,
};

const blackCard = {
    width: 720,
    maxWidth: "94vw",
    background: "#0b0b0b",
    borderRadius: 24,
    padding: 40,
    color: "#fff",
    boxSizing: "border-box",
    border: "6px solid #000",
};

const header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    borderBottom: "1px solid #333",
    paddingBottom: 20,
};

const gridContainer = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
};

const bigCardButton = {
    background: "#e9e9e9",
    color: "#111",
    borderRadius: 16,
    padding: "30px",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: "bold",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
    transition: "transform 0.2s",
};

const wideCardButton = {
    gridColumn: "1 / -1",
    background: "#e9e9e9",
    color: "#111",
    borderRadius: 16,
    padding: "20px",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80px",
};

const logoutBtn = {
    background: "#86c6ff",
    color: "#023047",
    border: "none",
    padding: "12px 40px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 16,
};