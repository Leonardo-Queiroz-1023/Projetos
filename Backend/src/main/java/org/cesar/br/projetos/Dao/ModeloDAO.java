package org.cesar.br.projetos.Dao;

import java.util.ArrayList;
import java.util.List;
import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.PlataformasDeEnvios;

/**
 * DAO responsável apenas pelo acesso e manipulação dos dados da entidade Modelo.
 *
 * Esta é uma implementação simples em memória, sem conexão real com banco de dados.
 * Nenhuma regra de negócio ou validação deve ser feita aqui.
 */
public class ModeloDAO {

    private static final List<Modelo> modelos = new ArrayList<>();

    // CREATE
    public void salvar(Modelo modelo) {
        modelos.add(modelo);
    }

    // READ (todos)
    public List<Modelo> listarTodos() {
        return new ArrayList<>(modelos);
    }

    // READ (por ID) — versão simplificada sem for-each
    public Modelo buscarPorId(long id) {
        for (int i = 0; i < modelos.size(); i++) {
            if (modelos.get(i).getId() == id) {
                return modelos.get(i);
            }
        }
        return null;
    }

    // UPDATE — substitui o objeto inteiro pelo atualizado
    public void atualizar(Modelo modeloAtualizado) {
        for (int i = 0; i < modelos.size(); i++) {
            if (modelos.get(i).getId() == modeloAtualizado.getId()) {
                modelos.set(i, modeloAtualizado);
                return;
            }
        }
    }

    // DELETE
    public void deletar(long id) {
        modelos.removeIf(m -> m.getId() == id);
    }
}
