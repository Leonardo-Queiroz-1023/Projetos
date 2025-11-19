package org.cesar.br.projetos.Mediator;

import org.cesar.br.projetos.Repository.ModeloRepository;
import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.Pergunta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class PerguntasMediator {

    private static PerguntasMediator instancia;
    private static ModeloRepository modeloRepository;

    @Autowired
    public PerguntasMediator(ModeloRepository modeloRepository) {
        PerguntasMediator.modeloRepository = modeloRepository;
    }

    public static PerguntasMediator getInstancia() {
        return instancia;
    }

    @Autowired
    public void setInstancia() {
        instancia = this;
    }

    // -------------------------------------------------------------
    // ADICIONAR PERGUNTA A UM MODELO
    // -------------------------------------------------------------
    public boolean adicionarPergunta(UUID modeloId, Pergunta pergunta) {

        if (modeloId == null) return false;
        Modelo m = modeloRepository.findById(modeloId).orElse(null);
        if (m == null) return false;

        if (pergunta == null || pergunta.getQuestao() == null ||
                pergunta.getQuestao().trim().isEmpty()) return false;

        // Garante que a relação ManyToOne seja setada
        pergunta.setModelo(m);

        m.getPerguntas().add(pergunta);
        modeloRepository.save(m);
        return true;
    }

    // -------------------------------------------------------------
    // LISTAR PERGUNTAS DO MODELO
    // -------------------------------------------------------------
    public List<Pergunta> listarPerguntas(UUID modeloId) {
        Modelo m = modeloRepository.findById(modeloId).orElse(null);
        if (m == null) return null;

        return m.getPerguntas();
    }

    // -------------------------------------------------------------
    // ATUALIZAR PERGUNTA ESPECÍFICA
    // -------------------------------------------------------------
    public boolean atualizarPergunta(UUID modeloId, UUID perguntaId, String novoTexto) {
        if (modeloId == null || perguntaId == null) return false;
        Modelo m = modeloRepository.findById(modeloId).orElse(null);
        if (m == null) return false;

        for (Pergunta p : m.getPerguntas()) {
            if (p.getId().equals(perguntaId)) {
                if (novoTexto != null && !novoTexto.trim().isEmpty()) {
                    p.setQuestao(novoTexto);
                    modeloRepository.save(m);
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
        Modelo m = modeloRepository.findById(modeloId).orElse(null);
        if (m == null) return false;

        boolean removeu = m.getPerguntas().removeIf(p -> p.getId().equals(perguntaId));

        if (removeu) modeloRepository.save(m);

        return removeu;
    }
}
