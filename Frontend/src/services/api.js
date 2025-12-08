// src/services/api.js
const API_URL = '';

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (response.status === 204 || response.headers.get("content-length") === "0") {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }
            return null;
        }

        let data;
        try {
            data = await response.json();
        } catch (e) {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return null;
        }

        if (!response.ok) {
            throw new Error(data.error || `Erro HTTP: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('❌ Erro na API:', error);
        throw error;
    }
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