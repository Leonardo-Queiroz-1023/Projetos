package org.cesar.br.projetos.Mediator;

import org.cesar.br.projetos.Dao.ModeloDAO;
import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.PlataformasDeEnvios;

import java.util.List;
import java.util.UUID;

public class ModeloMediator {

    private static ModeloDAO modeloD;
    private static ModeloMediator instancia;

    private ModeloMediator() {}

    public static ModeloMediator getInstancia() {
        if (instancia == null) {
            instancia = new ModeloMediator();
            modeloD = new ModeloDAO();
        }
        return instancia;
    }

    // ---------------------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------------------
    public boolean criarModelo(UUID id, String nome, String descricao,
                               PlataformasDeEnvios plataformasDisponiveis) {

        if (nome == null || nome.trim().isEmpty()) return false;
        if (descricao == null || descricao.trim().isEmpty()) return false;

        // Evita duplicação de ID
        if (modeloD.buscarPorId(id) != null) return false;

        Modelo modelo = new Modelo(id, nome, descricao, plataformasDisponiveis);
        modeloD.salvar(modelo);
        return true;
    }

    // ---------------------------------------------------------------------
    // READ
    // ---------------------------------------------------------------------
    public List<Modelo> listarModelos() {
        return modeloD.listarTodos();
    }

    public Modelo buscarModeloPorId(UUID id) {
        if (id == null) return null;
        return modeloD.buscarPorId(id);
    }

    // ---------------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------------
    public boolean atualizarModelo(UUID id, String nome, String descricao,
                                   PlataformasDeEnvios plataformasDisponiveis) {

        if (id == null) return false;
        Modelo existente = modeloD.buscarPorId(id);
        if (existente == null) return false;

        if (nome != null && !nome.trim().isEmpty()) existente.setNome(nome);
        if (descricao != null && !descricao.trim().isEmpty()) existente.setDescricao(descricao);
        if (plataformasDisponiveis != null) existente.setPlataformasDisponiveis(plataformasDisponiveis);

        modeloD.atualizar(existente);
        return true;
    }

    // ---------------------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------------------
    public boolean deletarModelo(UUID id) {

        if (id == null) return false;
        Modelo existente = modeloD.buscarPorId(id);
        if (existente == null) return false;

        modeloD.deletar(id);
        return true;
    }
}
