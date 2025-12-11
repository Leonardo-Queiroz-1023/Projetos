// src/pages/Pesquisas.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";

export default function Pesquisas() {
    const navigate = useNavigate();
    const logged = localStorage.getItem("logged") === "true";

    useEffect(() => {
        if (!logged) {
            navigate("/login?msg=Faça%20login%20para%20acessar%20as%20pesquisas", {
                replace: true,
            });
        }
    }, [logged, navigate]);

    return (
        <div
            style={{
                minHeight: "calc(100vh - 50px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "sans-serif",
            }}
        >
            <PerimeterBox style={{ textAlign: "center", width: "520px" }}>
                <h1 style={{ marginBottom: 20 }}>Pesquisas</h1>
                <p style={{ marginBottom: 25 }}>
                    Selecione uma opção:
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>

                    <button
                        style={btn}
                        onClick={() => navigate("/pesquisas/criar")}
                    >
                        ➕ Criar Nova Pesquisa
                    </button>

                    <button
                        style={btn}
                        onClick={() => navigate("/lancar-pesquisas")}
                    >
                        🚀 Lançar Pesquisa
                    </button>

                    <button
                        style={btn}
                        onClick={() => navigate("/pesquisas-em-andamento")}
                    >
                        🔍 Pesquisas em Andamento
                    </button>

                    <button
                        style={btn}
                        onClick={() => navigate("/resultados")}
                    >
                        📊 Ver Resultados
                    </button>

                    <button style={{ ...btn, background: "#444" }} onClick={() => navigate("/menu-central")}>
                        Voltar ao menu
                    </button>
                </div>
            </PerimeterBox>
        </div>
    );
}

const btn = {
    width: "250px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#000",
    color: "#fff",
    margin: "0 auto",
    fontWeight: "bold",
    fontSize: "14px"
};