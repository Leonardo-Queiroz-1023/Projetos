import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function ListarModelos() {
    const [modelos, setModelos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [modeloExpandido, setModeloExpandido] = useState(null);
    const [perguntas, setPerguntas] = useState([]);
    const [novaPergunta, setNovaPergunta] = useState("");
    const [editandoPergunta, setEditandoPergunta] = useState(null);
    const [textoEditado, setTextoEditado] = useState("");
    const navigate = useNavigate();

    const carregar = async () => {
        setLoading(true);
        setMessage("");
        try {
            console.log("🔄 Carregando modelos...");
            const data = await api.listarModelos();
            console.log("✅ Modelos recebidos:", data);
            setModelos(data || []);
        } catch (error) {
            console.error("❌ Erro ao carregar modelos:", error);
            setMessage("Erro ao carregar modelos. Verifique o backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    const handleDeletar = async (id) => {
        if (!window.confirm("Confirma remoção deste modelo?")) return;
        try {
            await api.deleteModelo(id);
            setMessage("Modelo removido com sucesso.");
            carregar();
        } catch (error) {
            console.error("Erro ao deletar", error);
            setMessage("Falha ao remover modelo.");
        }
    };

    const expandirModelo = async (modeloId) => {
        if (modeloExpandido === modeloId) {
            setModeloExpandido(null);
            setPerguntas([]);
        } else {
            try {
                const resp = await fetch(`/perguntas/listar/${modeloId}`);
                const data = await resp.json();
                setPerguntas(data || []);
                setModeloExpandido(modeloId);
                setMessage("");
            } catch (error) {
                console.error("Erro ao carregar perguntas", error);
                setMessage("Erro ao carregar perguntas.");
            }
        }
    };

    const adicionarPergunta = async (modeloId) => {
        if (!novaPergunta.trim()) {
            setMessage("Digite uma pergunta válida.");
            return;
        }
        try {
            await fetch(`/perguntas/adicionar/${modeloId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questao: novaPergunta })
            });
            setNovaPergunta("");
            expandirModelo(modeloId); // recarrega perguntas
            setMessage("Pergunta adicionada!");
        } catch (error) {
            console.error("Erro ao adicionar pergunta", error);
            setMessage("Erro ao adicionar pergunta.");
        }
    };

    const iniciarEdicaoPergunta = (pergunta) => {
        setEditandoPergunta(pergunta.id);
        setTextoEditado(pergunta.questao);
    };

    const salvarEdicaoPergunta = async (modeloId, perguntaId) => {
        if (!textoEditado.trim()) {
            setMessage("Texto não pode ser vazio.");
            return;
        }
        try {
            await fetch(`/perguntas/atualizar/${modeloId}/${perguntaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto: textoEditado })
            });
            setEditandoPergunta(null);
            setTextoEditado("");
            expandirModelo(modeloId); // recarrega perguntas
            setMessage("Pergunta atualizada!");
        } catch (error) {
            console.error("Erro ao atualizar pergunta", error);
            setMessage("Erro ao atualizar pergunta.");
        }
    };

    const cancelarEdicao = () => {
        setEditandoPergunta(null);
        setTextoEditado("");
    };

    const deletarPergunta = async (modeloId, perguntaId) => {
        if (!window.confirm("Confirma remoção desta pergunta?")) return;
        try {
            await fetch(`/perguntas/remover/${modeloId}/${perguntaId}`, {
                method: 'DELETE'
            });
            expandirModelo(modeloId); // recarrega perguntas
            setMessage("Pergunta removida!");
        } catch (error) {
            console.error("Erro ao deletar pergunta", error);
            setMessage("Erro ao deletar pergunta.");
        }
    };

    return (
        <div style={{ minHeight: "calc(100vh - 50px)", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 32 }}>
            <PerimeterBox style={{ width: 1000 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h2>Modelos</h2>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button style={styles.buttonPrimary} onClick={() => navigate("/modelos/criar")}>+ Criar modelo</button>
                        <button style={styles.buttonSecondary} onClick={carregar}>Atualizar</button>
                    </div>
                </div>

                {message && <p style={{ color: "#f55" }}>{message}</p>}

                {loading ? (
                    <p>Carregando...</p>
                ) : modelos.length === 0 ? (
                    <p>Nenhum modelo encontrado.</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Nome</th>
                            <th style={styles.th}>Descrição</th>
                            <th style={styles.th}>Plataforma</th>
                            <th style={styles.th}># Perguntas</th>
                            <th style={styles.th}>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {modelos.map((m) => (
                            <>
                                <tr key={m.id} style={styles.tr}>
                                    <td style={styles.td}>{String(m.id).slice(0, 8)}</td>
                                    <td style={styles.td}>{m.nome}</td>
                                    <td style={styles.td}>{m.descricao}</td>
                                    <td style={styles.td}>{m.plataformasDisponiveis}</td>
                                    <td style={styles.td}>{m.perguntas ? m.perguntas.length : 0}</td>
                                    <td style={styles.td}>
                                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                            <button style={styles.smallBtn} onClick={() => expandirModelo(m.id)}>
                                                {modeloExpandido === m.id ? "▼" : "►"} Perguntas
                                            </button>
                                            <button style={styles.smallBtn} onClick={() => navigate(`/modelos/editar/${m.id}`)}>✏️ Editar</button>
                                            <button style={styles.removeBtn} onClick={() => handleDeletar(m.id)}>🗑️ Deletar</button>
                                        </div>
                                    </td>
                                </tr>
                                
                                {modeloExpandido === m.id && (
                                    <tr key={`perguntas-${m.id}`}>
                                        <td colSpan="6" style={{ padding: 20, background: "#0a0a0a", borderLeft: "4px solid #0077cc" }}>
                                            <div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                                    <h3 style={{ margin: 0, color: "#0077cc" }}>📝 Perguntas - {m.nome}</h3>
                                                    <button 
                                                        style={{ ...styles.smallBtn, background: "#28a745" }}
                                                        onClick={() => navigate(`/modelos/editar/${m.id}`)}
                                                    >
                                                        ✏️ Editar Modelo Completo
                                                    </button>
                                                </div>
                                                
                                                <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
                                                    <input 
                                                        type="text"
                                                        placeholder="Digite uma nova pergunta..."
                                                        value={novaPergunta}
                                                        onChange={(e) => setNovaPergunta(e.target.value)}
                                                        style={{ ...styles.input, flex: 1 }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') adicionarPergunta(m.id);
                                                        }}
                                                    />
                                                    <button 
                                                        style={{ ...styles.buttonPrimary, background: "#28a745" }} 
                                                        onClick={() => adicionarPergunta(m.id)}
                                                    >
                                                        ➕ Adicionar
                                                    </button>
                                                </div>

                                                {perguntas.length === 0 ? (
                                                    <div style={{ padding: 20, textAlign: "center", color: "#888", background: "#111", borderRadius: 8 }}>
                                                        <p style={{ margin: 0 }}>📭 Nenhuma pergunta cadastrada ainda</p>
                                                        <p style={{ margin: "8px 0 0 0", fontSize: 13 }}>Adicione a primeira pergunta acima</p>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                        {perguntas.map((p, index) => (
                                                            <div 
                                                                key={p.id} 
                                                                style={{ 
                                                                    padding: 12, 
                                                                    background: "#151515", 
                                                                    borderRadius: 8, 
                                                                    border: "1px solid #333",
                                                                    display: "flex",
                                                                    gap: 12,
                                                                    alignItems: "flex-start"
                                                                }}
                                                            >
                                                                <div style={{ 
                                                                    minWidth: 30, 
                                                                    height: 30, 
                                                                    background: "#0077cc", 
                                                                    borderRadius: "50%",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    fontWeight: "bold",
                                                                    fontSize: 14,
                                                                    flexShrink: 0
                                                                }}>
                                                                    {index + 1}
                                                                </div>
                                                                
                                                                {editandoPergunta === p.id ? (
                                                                    <div style={{ display: "flex", gap: 8, flex: 1, alignItems: "center" }}>
                                                                        <textarea 
                                                                            value={textoEditado}
                                                                            onChange={(e) => setTextoEditado(e.target.value)}
                                                                            style={{ 
                                                                                ...styles.input, 
                                                                                flex: 1, 
                                                                                minHeight: 60,
                                                                                resize: "vertical",
                                                                                fontFamily: "inherit"
                                                                            }}
                                                                            autoFocus
                                                                        />
                                                                        <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
                                                                            <button 
                                                                                style={{ ...styles.smallBtn, background: "#28a745", whiteSpace: "nowrap" }} 
                                                                                onClick={() => salvarEdicaoPergunta(m.id, p.id)}
                                                                            >
                                                                                ✓ Salvar
                                                                            </button>
                                                                            <button 
                                                                                style={{ ...styles.buttonSecondary, padding: "6px 10px", whiteSpace: "nowrap" }} 
                                                                                onClick={cancelarEdicao}
                                                                            >
                                                                                ✕ Cancelar
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div style={{ flex: 1 }}>
                                                                            <p style={{ margin: 0, lineHeight: 1.6, color: "#fff" }}>
                                                                                {p.questao}
                                                                            </p>
                                                                        </div>
                                                                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                                                            <button 
                                                                                style={{ ...styles.smallBtn, padding: "6px 12px" }} 
                                                                                onClick={() => iniciarEdicaoPergunta(p)}
                                                                                title="Editar pergunta"
                                                                            >
                                                                                ✏️
                                                                            </button>
                                                                            <button 
                                                                                style={{ ...styles.removeBtn, padding: "6px 12px" }} 
                                                                                onClick={() => deletarPergunta(m.id, p.id)}
                                                                                title="Deletar pergunta"
                                                                            >
                                                                                🗑️
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                        </tbody>
                    </table>
                )}
            </PerimeterBox>
        </div>
    );
}

const styles = {
    th: { textAlign: "left", padding: "8px 10px", borderBottom: "1px solid #333" },
    tr: { borderBottom: "1px solid #222" },
    td: { padding: "10px" },
    buttonPrimary: { padding: "8px 12px", borderRadius: 8, border: "none", background: "#000", color: "#fff", cursor: "pointer" },
    buttonSecondary: { padding: "8px 12px", borderRadius: 8, border: "none", background: "#444", color: "#fff", cursor: "pointer" },
    smallBtn: { padding: "6px 10px", borderRadius: 6, border: "none", background: "#0077cc", color: "#fff", cursor: "pointer" },
    removeBtn: { padding: "6px 10px", borderRadius: 6, border: "none", background: "#b00", color: "#fff", cursor: "pointer" },
    input: { 
        padding: "8px 12px", 
        borderRadius: 6, 
        border: "1px solid #444", 
        background: "#222", 
        color: "#fff",
        outline: "none",
        fontSize: 14
    },
};
