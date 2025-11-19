package org.cesar.br.projetos.Dao;

import java.util.ArrayList;
import java.util.List;
import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.PlataformasDeEnvios;


public class ModeloDAO {

    private static final List<Modelo> modelos = new ArrayList<>();

    // adicionar o modelo
    public void salvar(Modelo modelo) {
        modelos.add(modelo);
    }

    // ler todos os modelos
    public List<Modelo> listarTodos() {
        return new ArrayList<>(modelos);
    }

    // ler o id unico
    public Modelo buscarPorId(long id) {
        for (int i = 0; i < modelos.size(); i++) {
            if (modelos.get(i).getId() == id) {
                return modelos.get(i);
            }
        }
        return null;
    }

    //  substitui o objeto inteiro pelo atualizado
    public void atualizar(Modelo modeloAtualizado) {
        for (int i = 0; i < modelos.size(); i++) {
            if (modelos.get(i).getId() == modeloAtualizado.getId()) {
                modelos.set(i, modeloAtualizado);
                return;
            }
        }
    }

    // deletar um modelo
    public void deletar(long id) {
        modelos.removeIf(m -> m.getId() == id);
    }
}
