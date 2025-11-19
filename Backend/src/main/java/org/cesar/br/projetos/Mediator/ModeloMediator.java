package org.cesar.br.projetos.Mediator;

import org.cesar.br.projetos.Repository.ModeloRepository;
import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.PlataformasDeEnvios;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class ModeloMediator {

    private static ModeloRepository modeloRepository;
    private static ModeloMediator instancia;

    @Autowired
    public ModeloMediator(ModeloRepository modeloRepository) {
        ModeloMediator.modeloRepository = modeloRepository;
    }

    public static ModeloMediator getInstancia() {
        return instancia;
    }

    @Autowired
    public void setInstancia() {
        instancia = this;
    }

    // ---------------------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------------------
    public boolean criarModelo(UUID id, String nome, String descricao,
                               PlataformasDeEnvios plataformasDisponiveis) {

        if (nome == null || nome.trim().isEmpty()) return false;
        if (descricao == null || descricao.trim().isEmpty()) return false;

        // Evita duplicação de ID
        if (modeloRepository.existsById(id)) return false;

        Modelo modelo = new Modelo(id, nome, descricao, plataformasDisponiveis);
        modeloRepository.save(modelo);
        return true;
    }

    // ---------------------------------------------------------------------
    // READ
    // ---------------------------------------------------------------------
    public List<Modelo> listarModelos() {
        return modeloRepository.findAll();
    }

    public Modelo buscarModeloPorId(UUID id) {
        if (id == null) return null;
        return modeloRepository.findById(id).orElse(null);
    }

    // ---------------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------------
    public boolean atualizarModelo(UUID id, String nome, String descricao,
                                   PlataformasDeEnvios plataformasDisponiveis) {

        if (id == null) return false;
        Modelo existente = modeloRepository.findById(id).orElse(null);
        if (existente == null) return false;

        if (nome != null && !nome.trim().isEmpty()) existente.setNome(nome);
        if (descricao != null && !descricao.trim().isEmpty()) existente.setDescricao(descricao);
        if (plataformasDisponiveis != null) existente.setPlataformasDisponiveis(plataformasDisponiveis);

        modeloRepository.save(existente);
        return true;
    }

    // ---------------------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------------------
    public boolean deletarModelo(UUID id) {

        if (id == null) return false;
        if (!modeloRepository.existsById(id)) return false;

        modeloRepository.deleteById(id);
        return true;
    }
}
