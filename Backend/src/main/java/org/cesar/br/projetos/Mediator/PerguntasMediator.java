package org.cesar.br.projetos.Mediator;

import org.cesar.br.projetos.Dao.ModeloDAO;
import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.Pergunta;

import java.util.List;
import java.util.UUID;

public class PerguntasMediator {

    private static PerguntasMediator instancia;
    private static ModeloDAO modeloD;

    private PerguntasMediator() {}

    public static PerguntasMediator getInstancia() {
        if (instancia == null) {
            instancia = new PerguntasMediator();
            modeloD = new ModeloDAO();
        }
        return instancia;
    }

    // -------------------------------------------------------------
    // ADICIONAR PERGUNTA A UM MODELO
    // -------------------------------------------------------------
    public boolean adicionarPergunta(UUID modeloId, Pergunta pergunta) { // modeloId alterado para UUID

        if (modeloId == null) return false;
        Modelo m = modeloD.buscarPorId(modeloId);
        if (m == null) return false;

        // Corrigido para usar getQuestao() (da Entidade Pergunta)
        if (pergunta == null || pergunta.getQuestao() == null ||
                pergunta.getQuestao().trim().isEmpty()) return false;

        // Garante que a relação ManyToOne seja setada
        pergunta.setModelo(m);

        m.getPerguntas().add(pergunta);
        modeloD.atualizar(m);
        return true;
    }

    // -------------------------------------------------------------
    // LISTAR PERGUNTAS DO MODELO
    // -------------------------------------------------------------
    public List<Pergunta> listarPerguntas(long modeloId) {
        Modelo m = modeloD.buscarPorId(modeloId);
        if (m == null) return null;

        return m.getPerguntas();
    }

    // -------------------------------------------------------------
    // ATUALIZAR PERGUNTA ESPECÍFICA
    // -------------------------------------------------------------
    public boolean atualizarPergunta(long modeloId, UUID perguntaId, String novoTexto) {
        if (modeloId == null || perguntaId == null) return false;
        Modelo m = modeloD.buscarPorId(modeloId);
        if (m == null) return false;

        for (Pergunta p : m.getPerguntas()) {
            if (p.getId().equals(perguntaId)) {
                if (novoTexto != null && !novoTexto.trim().isEmpty()) {
                    p.setTexto(novoTexto);
                    modeloD.atualizar(m);
                    return true;
                }
            }
        }
        return false;
    }

    // -------------------------------------------------------------
    // REMOVER PERGUNTA
    // -------------------------------------------------------------
    public boolean removerPergunta(UUID modeloId, UUID perguntaId) {

        if (modeloId == null || perguntaId == null) return false;
        Modelo m = modeloD.buscarPorId(modeloId);
        if (m == null) return false;

        boolean removeu = m.getPerguntas().removeIf(p -> p.getId().equals(perguntaId);

        if (removeu) modeloD.atualizar(m);

        return removeu;
    }
}