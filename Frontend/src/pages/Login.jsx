import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PerimeterBox from "../components/PerimeterBox";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // se veio com ?msg=... mostra
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
        // guarda que está logado
        localStorage.setItem("logged", "true");
        localStorage.setItem("username", username);
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // vai para o menu principal
        navigate("/menu-central", { replace: true });
      } else {
        setMessage("❌ Erro: " + (data.error || "Credenciais inválidas"));
      }
    } catch (error) {
      setMessage("⚠️ Erro ao conectar com o servidor: " + error.message);
    }
  };

  return (
    <PerimeterBox style={{ width: "280px" }}>
      <h2>Login</h2>
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
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "sans-serif",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "250px",
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

