// src/services/api.js
const API_URL = "http://localhost:8080"; // <--- ajuste conforme seu backend

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const resp = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    body: options.body ? options.body : undefined,
  });

  // tenta ler corpo com tolerância
  const text = await resp.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!resp.ok) {
    const msg = (data && data.message) ? data.message : `Erro HTTP ${resp.status}`;
    const err = new Error(msg);
    err.status = resp.status;
    err.body = data;
    throw err;
  }

  return data;
}

const api = {
  // ===== MODELOS =====
  createModelo: (modelo) => {
    const usuarioId = localStorage.getItem('usuarioId');
    return fetchAPI('/modelos/criar', {
      method: 'POST',
      body: JSON.stringify({ ...modelo, usuarioId }),
    });
  },

  listarModelos: () => {
    const usuarioId = localStorage.getItem('usuarioId');
    return fetchAPI(`/modelos/listar?usuarioId=${usuarioId}`);
  },
  
  getModelos: () => {
    const usuarioId = localStorage.getItem('usuarioId');
    return fetchAPI(`/modelos/listar?usuarioId=${usuarioId}`);
  },

  getModeloById: (id) => {
    const usuarioId = localStorage.getItem('usuarioId');
    return fetchAPI(`/modelos/${id}?usuarioId=${usuarioId}`);
  },

  updateModelo: (id, body) => {
    const usuarioId = localStorage.getItem('usuarioId');
    return fetchAPI(`/modelos/atualizar/${id}?usuarioId=${usuarioId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  deleteModelo: (id) => {
    const usuarioId = localStorage.getItem('usuarioId');
    return fetchAPI(`/modelos/deletar/${id}?usuarioId=${usuarioId}`, {
      method: 'DELETE',
    });
  },

  // ===== PERGUNTAS =====
  addPerguntaToModelo: (modeloId, perguntaPayload) => fetchAPI(`/perguntas/adicionar/${modeloId}`, {
      method: 'POST',
      body: JSON.stringify(perguntaPayload),
  }),

  updatePergunta: (modeloId, perguntaId, novoTexto) => fetchAPI(`/perguntas/atualizar/${modeloId}/${perguntaId}`, {
      method: 'PUT',
      body: JSON.stringify({ texto: novoTexto }),
  }),

  deletePergunta: (modeloId, perguntaId) => fetchAPI(`/perguntas/remover/${modeloId}/${perguntaId}`, {
      method: 'DELETE',
  }),

  // ===== AUTH =====
  registerUser: (usuario) => fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(usuario),
  }),

  login: (usuario) => fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(usuario),
  }),

  // ===== PESQUISAS =====
  getPesquisas: () => {
      const usuarioId = localStorage.getItem('usuarioId');
      return fetchAPI(`/pesquisas/listar?usuarioId=${usuarioId}`);
  },

  getPesquisasAndamento: () => {
      const usuarioId = localStorage.getItem('usuarioId');
      return fetchAPI(`/pesquisas/andamento?usuarioId=${usuarioId}`);
  },

  getResultadosPesquisa: (pesquisaId) => {
      const usuarioId = localStorage.getItem('usuarioId');
      return fetchAPI(`/pesquisas/${pesquisaId}/resultados?usuarioId=${usuarioId}`);
  },

  getRespostasPorPergunta: (pesquisaId, perguntaId) => {
      const usuarioId = localStorage.getItem('usuarioId');
      return fetchAPI(`/pesquisas/${pesquisaId}/respostas/${perguntaId}?usuarioId=${usuarioId}`);
  },

  dispararPesquisa: (dados) => {
      const usuarioId = localStorage.getItem('usuarioId');
      return fetchAPI('/pesquisas/disparar', {
          method: 'POST',
          body: JSON.stringify({ ...dados, usuarioId }),
      });
  },
};

export default api;