// src/pages/Pesquisas.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Pesquisas() {
    const navigate = useNavigate();
    const logged = localStorage.getItem("logged") === "true";

    useEffect(() => {
        if (!logged) {
            navigate("/login?msg=Logue%20antes%20de%20acessar%20pesquisas", {
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
            <div style={{ textAlign: "center" }}>
                <h1 style={{ marginBottom: 20 }}>Pesquisas</h1>
                <p style={{ marginBottom: 25 }}>
                    Selecione uma área de pesquisas.
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
                        onClick={() => alert("Funcionalidade futura: Agendamento")}
                    >
                        Agendamento
                    </button>

                    <button
                        style={btn}
                        onClick={() => alert("Funcionalidade futura: Ver apps")}
                    >
                        Resultados app
                    </button>

                    <button style={{ ...btn, background: "#444" }} onClick={() => navigate("/menu-central")}>
                        Voltar ao menu
                    </button>
                </div>
            </div>
        </div>
    );
}

const btn = {
    width: "220px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#000",
    color: "#fff",
    margin: "0 auto",
    fontWeight: "bold"
};