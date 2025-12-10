import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function EditarModelo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [perguntas, setPerguntas] = useState([]); // {id?, texto, isNew?, isDeleted?}
    const [novaPergunta, setNovaPergunta] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const carregar = async () => {
        setLoading(true);
        try {
            const modelo = await api.getModeloById(id);
            setNome(modelo.nome || "");
            setDescricao(modelo.descricao || "");
            // Carrega as perguntas do backend
            const list = (modelo.perguntas || []).map((p) => {
                return { 
                    id: p.id, 
                    texto: p.questao || p.texto || "",
                    isNew: false // marca que já existe no backend
                };
            });
            setPerguntas(list);
        } catch (error) {
            console.error("Erro carregar modelo", error);
            setMessage("Erro ao carregar modelo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const adicionarPerguntaLocal = () => {
        if (!novaPergunta.trim()) return;
        setPerguntas([...perguntas, { 
            id: `temp-${Date.now()}`, 
            texto: novaPergunta.trim(),
            isNew: true // marca como nova para salvar no backend
        }]);
        setNovaPergunta("");
    };

    const atualizarTextoPergunta = (index, texto) => {
        const copy = [...perguntas];
        copy[index].texto = texto;
        setPerguntas(copy);
    };

    const removerPerguntaLocal = (index) => {
        const pergunta = perguntas[index];
        if (pergunta.isNew) {
            // Se for nova (ainda não salva), apenas remove da lista
            setPerguntas(perguntas.filter((_, i) => i !== index));
        } else {
            // Se já existe no backend, marca para deletar depois
            const copy = [...perguntas];
            copy[index].isDeleted = true;
            setPerguntas(copy);
        }
    };

    const handleSalvar = async () => {
        try {
            setMessage("Salvando...");
            
            // 1. Atualiza os dados do modelo (nome, descrição, plataforma)
            const payload = {
                nome,
                descricao,
            };
            console.log("🔄 Atualizando modelo:", id, payload);
            const updateResult = await api.updateModelo(id, payload);
            console.log("✅ Modelo atualizado:", updateResult);

            // 2. Processa perguntas
            for (const pergunta of perguntas) {
                if (pergunta.isDeleted && !pergunta.isNew) {
                    // Deleta pergunta existente do backend
                    console.log("🗑️ Deletando pergunta:", pergunta.id);
                    await fetch(`/perguntas/remover/${id}/${pergunta.id}`, {
                        method: 'DELETE'
                    });
                } else if (pergunta.isNew && !pergunta.isDeleted) {
                    // Adiciona pergunta nova ao backend
                    console.log("➕ Adicionando pergunta:", pergunta.texto);
                    await fetch(`/perguntas/adicionar/${id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ questao: pergunta.texto })
                    });
                } else if (!pergunta.isNew && !pergunta.isDeleted && pergunta.id) {
                    // Atualiza pergunta existente
                    console.log("✏️ Atualizando pergunta:", pergunta.id);
                    await fetch(`/perguntas/atualizar/${id}/${pergunta.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ texto: pergunta.texto })
                    });
                }
            }

            console.log("✅ Todas as alterações salvas!");
            setMessage("✅ Modelo atualizado com sucesso!");
            setTimeout(() => navigate("/modelos"), 1000);
        } catch (error) {
            console.error("❌ Erro ao salvar:", error);
            setMessage("❌ Falha ao salvar modelo: " + error.message);
        }
    };

    if (loading) {
        return <div style={{ padding: 32 }}>Carregando...</div>;
    }

    return (
        <div style={{ minHeight: "calc(100vh - 50px)", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 32 }}>
            <PerimeterBox style={{ width: 700 }}>
                <h2>Editar modelo</h2>

                {message && <p style={{ color: "#f44" }}>{message}</p>}

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <label style={styles.label}>
                        Nome
                        <input value={nome} onChange={(e) => setNome(e.target.value)} style={styles.input} />
                    </label>

                    <label style={styles.label}>
                        Descrição
                        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} style={styles.textarea} />
                    </label>


                    <div>
                        <p style={{ marginBottom: 8 }}>Perguntas</p>

                        {perguntas.filter(p => !p.isDeleted).length === 0 && <p style={{ opacity: 0.6 }}>Nenhuma pergunta</p>}

                        {perguntas.filter(p => !p.isDeleted).map((p, idx) => {
                            const originalIndex = perguntas.indexOf(p);
                            return (
                                <div key={p.id ?? idx} style={styles.perguntaItem}>
                                    <textarea
                                        value={p.texto}
                                        onChange={(e) => atualizarTextoPergunta(originalIndex, e.target.value)}
                                        rows={2}
                                        style={{ ...styles.textarea, width: "100%" }}
                                    />
                                    <button type="button" style={styles.removeBtn} onClick={() => removerPerguntaLocal(originalIndex)}>🗑️</button>
                                </div>
                            );
                        })}

                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                            <input value={novaPergunta} onChange={(e) => setNovaPergunta(e.target.value)} placeholder="Nova pergunta" style={styles.input} />
                            <button type="button" style={styles.buttonPrimary} onClick={adicionarPerguntaLocal}>Adicionar</button>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                        <button style={styles.buttonPrimary} onClick={handleSalvar}>Salvar</button>
                        <button style={styles.buttonSecondary} onClick={() => navigate("/modelos")}>Cancelar</button>
                    </div>
                </div>
            </PerimeterBox>
        </div>
    );
}

const styles = {
    label: { display: "flex", flexDirection: "column", gap: 6 },
    input: { padding: 8, borderRadius: 6, border: "1px solid #555", background: "#111", color: "#fff" },
    textarea: { padding: 8, borderRadius: 6, border: "1px solid #555", background: "#111", color: "#fff", resize: "vertical" },
    select: { padding: 8, borderRadius: 6, border: "1px solid #555", background: "#111", color: "#fff" },
    perguntaItem: { background: "#222", padding: 8, borderRadius: 8, marginBottom: 8, display: "flex", gap: 8, alignItems: "center" },
    removeBtn: { background: "#b00", color: "#fff", border: "none", padding: "6px 10px", borderRadius: 6, cursor: "pointer" },
    buttonPrimary: { padding: 10, background: "#000", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
    buttonSecondary: { padding: 10, background: "#444", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" },
};
