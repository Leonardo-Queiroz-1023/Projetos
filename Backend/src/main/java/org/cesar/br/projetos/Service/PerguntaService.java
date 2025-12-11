package org.cesar.br.projetos.Service;

import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.Pergunta;
import org.cesar.br.projetos.Repository.ModeloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PerguntaService {

    private final ModeloRepository modeloRepository;

    @Autowired
    public PerguntaService(ModeloRepository modeloRepository) {
        this.modeloRepository = modeloRepository;
    }

    // -------------------------------------------------------------
    // CREATE - adicionar pergunta a um modelo
    // -------------------------------------------------------------
    public boolean adicionarPergunta(Long modeloId, String textoPergunta) {

        if (modeloId == null) {
            return false;
        }
        if (textoPergunta == null || textoPergunta.trim().isEmpty()) {
            return false;
        }

        Modelo modelo = modeloRepository.findById(modeloId).orElse(null);
        if (modelo == null) {
            return false;
        }

        Pergunta nova = new Pergunta(textoPergunta, modelo);

        modelo.adicionarPergunta(nova);

        modeloRepository.save(modelo);
        return true;
    }

    // -------------------------------------------------------------
    // READ - listar perguntas de um modelo
    // -------------------------------------------------------------
    public List<Pergunta> listarPerguntas(Long modeloId) {

        if (modeloId == null) {
            return List.of();
        }

        Modelo modelo = modeloRepository.findById(modeloId).orElse(null);
        if (modelo == null) {
            return List.of();
        }

        return modelo.getPerguntas();
    }

    // -------------------------------------------------------------
    // UPDATE - atualizar texto de uma pergunta específica
    // -------------------------------------------------------------
    public boolean atualizarPergunta(Long modeloId, Long perguntaId, String novoTexto) {

        if (modeloId == null || perguntaId == null) {
            return false;
        }
        if (novoTexto == null || novoTexto.trim().isEmpty()) {
            return false;
        }

        Modelo modelo = modeloRepository.findById(modeloId).orElse(null);
        if (modelo == null) {
            return false;
        }

        for (Pergunta pergunta : modelo.getPerguntas()) {
            if (pergunta.getId().equals(perguntaId)) {
                pergunta.setQuestao(novoTexto);
                modeloRepository.save(modelo);
                return true;
            }
        }

        return false;
    }

    // -------------------------------------------------------------
    // DELETE - remover pergunta de um modelo
    // -------------------------------------------------------------
    public boolean removerPergunta(Long modeloId, Long perguntaId) {

        if (modeloId == null || perguntaId == null) {
            return false;
        }

        Modelo modelo = modeloRepository.findById(modeloId).orElse(null);
        if (modelo == null) {
            return false;
        }

        Pergunta alvo = null;
        for (Pergunta p : modelo.getPerguntas()) {
            if (p.getId().equals(perguntaId)) {
                alvo = p;
                break;
            }
        }

        if (alvo == null) {
            return false;
        }

        modelo.removerPergunta(alvo);

        modeloRepository.save(modelo);
        return true;
    }
}
