package org.cesar.br.projetos.Service;

import org.cesar.br.projetos.Repository.ModeloRepository;
import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.Pergunta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class PerguntaService {

    private final ModeloRepository modeloRepository;

    @Autowired
    public PerguntaService(ModeloRepository modeloRepository) {
        this.modeloRepository = modeloRepository;
    }

    // -------------------------------------------------------------
    // CREATE - Lógica de negócio: adicionar pergunta a um modelo
    // -------------------------------------------------------------
    public boolean adicionarPergunta(UUID modeloId, Pergunta pergunta) {

        // Validação: modeloId obrigatório
        if (modeloId == null) {
            return false;
        }

        // Busca o modelo
        Modelo modelo = modeloRepository.findById(modeloId).orElse(null);
        if (modelo == null) {
            return false;
        }

        // Validação: pergunta e questão obrigatórias
        if (pergunta == null || pergunta.getQuestao() == null ||
                pergunta.getQuestao().trim().isEmpty()) {
            return false;
        }

        // Regra de negócio: associa a pergunta ao modelo (relação ManyToOne)
        pergunta.setModelo(modelo);

        // Adiciona à lista de perguntas do modelo
        modelo.getPerguntas().add(pergunta);

        // Persistência (cascade irá salvar a pergunta também)
        modeloRepository.save(modelo);
        return true;
    }

    // -------------------------------------------------------------
    // READ - Lógica de negócio: listar perguntas de um modelo
    // -------------------------------------------------------------
    public List<Pergunta> listarPerguntas(UUID modeloId) {

        // Validação: modeloId obrigatório
        if (modeloId == null) {
            return null;
        }

        // Busca o modelo
        Modelo modelo = modeloRepository.findById(modeloId).orElse(null);
        if (modelo == null) {
            return null;
        }

        // Retorna as perguntas associadas
        return modelo.getPerguntas();
    }

    // -------------------------------------------------------------
    // UPDATE - Lógica de negócio: atualizar pergunta específica
    // -------------------------------------------------------------
    public boolean atualizarPergunta(UUID modeloId, UUID perguntaId, String novoTexto) {

        // Validação: IDs obrigatórios
        if (modeloId == null || perguntaId == null) {
            return false;
        }

        // Busca o modelo
        Modelo modelo = modeloRepository.findById(modeloId).orElse(null);
        if (modelo == null) {
            return false;
        }

        // Busca a pergunta dentro do modelo
        for (Pergunta pergunta : modelo.getPerguntas()) {
            if (pergunta.getId().equals(perguntaId)) {
                // Validação: novo texto não pode ser vazio
                if (novoTexto != null && !novoTexto.trim().isEmpty()) {
                    pergunta.setQuestao(novoTexto);
                    // Persistência
                    modeloRepository.save(modelo);
                    return true;
                }
            }
        }

        return false;
    }

    // -------------------------------------------------------------
    // DELETE - Lógica de negócio: remover pergunta
    // -------------------------------------------------------------
    public boolean removerPergunta(UUID modeloId, UUID perguntaId) {

        // Validação: IDs obrigatórios
        if (modeloId == null || perguntaId == null) {
            return false;
        }

        // Busca o modelo
        Modelo modelo = modeloRepository.findById(modeloId).orElse(null);
        if (modelo == null) {
            return false;
        }

        // Remove a pergunta da lista (orphanRemoval irá deletar do BD)
        boolean removeu = modelo.getPerguntas().removeIf(p -> p.getId().equals(perguntaId));

        // Persistência se houve remoção
        if (removeu) {
            modeloRepository.save(modelo);
        }

        return removeu;
    }
}
