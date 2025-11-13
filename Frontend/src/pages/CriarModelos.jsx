// src/pages/CriarModelos.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";
import api from "../services/api";

export default function CriarModelos() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [pergunta, setPergunta] = useState("");
  const [imagem, setImagem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState("");

  const logged = localStorage.getItem("logged") === "true";
  const fileInputRef = useRef(null);

  // se estiver testando sem login, deixa comentado
  // useEffect(() => {
  //   if (!logged) {
  //     navigate("/login?msg=Logue%20antes%20de%20criar%20modelos", {
  //       replace: true,
  //     });
  //   }
  // }, [logged, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      setMessage("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setImagem(file);
      setMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      nome,
      descricao,
      plataformasDisponiveis: plataforma,
      pergunta,
      imagemNome: imagem ? imagem.name : null,
    };

    try {
      await api.createModelo(payload);
      setMessage("✅ Modelo criado no backend!");
      setNome("");
      setDescricao("");
      setPlataforma("");
      setPergunta("");
      setImagem(null);
    } catch (error) {
      console.error("Erro ao criar modelo:", error);
      setMessage("❌ Falha ao criar modelo. Verifique o backend.");
    }
  };

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
      <PerimeterBox style={{ width: "420px", textAlign: "left" }}>
        <h2 style={{ marginBottom: 20 }}>Criar modelo de pesquisa</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Nome do modelo
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
              placeholder="Ex: Pesquisa de satisfação pós-atendimento"
              required
            />
          </label>

          <label style={styles.label}>
            Descrição
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              style={styles.textarea}
              placeholder="Breve descrição do objetivo deste modelo"
              rows={3}
              required
            />
          </label>

          <label style={styles.label}>
            Plataforma de envio
            <select
              value={plataforma}
              onChange={(e) => setPlataforma(e.target.value)}
              style={styles.select}
              required
            >
              <option value="">Selecione uma plataforma</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="EMAIL">E-mail</option>
              <option value="SMS">SMS</option>
              <option value="APP">Aplicativo</option>
            </select>
          </label>

          <label style={styles.label}>
            Pergunta principal
            <textarea
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              style={styles.textarea}
              placeholder="Texto da pergunta que será feita ao respondente"
              rows={2}
              required
            />
          </label>

          <label style={styles.label}>
            Imagem de referência (opcional)
            <div
              style={{
                ...styles.dropzone,
                ...(isDragging ? styles.dropzoneActive : {}),
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
            >
              <p>Arraste uma imagem aqui ou clique para selecionar</p>
              {imagem && (
                <p style={styles.fileName}>
                  Arquivo selecionado: {imagem.name}
                </p>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </label>

          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            <button type="submit" style={styles.buttonPrimary}>
              Salvar modelo
            </button>
            <button
              type="button"
              style={styles.buttonSecondary}
              onClick={() => navigate("/modelos")}
            >
              Cancelar
            </button>
          </div>
        </form>

        {message && <p style={styles.message}>{message}</p>}
      </PerimeterBox>
    </div>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    width: "100%",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: "14px",
    gap: "4px",
  },
  input: {
    padding: "8px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #444",
    backgroundColor: "#222",
    color: "#fff",
  },
  textarea: {
    padding: "8px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #444",
    backgroundColor: "#222",
    color: "#fff",
    resize: "vertical",
  },
  select: {
    padding: "8px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #444",
    backgroundColor: "#222",
    color: "#fff",
  },
  dropzone: {
    padding: "14px",
    fontSize: "13px",
    borderRadius: "8px",
    border: "2px dashed #666",
    backgroundColor: "#111",
    color: "#ddd",
    textAlign: "center",
    cursor: "pointer",
  },
  dropzoneActive: {
    borderColor: "#fff",
    backgroundColor: "#222",
  },
  fileName: {
    marginTop: "8px",
    fontSize: "12px",
    color: "#aaa",
    wordBreak: "break-all",
  },
  buttonPrimary: {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#000",
    color: "#fff",
    fontWeight: 500,
  },
  buttonSecondary: {
    flex: 1,
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#444",
    color: "#fff",
    fontWeight: 500,
  },
  message: {
    marginTop: "16px",
    fontSize: "14px",
  },
};
