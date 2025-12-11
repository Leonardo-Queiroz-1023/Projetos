import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function PesquisasAndamento() {
    const navigate = useNavigate();

    const [pesquisas, setPesquisas] = useState([]);
    const [modelos, setModelos] = useState([]);
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

    const getStatus = (dataFim) => {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const fim = new Date(dataFim + "T23:59:59");
        return fim >= hoje ? "Em andamento" : "Encerrada";
    };

    if (!logged) return null;

    return (
        <div style={{ minHeight: "calc(100vh - 50px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
            <PerimeterBox style={{ textAlign: "center", width: "900px", maxWidth: "95vw" }}>
                <h1 style={{ marginBottom: 20 }}>📊 Consultar Pesquisas</h1>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 20 }}>
                    <select
                        value={tipoFiltro}
                        onChange={(e) => { setTipoFiltro(e.target.value); setErro(null); }}
                        style={selectStyle}
                    >
                        <option value="TODAS">Todas as Pesquisas</option>
                        <option value="ATIVAS">Apenas Ativas</option>
                        <option value="MODELO">Por Modelo</option>
                        <option value="DATA_INICIO">Por Data de Início</option>
                        <option value="DATA_FINAL">Por Data de Fim</option>
                    </select>

                    {tipoFiltro === "MODELO" && (
                        <select value={modeloSelecionado} onChange={(e) => setModeloSelecionado(e.target.value)} style={selectStyle}>
                            {modelos.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                        </select>
                    )}

                    {(tipoFiltro === "DATA_INICIO" || tipoFiltro === "DATA_FINAL") && (
                        <input type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} style={selectStyle} />
                    )}

                    <button onClick={buscarPesquisas} style={btn} disabled={loading}>
                        {loading ? "⏳" : "🔍"} Buscar
                    </button>

                    <button style={{ ...btn, background: "#444" }} onClick={() => navigate("/menu-central")}>
                        Voltar
                    </button>
                </div>

                {erro && <p style={{ color: "red", marginTop: 10 }}>❌ {erro}</p>}

                <div style={{ marginTop: 20, textAlign: "left" }}>
                    {pesquisas.length === 0 ? (
                        <p style={{ color: "#666", textAlign: "center" }}>📭 Nenhuma pesquisa encontrada.</p>
                    ) : (
                        pesquisas.map((p) => (
                            <div key={p.id} style={{ border: "2px solid #000", borderRadius: "8px", padding: "16px", marginBottom: "16px", background: "#fff" }}>
                                <h3 style={{ marginBottom: 8 }}>{p.nome}</h3>
                                <p style={{ marginBottom: 8, color: "#555", fontSize: 14 }}>
                                    Modelo: {p.modeloNome || (p.modelo?.nome) || "-"}
                                </p>
                                <p style={{ marginBottom: 8, color: "#555", fontSize: 14 }}>
                                    Início: {new Date(p.dataInicio).toLocaleDateString()} • Fim: {new Date(p.dataFinal).toLocaleDateString()}
                                </p>
                                <p style={{ marginBottom: 10, color: "#555", fontSize: 14 }}>
                                    Status: <strong>{getStatus(p.dataFinal)}</strong>
                                </p>
                                <div style={{ display: "flex", gap: 10 }}>
                                    <button style={{ ...btn, width: "auto", background: "#0077cc" }} onClick={() => navigate(`/pesquisas/visualizar/${p.id}`)}>
                                        👁️ Ver
                                    </button>
                                    <button style={{ ...btn, width: "auto" }} onClick={() => navigate(`/resultados/`)}>
                                        📊 Resultados
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </PerimeterBox>
        </div>
    );
}

const btn = {
    width: "200px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#000",
    color: "#fff",
    margin: "0 auto",
};

const selectStyle = {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#222",
    color: "#fff",
    minWidth: "150px",
};