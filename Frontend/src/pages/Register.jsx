import React, { useState } from "react";
import PerimeterBox from "../components/PerimeterBox";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: username, email, senhaHash: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ " + data.message);
      } else {
        setMessage("❌ Erro: " + data.error);
      }
    } catch (error) {
      setMessage("⚠️ Erro ao conectar com o servidor: " + error.message);
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
      <PerimeterBox style={{ width: "320px" }}>
        <h2 style={{ marginBottom: 20 }}>Registrar Usuário</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Registrar
          </button>
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
    gap: "10px",
    width: "100%",
  },
  input: {
    padding: "8px",
    fontSize: "14px",
  },
  button: {
    padding: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
  message: {
    marginTop: "20px",
  },
};

export default Register;
