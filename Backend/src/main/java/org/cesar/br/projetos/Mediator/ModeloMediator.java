package org.cesar.br.projetos.Mediator;

import org.cesar.br.projetos.Dao.ModeloDAO;
import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.Perguntas;
import org.cesar.br.projetos.Entidades.PlataformasDeEnvios;
import java.util.List;

public class ModeloMediator {

    private static ModeloDAO modeloD;
    private static ModeloMediator instancia;

    private ModeloMediator() {
    }

    public static ModeloMediator getInstancia() {
        if (instancia == null) {
            instancia = new ModeloMediator();
            modeloD = new ModeloDAO();
        }
        return instancia;
    }

    public boolean criarModelo(Modelo modelo) {
        if (modelo == null || modelo.getNome().trim().isEmpty()) {
            return false;
        }

        return modeloD.salvar(modelo);
    }

    public List<Modelo> listarModelos() {
        return modeloD.listarTodos();
    }

    public Modelo buscarModeloPorId(long id) {
        if (id < 0) {
            return null;
        }
        return modeloD.buscarPorId(id);
    }

    public boolean atualizarNome(long id, String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            return false;
        }
        return modeloD.atualizarNome(id, nome);
    }

    public boolean atualizarDescricao(long id, String descricao) {
        if (descricao == null || descricao.trim().isEmpty()) {
            return false;
        }
        return modeloD.atualizarDescricao(id, descricao);
    }

    public boolean atualizarPlataforma(long id, PlataformasDeEnvios plataformasDisponiveis) {
        if (plataformasDisponiveis == null) {
            return false;
        }
        return modeloD.atualizarPlataforma(id, plataformasDisponiveis);
    }

    public boolean atualizarPergunta(long id, Perguntas pergunta, String descricao) {
    	
        if (pergunta == null) {
            return false;
        }
        return modeloD.atualizarPerguntaDescricao(id, pergunta, descricao);
    }

    public boolean deletarModelo(long id) {
        if (id < 0) {
            return false;
        }
        return modeloD.deletar(id);
    }
}
