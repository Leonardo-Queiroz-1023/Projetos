import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function DispararPesquisa() {
    const navigate = useNavigate();

    // MUDANÇA 1: Agora esperamos o ID da pesquisa já existente, não do modelo
    const { pesquisaId } = useParams();

    const [pesquisa, setPesquisa] = useState(null);
    const [textoDestinatarios, setTextoDestinatarios] = useState("");

    // Estados de controle
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", msg: "" });
    const [progressoEnvio, setProgressoEnvio] = useState("");

    useEffect(() => {
        carregarDadosPesquisa();
    }, [pesquisaId]);

    async function carregarDadosPesquisa() {
        try {
            // MUDANÇA 2: Buscamos a pesquisa existente para saber o nome dela
            // Supondo que você tenha um endpoint api.getPesquisaById
            const data = await api.getPesquisaById(pesquisaId);
            setPesquisa(data);
        } catch (error) {
            console.error(error);
            setStatus({ type: "error", msg: "Erro ao carregar dados da pesquisa." });
        }
    }

    function processarEmails(texto) {
        if (!texto) return [];
        return texto.split(/[\n,;]+/)
            .map(e => e.trim())
            .filter(e => e !== "");
    }

    async function handleDisparar(e) {
        e.preventDefault();
        setStatus({ type: "", msg: "" });
        setProgressoEnvio("");

        const listaEmails = processarEmails(textoDestinatarios);

        if (listaEmails.length === 0) {
            setStatus({ type: "error", msg: "Insira ao menos um e-mail." });
            return;
        }

        try {
            setLoading(true);

            // ==========================================================
            // MUDANÇA 3: NÃO CRIAMOS MAIS A PESQUISA.
            // VAMOS DIRETO PARA O ENVIO.
            // ==========================================================

            let enviados = 0;
            let erros = 0;

            for (const email of listaEmails) {
                enviados++;
                setProgressoEnvio(`Enviando e-mail ${enviados} de ${listaEmails.length}...`);

                try {
                    // Usamos o pesquisaId que veio da URL (que já existe)
                    await api.dispararPesquisaIndividual({
                        pesquisaId: parseInt(pesquisaId),
                        nome: "Participante",
                        email: email
                    });
                } catch (err) {
                    console.error(`Falha ao enviar para ${email}`, err);
                    erros++;
                }
            }

            if (erros === 0) {
                setStatus({ type: "success", msg: `Sucesso! Convites enviados para ${enviados} pessoas.` });
                // Redireciona de volta ou para uma tela de relatório
                setTimeout(() => navigate("/pesquisas-em-andamento"), 2000);
            } else {
                setStatus({ type: "warning", msg: `Finalizado, mas houve erro em ${erros} envios.` });
            }

        } catch (error) {
            setStatus({ type: "error", msg: "Erro crítico: " + (error.message || "") });
        } finally {
            setLoading(false);
            setProgressoEnvio("");
        }
    }

    if (!pesquisa) return <div style={styles.center}>Carregando dados da pesquisa...</div>;

    return (
        <div style={styles.center}>
            <PerimeterBox style={{ width: "100%", maxWidth: "600px" }}>
                <h2 style={{ marginBottom: 5 }}>📨 Enviar Convites</h2>
                <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: 20 }}>
                    Pesquisa Selecionada: <strong>{pesquisa.nome}</strong>
                </p>

                <form onSubmit={handleDisparar}>
                    {/* Removemos o campo de editar título, pois a pesquisa já tem nome */}

                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            Destinatários <small style={{ fontWeight: "normal", color: "#888" }}>(separe por Enter ou vírgula)</small>
                        </label>
                        <textarea
                            value={textoDestinatarios}
                            onChange={(e) => setTextoDestinatarios(e.target.value)}
                            style={styles.textarea}
                            placeholder="joao@empresa.com&#10;maria@empresa.com"
                            disabled={loading}
                        />
                    </div>

                    {loading && (
                        <div style={{ marginBottom: 20, padding: 10, background: "#f0f0f0", borderRadius: 6, textAlign: "center" }}>
                            ⏳ {progressoEnvio}
                        </div>
                    )}

                    {status.msg && (
                        <div style={{
                            ...styles.statusBox,
                            background: status.type === "error" ? "#ffe6e6" : status.type === "warning" ? "#fff3cd" : "#e6fffa",
                            color: status.type === "error" ? "#d8000c" : status.type === "warning" ? "#856404" : "#007055",
                        }}>
                            {status.msg}
                        </div>
                    )}

                    <div style={styles.actions}>
                        <button
                            type="button"
                            onClick={() => navigate(-1)} // Volta para a tela anterior
                            style={styles.btnSecondary}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            // Correção do estilo inline que fiz na resposta anterior
                            style={{
                                ...styles.btnPrimary,
                                opacity: (loading || status.type === "success") ? 0.7 : 1,
                                cursor: (loading || status.type === "success") ? "not-allowed" : "pointer"
                            }}
                            disabled={loading || status.type === "success"}
                        >
                            {loading ? "Enviando..." : "🚀 Disparar E-mails"}
                        </button>
                    </div>
                </form>
            </PerimeterBox>
        </div>
    );
}

const styles = {
    center: {
        minHeight: "calc(100vh - 50px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "#f4f4f4",
    },
    formGroup: { marginBottom: "20px" },
    label: { display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" },
    textarea: {
        width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc",
        fontSize: "0.9rem", minHeight: "150px", fontFamily: "monospace", boxSizing: "border-box", resize: "vertical"
    },
    statusBox: { padding: "12px", borderRadius: "6px", marginBottom: "20px", fontSize: "0.9rem" },
    actions: { display: "flex", justifyContent: "flex-end", gap: "10px" },
    btnPrimary: {
        padding: "12px 24px", borderRadius: "6px", border: "none",
        background: "#000", color: "#fff", fontWeight: "600", transition: "background 0.2s"
    },
    btnSecondary: {
        padding: "12px 20px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer",
        background: "#fff", color: "#333", fontWeight: "500"
    }
};