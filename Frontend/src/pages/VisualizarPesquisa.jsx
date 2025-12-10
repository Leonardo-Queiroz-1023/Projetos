import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function VisualizarPesquisa() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pesquisa, setPesquisa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        carregarDados();
    }, [id]);

    async function carregarDados() {
        try {
            setLoading(true);
            setErro(null);
            const data = await api.getPesquisaById(id);
            setPesquisa(data);
        } catch (e) {
            console.error(e);
            setErro("Erro ao carregar dados da pesquisa.");
        } finally {
            setLoading(false);
        }
    }

    const getStatus = (dataFim) => {
        if (!dataFim) return "-";
        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        const fim = new Date(dataFim + "T23:59:59");
        return fim >= hoje ?
            <span style={{color: "#4f4", fontWeight: "bold"}}>Em andamento</span> :
            <span style={{color: "#f55", fontWeight: "bold"}}>Encerrada</span>;
    };

    if (loading) return <div style={container}><p>Carregando...</p></div>;
    if (erro) return <div style={container}><p style={{color: "red"}}>{erro}</p><button onClick={() => navigate(-1)}>Voltar</button></div>;
    if (!pesquisa) return <div style={container}><p>Pesquisa não encontrada.</p></div>;

    return (
        <div style={container}>
            <PerimeterBox style={{ width: "600px", padding: 0 }}>
                <div style={card}>
                    <h2 style={{ textAlign: "center", marginBottom: 20 }}>Detalhes da Pesquisa</h2>

                    <div style={row}>
                        <label style={label}>ID:</label>
                        <span style={value}>#{pesquisa.id}</span>
                    </div>

                    <div style={row}>
                        <label style={label}>Nome da Campanha:</label>
                        <span style={value}>{pesquisa.nome}</span>
                    </div>

                    <div style={row}>
                        <label style={label}>Modelo Utilizado:</label>
                        <span style={value}>
                            {pesquisa.modeloNome || pesquisa.modelo?.nome || ("ID " + (pesquisa.modeloId || pesquisa.modelo?.id))}
                        </span>
                    </div>

                    <div style={{...row, borderTop: "1px solid #333", paddingTop: 15, marginTop: 10}}>
                        <div style={{flex: 1}}>
                            <label style={label}>Data Início:</label>
                            <span style={value}>{new Date(pesquisa.dataInicio).toLocaleDateString()}</span>
                        </div>
                        <div style={{flex: 1}}>
                            <label style={label}>Data Fim:</label>
                            <span style={value}>{new Date(pesquisa.dataFinal).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div style={row}>
                        <label style={label}>Status Atual:</label>
                        <span style={value}>{getStatus(pesquisa.dataFinal)}</span>
                    </div>

                    <div style={{ marginTop: 30, textAlign: "center" }}>
                        {/* --- CORREÇÃO AQUI --- */}
                        <button
                            onClick={() => navigate(-1)} // Volta para a página anterior (histórico)
                            style={btnVoltar}
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </PerimeterBox>
        </div>
    );
}

// Estilos
const container = { minHeight: "calc(100vh - 50px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", padding: 20 };
const card = { background: "#0b0b0b", borderRadius: 18, padding: 30, color: "#fff" };
const row = { marginBottom: 15, display: "flex", flexDirection: "column" };
const label = { fontSize: 13, color: "#888", marginBottom: 4, fontWeight: "bold", textTransform: "uppercase" };
const value = { fontSize: 16, color: "#fff" };
const btnVoltar = { padding: "10px 24px", background: "#333", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14, fontWeight: "bold" };