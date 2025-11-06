package org.cesar.br.projetos.Dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.cesar.br.projetos.Entidades.Modelo;

public class ModeloDAO {
    private static final List<Modelo> bancoFake = new ArrayList<>();

    // CREATE
    public void salvar(Modelo modelo) {
        bancoFake.add(modelo);
    }

    // READ
    public List<Modelo> listarTodos() {
        return new ArrayList<>(bancoFake);
    }

   // public Optional<Modelo> buscarPorId(long id) {
     //   return bancoFake.stream()
    //            .filter(m -> m.getId() == id)
     //           .findFirst();
   // }
    // UPDATE
    public void atualizar(Modelo modeloAtualizado) {
        buscarPorId(modeloAtualizado.getId()).ifPresent(modelo -> {
            bancoFake.remove(modelo);
            bancoFake.add(modeloAtualizado);
        });
    }

    // DELETE
    public void deletar(long id) {
        bancoFake.removeIf(m -> m.getId() == id);
    }
}
