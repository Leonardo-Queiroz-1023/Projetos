import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function PesquisasAndamento() {
    const navigate = useNavigate();

    // Estado dos dados
    const [pesquisas, setPesquisas] = useState([]);
    const [modelos, setModelos] = useState([]);

    // Estados dos filtros
    const [tipoFiltro, setTipoFiltro] = useState("TODAS");
    const [modeloSelecionado, setModeloSelecionado] = useState("");
    const [dataSelecionada, setDataSelecionada] = useState("");

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const logged = localStorage.getItem("logged") === "true";

    useEffect(() => {
        if (!logged) {
            navigate("/login?msg=Faça%20login%20para%20acessar%20os%20resultados", { replace: true });
        } else {
            carregarModelos();
            buscarPesquisas();
        }
    }, [logged, navigate]);

    async function carregarModelos() {
        try {
            const data = await api.getModelos();
            setModelos(data || []);
            if (data && data.length > 0) setModeloSelecionado(data[0].id);
        } catch (e) {
            console.error("Erro ao carregar modelos", e);
        }
    }

    async function buscarPesquisas() {
        setLoading(true);
        setErro(null);
        setPesquisas([]);

        try {
            let data = [];
            switch (tipoFiltro) {
                case "TODAS":
                    data = await api.getPesquisasTodas();
                    break;
                case "ATIVAS":
                    data = await api.getPesquisasAtivas();
                    break;
                case "MODELO":
                    if (!modeloSelecionado) throw new Error("Selecione um modelo.");
                    data = await api.getPesquisasPorModelo(modeloSelecionado);
                    break;
                case "DATA_INICIO":
                    if (!dataSelecionada) throw new Error("Selecione uma data.");
                    data = await api.getPesquisasPorDataInicio(dataSelecionada);
                    break;
                case "DATA_FINAL":
                    if (!dataSelecionada) throw new Error("Selecione uma data.");
                    data = await api.getPesquisasPorDataFinal(dataSelecionada);
                    break;
                default:
                    data = [];
            }
            setPesquisas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setErro(error.message || "Erro ao buscar pesquisas.");
        } finally {
            setLoading(false);
        }
    }

    // --- NOVA FUNÇÃO DE DELETAR ---
    async function handleDeletar(id) {
        // Confirmação para evitar cliques acidentais
        if (!window.confirm("Tem certeza que deseja deletar esta pesquisa? Essa ação não pode ser desfeita.")) {
            return;
        }

        try {
            await api.deletarPesquisa(id);

            // Remove a pesquisa da lista visualmente sem precisar recarregar a página
            setPesquisas((prevPesquisas) => prevPesquisas.filter(p => p.id !== id));

            alert("Pesquisa deletada com sucesso!");
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert("Erro ao tentar deletar a pesquisa.");
        }
    }

    const getStatus = (dataFim) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const fim = new Date(dataFim + "T23:59:59");
        return fim >= hoje ?
            <span style={{ color: "#4f4" }}>Em andamento</span> :
            <span style={{ color: "#f55" }}>Encerrada</span>;
    };

    if (!logged) return null;

    return (
        <div style={outer}>
            <PerimeterBox style={{ width: "1000px", padding: 0 }}>
                <div style={blackCard}>
                    <h2 style={title}>Consultar Pesquisas</h2>

                    <div style={filterArea}>
                        {/* ... (código dos filtros mantido igual) ... */}
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={filterGroup}>
                                <label style={label}>Buscar por:</label>
                                <select
                                    value={tipoFiltro}
                                    onChange={(e) => {
                                        setTipoFiltro(e.target.value);
                                        setErro(null);
                                    }}
                                    style={select}
                                >
                                    <option value="TODAS">Todas as Pesquisas</option>
                                    <option value="ATIVAS">Apenas Ativas (Hoje)</option>
                                    <option value="MODELO">Por Modelo</option>
                                    <option value="DATA_INICIO">Por Data de Início</option>
                                    <option value="DATA_FINAL">Por Data de Fim</option>
                                </select>
                            </div>

                            {tipoFiltro === "MODELO" && (
                                <div style={filterGroup}>
                                    <label style={label}>Selecione o Modelo:</label>
                                    <select
                                        value={modeloSelecionado}
                                        onChange={(e) => setModeloSelecionado(e.target.value)}
                                        style={select}
                                    >
                                        {modelos.map(m => (
                                            <option key={m.id} value={m.id}>{m.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {(tipoFiltro === "DATA_INICIO" || tipoFiltro === "DATA_FINAL") && (
                                <div style={filterGroup}>
                                    <label style={label}>Selecione a Data:</label>
                                    <input
                                        type="date"
                                        value={dataSelecionada}
                                        onChange={(e) => setDataSelecionada(e.target.value)}
                                        style={input}
                                    />
                                </div>
                            )}

                            <button onClick={buscarPesquisas} style={searchBtn}>
                                🔍 Buscar
                            </button>
                        </div>
                    </div>

                    <div style={listBox}>
                        {loading && <p style={{ padding: 20, textAlign: "center" }}>⏳ Carregando...</p>}
                        {erro && <p style={{ padding: 20, color: "#f55", textAlign: "center" }}>⚠️ {erro}</p>}

                        {!loading && !erro && pesquisas.length === 0 && (
                            <p style={{ padding: 20, textAlign: "center", color: "#666" }}>Nenhuma pesquisa encontrada.</p>
                        )}

                        {!loading && pesquisas.length > 0 && (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                                    <th style={th}>Nome</th>
                                    <th style={th}>Modelo</th>
                                    <th style={{...th, textAlign: 'center'}}>Respondentes</th>
                                    <th style={th}>Início</th>
                                    <th style={th}>Fim</th>
                                    <th style={th}>Status</th>
                                    <th style={th}>Ação</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pesquisas.map((p) => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                                        <td style={td}><strong>{p.nome}</strong></td>
                                        <td style={td}>
                                            {p.modeloNome || (p.modelo && p.modelo.nome ? p.modelo.nome : (p.modeloId ? "Mod. " + p.modeloId : "-"))}
                                        </td>
                                        <td style={{...td, textAlign: 'center'}}>
                                                <span style={{
                                                    background: '#333',
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '13px',
                                                    fontWeight: 'bold',
                                                    color: '#fff',
                                                    border: '1px solid #444'
                                                }}>
                                                    {p.totalRespondentes || 0}
                                                </span>
                                        </td>
                                        <td style={td}>{new Date(p.dataInicio).toLocaleDateString()}</td>
                                        <td style={td}>{new Date(p.dataFinal).toLocaleDateString()}</td>
                                        <td style={td}>{getStatus(p.dataFinal)}</td>
                                        <td style={td}>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button
                                                    onClick={() => navigate(`/pesquisas/visualizar/${p.id}`)}
                                                    style={{ ...actionBtn, background: "#0077cc" }}
                                                    title="Ver detalhes da pesquisa"
                                                >
                                                    👁️ Ver
                                                </button>

                                                <button
                                                    onClick={() => navigate(`/resultados/`)}
                                                    style={actionBtn}
                                                >
                                                    📊 Resultados
                                                </button>

                                                {/* --- NOVO BOTÃO DE DELETAR --- */}
                                                <button
                                                    onClick={() => handleDeletar(p.id)}
                                                    style={{ ...actionBtn, background: "#d32f2f", color: "white" }}
                                                    title="Deletar pesquisa"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <button style={backBtn} onClick={() => navigate("/pesquisas")}>
                        Voltar
                    </button>
                </div>
            </PerimeterBox>
        </div>
    );
}

const outer = { minHeight: "calc(100vh - 50px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: 20 };
const blackCard = { background: "#0b0b0b", borderRadius: 18, padding: 24, color: "#fff", minHeight: 400 };
const title = { textAlign: "center", margin: "0 0 20px 0", fontSize: 20 };
const filterArea = { background: "#151515", padding: 15, borderRadius: 8, marginBottom: 20, border: "1px solid #333" };
const filterGroup = { display: "flex", flexDirection: "column", gap: 5 };
const label = { fontSize: 12, color: "#aaa", fontWeight: "bold" };
const select = { padding: "8px 12px", borderRadius: 6, border: "1px solid #444", background: "#222", color: "#fff", minWidth: 150 };
const input = { padding: "8px 12px", borderRadius: 6, border: "1px solid #444", background: "#222", color: "#fff" };
const searchBtn = { padding: "10px 20px", background: "#1ea8ff", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold", marginTop: 18 };
const listBox = { background: "#111", borderRadius: 8, padding: "10px", minHeight: 200 };
const th = { padding: 10, textAlign: 'left', fontSize: 13 };
const td = { padding: 10, fontSize: 14 };
const actionBtn = { padding: "6px 12px", background: "#333", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 };
const backBtn = { marginTop: 20, padding: "8px 18px", background: "#f4b7ac", color: "#1a1a1a", border: "none", borderRadius: 6, cursor: "pointer", display: "block", margin: "20px auto 0" };