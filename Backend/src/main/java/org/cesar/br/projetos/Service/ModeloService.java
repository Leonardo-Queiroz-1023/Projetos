package org.cesar.br.projetos.Service;

import org.cesar.br.projetos.Repository.ModeloRepository;
import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.PlataformasDeEnvios;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ModeloService {

    private final ModeloRepository modeloRepository;

    @Autowired
    public ModeloService(ModeloRepository modeloRepository) {
        this.modeloRepository = modeloRepository;
    }

    // ---------------------------------------------------------------------
    // CREATE - Lógica de negócio: criar modelo
    // ---------------------------------------------------------------------
    public Modelo criarModelo(String nome, String descricao,
                               PlataformasDeEnvios plataformasDisponiveis) {

        // Validação: nome obrigatório
        if (nome == null || nome.trim().isEmpty()) {
            return null;
        }

        // Validação: descrição obrigatória
        if (descricao == null || descricao.trim().isEmpty()) {
            return null;
        }

        // Criação com UUID automático e persistência
        Modelo modelo = new Modelo(UUID.randomUUID(), nome, descricao, plataformasDisponiveis);
        return modeloRepository.save(modelo);
    }

    // ---------------------------------------------------------------------
    // READ - Lógica de negócio: listar todos os modelos
    // ---------------------------------------------------------------------
    public List<Modelo> listarModelos() {
        return modeloRepository.findAll();
    }

    // ---------------------------------------------------------------------
    // READ - Lógica de negócio: buscar modelo por ID
    // ---------------------------------------------------------------------
    public Modelo buscarModeloPorId(UUID id) {
        if (id == null) {
            return null;
        }
        return modeloRepository.findById(id).orElse(null);
    }

    // ---------------------------------------------------------------------
    // UPDATE - Lógica de negócio: atualizar modelo
    // ---------------------------------------------------------------------
    public boolean atualizarModelo(UUID id, String nome, String descricao,
                                   PlataformasDeEnvios plataformasDisponiveis) {

        // Validação: ID obrigatório
        if (id == null) {
            return false;
        }

        // Busca o modelo existente
        Modelo existente = modeloRepository.findById(id).orElse(null);
        if (existente == null) {
            return false;
        }

        // Atualiza apenas campos não nulos e não vazios
        if (nome != null && !nome.trim().isEmpty()) {
            existente.setNome(nome);
        }
        if (descricao != null && !descricao.trim().isEmpty()) {
            existente.setDescricao(descricao);
        }
        if (plataformasDisponiveis != null) {
            existente.setPlataformasDisponiveis(plataformasDisponiveis);
        }

        // Persistência da atualização
        modeloRepository.save(existente);
        return true;
    }

    // ---------------------------------------------------------------------
    // DELETE - Lógica de negócio: deletar modelo
    // ---------------------------------------------------------------------
    public boolean deletarModelo(UUID id) {

        // Validação: ID obrigatório
        if (id == null) {
            return false;
        }

        // Verifica se o modelo existe antes de deletar
        if (!modeloRepository.existsById(id)) {
            return false;
        }

        // Deleção
        modeloRepository.deleteById(id);
        return true;
    }
}
