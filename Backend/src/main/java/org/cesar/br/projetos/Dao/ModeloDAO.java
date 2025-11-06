package org.cesar.br.projetos.Dao;

import java.util.ArrayList;
import java.util.List;
import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.PlataformasDeEnvios;

public class ModeloDAO {

    private static final List<Modelo> modelos = new ArrayList<>();

    public boolean salvar(Modelo modelo) {
        if (modelo == null) {
            return false;
        }
        modelos.add(modelo);
        return true;
    }

    public List<Modelo> listarTodos() {
        return new ArrayList<>(modelos);
    }

    public Modelo buscarPorId(long id) {
        for (Modelo modelo : modelos) {
            if (modelo.getId() == id) {
                return modelo;
            }
        }
        return null;
    }

    public boolean atualizarNome(long id, String nome) {
        Modelo modelo = buscarPorId(id);
        if (modelo == null || nome == null || nome.trim().isEmpty()) {
            return false;
        }
        modelo.setNome(nome);
        return true;
    }

    public boolean atualizarDescricao(long id, String descricao) {
        Modelo modelo = buscarPorId(id);
        if (modelo == null || descricao == null || descricao.trim().isEmpty()) {
            return false;
        }
        modelo.setDescricao(descricao);
        return true;
    }

    public boolean atualizarPlataforma(long id, PlataformasDeEnvios plataforma) {
        Modelo modelo = buscarPorId(id);
        if (modelo == null || plataforma == null) {
            return false;
        }
        modelo.setPlataformasDisponiveis(plataforma);
        return true;
    }

    public boolean atualizarPergunta(long id, String pergunta) {
        Modelo modelo = buscarPorId(id);
        if (modelo == null || pergunta == null || pergunta.trim().isEmpty()) {
            return false;
        }
        modelo.setPergunta(pergunta);
        return true;
    }

    public boolean deletar(long id) {
        Modelo modelo = buscarPorId(id);
        if (modelo == null) {
            return false;
        }
        return modelos.remove(modelo);
    }
}
