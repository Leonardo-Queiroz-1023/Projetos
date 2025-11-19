package org.cesar.br.projetos.Dao;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.cesar.br.projetos.Entidades.Modelo;

public class ModeloDAO {

    private static final List<Modelo> modelos = new ArrayList<>();

    // CREATE
    public void salvar(Modelo modelo) {
        modelos.add(modelo);
    }

    // READ ALL
    public List<Modelo> listarTodos() {
        return new ArrayList<>(modelos);
    }

    // READ BY ID
    public Modelo buscarPorId(UUID id) {
        for (Modelo modelo : modelos) {
            if (modelo.getId().equals(id)) {
                return modelo;
            }
        }
        return null;
    }

    // UPDATE
    public void atualizar(Modelo modeloAtualizado) {
        for (int i = 0; i < modelos.size(); i++) {
            if (modelos.get(i).getId().equals(modeloAtualizado.getId())) {
                modelos.set(i, modeloAtualizado);
                return;
            }
        }
    }

    // DELETE
    public void deletar(UUID id) {
        modelos.removeIf(m -> m.getId().equals(id));
    }
}