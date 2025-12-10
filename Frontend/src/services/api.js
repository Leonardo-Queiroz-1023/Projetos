// src/services/api.js
const API_URL = "http://localhost:8080";

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
        const msg = (data && data.message) ? data.message : (data && data.error) ? data.error : `Erro HTTP ${resp.status}`;
        const err = new Error(msg);
        err.status = resp.status;
        err.body = data;
        throw err;
    }

    return data;
}

const api = {
    // ===== MODELOS (Mantidos iguais) =====
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

    // ===== PERGUNTAS (Mantidos iguais) =====
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

    // ===== AUTH (Mantidos iguais) =====
    registerUser: (usuario) => fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(usuario),
    }),

    login: (usuario) => fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify(usuario),
    }),

    // ===== PESQUISAS (ATUALIZADO PARA O BACKEND REAL) =====

    // Criação: POST /pesquisas/criar
    createPesquisa: (payload) => {
        // payload espera: { nome, modeloId, dataInicio, dataFinal }
        return fetchAPI('/pesquisas/criar', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },
    getPesquisasTodas: () => {
        const usuarioId = localStorage.getItem('usuarioId');
        return fetchAPI(`/pesquisas/listar/todas?usuarioId=${usuarioId}`);
    },
    // Listagem Ativas: GET /pesquisas/listar/ativas
    getPesquisasAtivas: () => {
        return fetchAPI('/pesquisas/listar/ativas');
    },

    getPesquisasPorModelo: (modeloId) => {
        return fetchAPI(`/pesquisas/listar/modelo/${modeloId}`);
    },

    getPesquisasPorDataInicio: (data) => {
        // O backend espera ?data=YYYY-MM-DD
        return fetchAPI(`/pesquisas/listar/data-inicio?data=${data}`);
    },

    getPesquisasPorDataFinal: (data) => {
        return fetchAPI(`/pesquisas/listar/data-final?data=${data}`);
    },

    // Busca por ID: GET /pesquisas/{id}
    getPesquisaById: (id) => {
        return fetchAPI(`/pesquisas/${id}`);
    },

    // Atualizar: PUT /pesquisas/atualizar/{id}
    updatePesquisa: (id, payload) => {
        // payload espera: { nome, dataInicio, dataFinal }
        return fetchAPI(`/pesquisas/atualizar/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
    },

    // Deletar: DELETE /pesquisas/deletar/{id}
    deletePesquisa: (id) => {
        return fetchAPI(`/pesquisas/deletar/${id}`, {
            method: 'DELETE'
        });
    },

    // Responder: POST /pesquisas/responder/{id}
    responderPesquisa: (pesquisaId, payload) => {
        // payload espera: { respondenteId, respostas: { idPergunta: "texto" } }
        return fetchAPI(`/pesquisas/responder/${pesquisaId}`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    // Verificar se já respondeu
    verificarSeJaRespondeu: (pesquisaId, respondenteId) => {
        return fetchAPI(`/pesquisas/verificar-resposta?pesquisaId=${pesquisaId}&respondenteId=${respondenteId}`);
    },

    // Listar Respostas (Resultados): GET /pesquisas/listar-respostas/{id}
    getResultadosPesquisa: (pesquisaId) => {
        return fetchAPI(`/pesquisas/listar-respostas/${pesquisaId}`);
    },

    // Contagem simples: GET /pesquisas/contar-respostas/{id}
    getContarRespostas: (pesquisaId) => {
        return fetchAPI(`/pesquisas/contar-respostas/${pesquisaId}`);
    }
};

export default api;