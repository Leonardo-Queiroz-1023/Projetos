// src/services/api.js
// Usando proxy do Vite - as requisições serão redirecionadas para http://localhost:8080
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

        // Se a resposta for 204 No Content ou não tiver corpo, retorna null
        if (response.status === 204 || response.headers.get("content-length") === "0") {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }
            return null;
        }

        // Tenta obter JSON
        let data;
        try {
            data = await response.json();
        } catch (e) {
            // Se falhar, tenta lançar o erro
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            // Se ok, retorna vazio se o corpo for ilegível
            return null;
        }


        if (!response.ok) {
            // Usa a mensagem de erro do corpo JSON
            throw new Error(data.error || `Erro HTTP: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('❌ Erro na API:', error);
        // Relança o erro para ser tratado no frontend
        throw error;
    }
}

export const api = {
    // Modelos - Endpoints Mapeados para ControllerModelo
    // IMPORTANTE: O backend usa UUID para IDs de Modelo e Pergunta

    // POST /modelos/criar
    createModelo: (modelo) => {
        const usuarioId = localStorage.getItem('usuarioId');
        return fetchAPI('/modelos/criar', {
            method: 'POST',
            body: JSON.stringify({ ...modelo, usuarioId }),
        });
    },

    // GET /modelos/listar
    listarModelos: () => {
        const usuarioId = localStorage.getItem('usuarioId');
        return fetchAPI(`/modelos/listar?usuarioId=${usuarioId}`);
    },
    
    getModelos: () => {
        const usuarioId = localStorage.getItem('usuarioId');
        return fetchAPI(`/modelos/listar?usuarioId=${usuarioId}`);
    },

    // GET /modelos/{id} - ID é UUID
    getModeloById: (id) => {
        const usuarioId = localStorage.getItem('usuarioId');
        return fetchAPI(`/modelos/${id}?usuarioId=${usuarioId}`);
    },

    // PUT /modelos/atualizar/{id} - ID é UUID
    updateModelo: (id, body) => {
        const usuarioId = localStorage.getItem('usuarioId');
        return fetchAPI(`/modelos/atualizar/${id}?usuarioId=${usuarioId}`, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    },

    // DELETE /modelos/deletar/{id} - ID é UUID
    deleteModelo: (id) => {
        const usuarioId = localStorage.getItem('usuarioId');
        return fetchAPI(`/modelos/deletar/${id}?usuarioId=${usuarioId}`, {
            method: 'DELETE',
        });
    },

    // Perguntas - Endpoints Mapeados para ControllerPerguntas

    // POST /perguntas/adicionar/{modeloId} - modeloId é UUID
    // Envia um objeto Pergunta DTO completo.
    addPerguntaToModelo: (modeloId, perguntaPayload) => fetchAPI(`/perguntas/adicionar/${modeloId}`, {
        method: 'POST',
        body: JSON.stringify(perguntaPayload), // Envia { "questao": "..." }
    }),

    // PUT /perguntas/atualizar/{modeloId}/{perguntaId} - Ambos IDs são UUID
    // O 'texto' deve ser enviado no body.
    updatePergunta: (modeloId, perguntaId, novoTexto) => fetchAPI(`/perguntas/atualizar/${modeloId}/${perguntaId}`, {
        method: 'PUT',
        body: JSON.stringify({ texto: novoTexto }),
    }),

    // DELETE /perguntas/remover/{modeloId}/{perguntaId} - Ambos IDs são UUID
    deletePergunta: (modeloId, perguntaId) => fetchAPI(`/perguntas/remover/${modeloId}/${perguntaId}`, {
        method: 'DELETE',
    }),

    // Login e Registro - Endpoints Mapeados para ControllerLogin

    registerUser: (usuario) => fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(usuario),
    }),

    login: (usuario) => fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify(usuario),
    }),
};

export default api;