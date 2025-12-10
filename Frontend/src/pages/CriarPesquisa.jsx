// src/pages/CriarPesquisa.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function CriarPesquisa() {
    const navigate = useNavigate();

    // Estados do formulário
    const [nome, setNome] = useState("");
    const [modeloId, setModeloId] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFinal, setDataFinal] = useState("");

    // Dados para popular o select
    const [listaModelos, setListaModelos] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        carregarModelos();
    }, []);

    const carregarModelos = async () => {
        try {
            const dados = await api.getModelos();
            setListaModelos(dados || []);
            if (dados && dados.length > 0) {
                setModeloId(dados[0].id);
            }
        } catch (error) {
            console.error("Erro ao carregar modelos", error);
            setMessage("Erro: Não foi possível carregar os modelos.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Bloqueio imediato se já estiver carregando
        if (loading) return;

        setLoading(true);
        setMessage("");

        // Validação simples
        if (!modeloId) {
            setMessage("Selecione um modelo válido.");
            setLoading(false); // Desbloqueia para corrigir
            return;
        }

        try {
            const payload = {
                nome,
                modeloId,
                dataInicio,
                dataFinal
            };

            await api.createPesquisa(payload);

            setMessage("✅ Pesquisa criada com sucesso!");

            // 2. Mantenha o loading = true enquanto espera o redirecionamento
            // Não usamos 'finally' aqui para evitar cliques extras neste intervalo
            setTimeout(() => {
                navigate("/pesquisas");
            }, 1000);

        } catch (error) {
            console.error("Erro ao criar pesquisa:", error);
            setMessage("❌ Erro ao criar pesquisa. Verifique as datas, conexão ou se o modelo tem perguntas.");

            // 3. Só desbloqueia se der erro, para tentar novamente
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "calc(100vh - 50px)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <PerimeterBox style={{ width: 500 }}>
                <h2 style={{ marginBottom: 20 }}>Nova Pesquisa</h2>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>
                        Nome da Campanha
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            style={styles.input}
                            placeholder="Ex: Satisfação Q1 2025"
                            required
                        />
                    </label>

                    <label style={styles.label}>
                        Modelo de Perguntas
                        {listaModelos.length === 0 ? (
                            <div style={{color: "#f55", fontSize: 13}}>Nenhum modelo cadastrado. Crie um modelo antes.</div>
                        ) : (
                            <select
                                value={modeloId}
                                onChange={(e) => setModeloId(e.target.value)}
                                style={styles.select}
                                required
                            >
                                {listaModelos.map(m => (
                                    <option key={m.id} value={m.id}>
                                        {m.nome}
                                    </option>
                                ))}
                            </select>
                        )}
                    </label>

                    <div style={{ display: "flex", gap: 15 }}>
                        <label style={{ ...styles.label, flex: 1 }}>
                            Data Início
                            <input
                                type="date"
                                value={dataInicio}
                                onChange={(e) => setDataInicio(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </label>

                        <label style={{ ...styles.label, flex: 1 }}>
                            Data Final
                            <input
                                type="date"
                                value={dataFinal}
                                onChange={(e) => setDataFinal(e.target.value)}
                                style={styles.input}
                                required
                            />
                        </label>
                    </div>

                    <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.buttonPrimary,
                                opacity: loading ? 0.6 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? "Salvando..." : "Lançar Pesquisa"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/pesquisas")}
                            style={styles.buttonSecondary}
                            disabled={loading} // Opcional: Bloquear cancelar
                        >
                            Cancelar
                        </button>
                    </div>
                </form>

                {message && <p style={{ marginTop: 15, fontWeight: "bold", color: message.startsWith("✅") ? "#4f4" : "#f55" }}>{message}</p>}
            </PerimeterBox>
        </div>
    );
}

const styles = {
    form: { display: "flex", flexDirection: "column", gap: 16 },
    label: { display: "flex", flexDirection: "column", gap: 6, fontSize: 14, color: "#ccc" },
    input: { padding: 10, borderRadius: 6, border: "1px solid #444", background: "#111", color: "#fff", outline: "none" },
    select: { padding: 10, borderRadius: 6, border: "1px solid #444", background: "#111", color: "#fff", outline: "none" },
    buttonPrimary: { padding: 12, background: "#1ea8ff", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: "bold", flex: 1 },
    buttonSecondary: { padding: 12, background: "#444", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer", width: 100 },
};