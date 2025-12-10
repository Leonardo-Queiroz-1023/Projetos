// src/services/api.js

const API_URL = "https://projetos-1f39.onrender.com";

// Função auxiliar genérica para Fetch
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        // Só envia token se existir (evita erro para usuário externo)
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const config = {
        ...options,
        headers,
    };

    if (options.body) {
        config.body = options.body;
    }

    const resp = await fetch(`${API_URL}${endpoint}`, config);

    const text = await resp.text();
    let data = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!resp.ok) {
        const msg = (data && data.message)
            ? data.message
            : (data && data.error)
                ? data.error
                : `Erro HTTP ${resp.status}`;

        const err = new Error(msg);
        err.status = resp.status;
        err.body = data;
        throw err;
    }

    return data;
}

const api = {
    // ... (Login e Register mantidos iguais) ...
    registerUser: (usuario) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(usuario) }),
    login: (usuario) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(usuario) }),

    // ==========================================
    // MODELOS
    // ==========================================
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

    // ⚠️ ALTERADO: Aceita usuarioId opcional. Se não passado, tenta do localStorage.
    // Se ainda assim for null (usuário externo), envia string vazia ou trata o erro.
    getModeloById: (id, ownerId = null) => {
        let usuarioId = ownerId || localStorage.getItem('usuarioId');

        if (!usuarioId) usuarioId = "0";

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

    // ... (Perguntas mantidas iguais) ...
    addPerguntaToModelo: (modeloId, payload) => fetchAPI(`/perguntas/adicionar/${modeloId}`, { method: 'POST', body: JSON.stringify(payload) }),
    updatePergunta: (modeloId, pId, txt) => fetchAPI(`/perguntas/atualizar/${modeloId}/${pId}`, { method: 'PUT', body: JSON.stringify({ texto: txt }) }),
    deletePergunta: (modeloId, pId) => fetchAPI(`/perguntas/remover/${modeloId}/${pId}`, { method: 'DELETE' }),

    // ... (Pesquisas CRUD mantidas iguais) ...
    createPesquisa: (payload) => fetchAPI('/pesquisas/criar', { method: 'POST', body: JSON.stringify(payload) }),
    getPesquisasTodas: () => fetchAPI('/pesquisas/listar/todas'),
    getPesquisasAtivas: () => fetchAPI('/pesquisas/listar/ativas'),
    getPesquisaById: (id) => fetchAPI(`/pesquisas/${id}`),
    updatePesquisa: (id, payload) => fetchAPI(`/pesquisas/atualizar/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    deletePesquisa: (id) => fetchAPI(`/pesquisas/deletar/${id}`, { method: 'DELETE' }),
    getPesquisasPorModelo: (modeloId) => fetchAPI(`/pesquisas/listar/modelo/${modeloId}`),
    getPesquisasPorDataInicio: (d) => fetchAPI(`/pesquisas/listar/data-inicio?data=${d}`),
    getPesquisasPorDataFinal: (d) => fetchAPI(`/pesquisas/listar/data-final?data=${d}`),

    // ==========================================
    // DISPARO & RESPOSTA
    // ==========================================

    dispararPesquisaIndividual: (dados) => {
        return fetchAPI('/pesquisas/disparar', {
            method: 'POST',
            body: JSON.stringify(dados)
        });
    },

    // ✅ GARANTIDO: Envia o JSON na estrutura exata que o Java Map<String,Object> espera
    enviarRespostas: (pesquisaId, respondenteId, respostasMap) => {
        const payload = {
            respondenteId: respondenteId,
            respostas: respostasMap
        };
        return fetchAPI(`/pesquisas/responder/${pesquisaId}`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    verificarSeJaRespondeu: (pesquisaId, respondenteId) => {
        return fetchAPI(`/pesquisas/verificar-resposta?pesquisaId=${pesquisaId}&respondenteId=${respondenteId}`);
    },

    // ... (Resultados mantidos iguais) ...
    getResultadosPesquisa: (pid) => fetchAPI(`/pesquisas/listar-respostas/${pid}`),
    getContarRespostas: (pid) => fetchAPI(`/pesquisas/contar-respostas/${pid}`),
    getHistoricoRespondente: (rid) => fetchAPI(`/pesquisas/historico/${rid}`)
};

export default api;