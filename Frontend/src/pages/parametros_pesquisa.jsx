// src/pages/ResultadosGerais.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function ResultadosGerais() {
    const navigate = useNavigate();

    // Estado para o Dropdown (Lista de pesquisas disponíveis)
    const [listaPesquisas, setListaPesquisas] = useState([]);
    const [pesquisaSelecionada, setPesquisaSelecionada] = useState(""); // ID da pesquisa escolhida

    // Estados dos Gráficos
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);

    // 1. Ao abrir a tela, carrega a lista para o Dropdown
    useEffect(() => {
        carregarListaDePesquisas();
    }, []);

    // 2. Sempre que mudar a seleção do dropdown, busca os resultados
    useEffect(() => {
        if (pesquisaSelecionada) {
            carregarResultados(pesquisaSelecionada);
        } else {
            setResultados([]); // Limpa se desmarcar
        }
    }, [pesquisaSelecionada]);

    async function carregarListaDePesquisas() {
        try {
            const data = await api.getPesquisasTodas(); // Certifique-se que essa função existe no api.js
            setListaPesquisas(data || []);
        } catch (error) {
            console.error("Erro ao listar pesquisas", error);
            setErro("Não foi possível carregar a lista de pesquisas.");
        }
    }

    async function carregarResultados(id) {
        try {
            setLoading(true);
            setErro(null);

            console.log(`--- CARREGANDO RESULTADOS ID: ${id} ---`);
            const data = await api.getResultadosPesquisa(id);

            const listaRespostas = Array.isArray(data) ? data : [];
            const estatisticas = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

            listaRespostas.forEach((submissao) => {
                if (!submissao || !submissao.respostas) return;

                submissao.respostas.forEach((resposta) => {
                    if (!resposta || !resposta.texto) return;
                    const valor = parseInt(resposta.texto, 10);
                    if (!isNaN(valor) && valor >= 1 && valor <= 5) {
                        estatisticas[valor]++;
                    }
                });
            });

            const dadosFormatados = [5, 4, 3, 2, 1].map((nota) => ({
                nota: nota,
                quantidade: estatisticas[nota],
            }));

            setResultados(dadosFormatados);
        } catch (e) {
            console.error(e);
            setErro("Erro ao processar resultados desta pesquisa.");
        } finally {
            setLoading(false);
        }
    }

    // --- CÁLCULOS ---
    const totalAvaliacoes = resultados.reduce(
        (acc, r) => acc + r.quantidade,
        0
    );
    const somaNotas = resultados.reduce(
        (acc, r) => acc + r.nota * r.quantidade,
        0
    );
    const media =
        totalAvaliacoes > 0 ? (somaNotas / totalAvaliacoes).toFixed(1) : "0.0";

    function renderEstrelas(valorNota) {
        const cheias = Math.floor(valorNota);
        const vazias = 5 - cheias;
        return (
            <span style={{ color: "#f5c518", fontSize: 24, letterSpacing: "2px" }}>
                {"★".repeat(isNaN(cheias) ? 0 : cheias)}
                <span style={{ color: "#444" }}>
                    {"★".repeat(isNaN(vazias) ? 5 : vazias)}
                </span>
            </span>
        );
    }

    function getCorBarra(nota) {
        const cores = {
            5: "#4CAF50",
            4: "#8BC34A",
            3: "#FFC107",
            2: "#FF9800",
            1: "#f44336",
        };
        return cores[nota] || "#ccc";
    }

    return (
        <div
            style={{
                // mesmo esquema da página de Login
                minHeight: "calc(100vh - 50px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "sans-serif",
            }}
        >
            <PerimeterBox
                style={{
                    width: "700px",
                    maxWidth: "95vw",
                    padding: 0,
                    overflow: "hidden",
                }}
            >
                <div style={blackCard}>
                    <header
                        style={{
                            marginBottom: 30,
                            textAlign: "center",
                            borderBottom: "1px solid #333",
                            paddingBottom: 20,
                        }}
                    >
                        <h2 style={title}>📊 DASHBOARD DE RESULTADOS</h2>
                        <p
                            style={{
                                color: "#888",
                                fontSize: 14,
                                marginBottom: 15,
                            }}
                        >
                            Selecione uma pesquisa para ver os gráficos
                        </p>

                        <select
                            value={pesquisaSelecionada}
                            onChange={(e) => setPesquisaSelecionada(e.target.value)}
                            style={dropdownStyle}
                        >
                            <option value="">-- Selecione uma Pesquisa --</option>
                            {listaPesquisas.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nome} (
                                    {new Date(p.dataInicio).toLocaleDateString()}) —{" "}
                                    {p.totalRespondentes || 0} respostas
                                </option>
                            ))}
                        </select>
                    </header>

                    {/* --- FEEDBACK DE ESTADO --- */}
                    {loading && (
                        <p
                            style={{
                                color: "#fff",
                                textAlign: "center",
                                padding: 20,
                            }}
                        >
                            ⏳ Analisando dados...
                        </p>
                    )}

                    {erro && (
                        <div
                            style={{
                                background: "#3e1a1a",
                                color: "#ff8888",
                                padding: 15,
                                borderRadius: 6,
                                textAlign: "center",
                                margin: 20,
                            }}
                        >
                            {erro}
                        </div>
                    )}

                    {!pesquisaSelecionada && !loading && (
                        <div
                            style={{
                                textAlign: "center",
                                color: "#555",
                                padding: 40,
                            }}
                        >
                            👆 Escolha uma pesquisa acima para começar.
                        </div>
                    )}

                    {/* --- CONTEÚDO DOS GRÁFICOS --- */}
                    {pesquisaSelecionada && !loading && !erro && (
                        <div style={contentRow}>
                            {/* MÉDIA */}
                            <div style={mediaCard}>
                                <div style={mediaNumero}>{media}</div>
                                <div style={{ marginBottom: 8 }}>
                                    {renderEstrelas(parseFloat(media))}
                                </div>
                                <div style={mediaTexto}>
                                    {totalAvaliacoes} perguntas respondidas
                                </div>
                            </div>

                            {/* BARRAS */}
                            <div style={barrasContainer}>
                                {resultados.map((item) => {
                                    const porcentagem =
                                        totalAvaliacoes > 0
                                            ? (item.quantidade / totalAvaliacoes) * 100
                                            : 0;

                                    return (
                                        <div
                                            key={item.nota}
                                            style={barraRow}
                                            onClick={() =>
                                                navigate(
                                                    `/resultados-detalhe/${pesquisaSelecionada}/${item.nota}`
                                                )
                                            }
                                        >
                                            <span style={barraLabel}>{item.nota} ★</span>

                                            <div style={barraTrack}>
                                                <div
                                                    style={{
                                                        ...barraFill,
                                                        width: `${porcentagem}%`,
                                                        background: getCorBarra(item.nota),
                                                    }}
                                                />
                                            </div>

                                            <div style={statsRight}>
                                                <span
                                                    style={{
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {Math.round(porcentagem)}%
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        color: "#666",
                                                    }}
                                                >
                                                    ({item.quantidade})
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <button
                        style={backBtn}
                        onClick={() => navigate("/menu-central")}
                    >
                        ⬅ Voltar ao Menu
                    </button>
                </div>
            </PerimeterBox>
        </div>
    );
}

// --- ESTILOS ---

// agora o fundo da página NÃO é mais branco – quem manda é o body (estampa)
// o “card” escuro fica só dentro do PerimeterBox, como um dashboard
const blackCard = {
    background: "#1a1a1a",
    borderRadius: 10,
    padding: 30,
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
};

const title = {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
};

const dropdownStyle = {
    padding: "10px 15px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#252525",
    color: "#fff",
    fontSize: "1rem",
    width: "100%",
    maxWidth: "400px",
    cursor: "pointer",
    outline: "none",
};

const contentRow = {
    display: "flex",
    gap: 40,
    justifyContent: "center",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 20,
};

const mediaCard = {
    textAlign: "center",
    minWidth: 140,
    padding: 20,
    background: "#252525",
    borderRadius: 12,
};

const mediaNumero = {
    fontSize: 64,
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1,
};

const mediaTexto = {
    fontSize: 13,
    color: "#aaa",
    marginTop: 5,
};

const barrasContainer = {
    flex: 1,
    minWidth: 300,
    maxWidth: 450,
};

const barraRow = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    cursor: "pointer",
    padding: "6px 8px",
    borderRadius: 6,
    transition: "background 0.2s",
};

const barraLabel = {
    width: 30,
    fontSize: 14,
    color: "#eee",
    fontWeight: "bold",
};

const barraTrack = {
    flex: 1,
    height: 10,
    background: "#333",
    borderRadius: 10,
    overflow: "hidden",
};

const barraFill = {
    height: "100%",
    borderRadius: 10,
    transition: "width 0.8s ease",
};

const statsRight = {
    width: 60,
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    lineHeight: 1,
};

const backBtn = {
    marginTop: 30,
    padding: "10px 25px",
    background: "transparent",
    color: "#888",
    border: "1px solid #444",
    borderRadius: 6,
    cursor: "pointer",
    display: "block",
    marginInline: "auto",
    fontWeight: 600,
};
