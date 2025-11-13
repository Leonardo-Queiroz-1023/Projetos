import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const msg = params.get("msg");
    if (msg) {
      setMessage(msg);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("logged", "true");
        localStorage.setItem("username", username);
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        navigate("/menu-central", { replace: true });
      } else {
        setMessage("❌ Erro: " + (data.error || "Credenciais inválidas"));
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
        <h2 style={{ marginBottom: 20 }}>Login</h2>
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
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Entrar
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

export default Login;
