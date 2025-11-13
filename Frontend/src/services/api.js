const API_URL = 'http://localhost:8080';

async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Erro HTTP: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('❌ Erro na API:', error);
    throw error;
  }
}

export const api = {
  // Modelos
  getModelos: () => fetchAPI('/modelos/listar'),
  getModeloById: (id) => fetchAPI(`/modelos/${id}`),
  createModelo: (modelo) => fetchAPI('/modelos/criar', {
    method: 'POST',
    body: JSON.stringify(modelo),
  }),
  updateNome: (id, nome) => fetchAPI(`/modelos/atualizar/nome/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ nome }),
  }),
  updateDescricao: (id, descricao) => fetchAPI(`/modelos/atualizar/descricao/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ descricao }),
  }),
  updatePlataforma: (id, plataforma) => fetchAPI(`/modelos/atualizar/plataforma/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ plataforma }),
  }),
  updatePergunta: (id, pergunta) => fetchAPI(`/modelos/atualizar/pergunta/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ descricao: pergunta }),
  }),
  deleteModelo: (id) => fetchAPI(`/modelos/deletar/${id}`, {
    method: 'DELETE',
  }),
};

export default api;