package org.cesar.br.projetos.Dao;

import java.util.ArrayList;
import java.util.List;
import Java.util.UUID;
import org.cesar.br.projetos.Entidades.Pergunta;

public class PerguntaDAO {

    private static final List<Pergunta> perguntas = new ArrayList<>();

    // CREATE - adicionar pergunta
    public void salvar(Pergunta pergunta) {
        perguntas.add(pergunta);
    }

    // READ ALL - listar perguntas
    public List<Pergunta> listarTodas() {
        return new ArrayList<>(perguntas);
    }

    // READ BY ID
    public Pergunta buscarPorId(UUID id) {
        for (Pergunta p : perguntas) {
            if (p.getId() == id) {
                return p;
            }
        }
        return null;
    }

    // UPDATE - substituir pergunta
    public void atualizar(Pergunta perguntaAtualizada) {
        for (int i = 0; i < perguntas.size(); i++) {
            if (perguntas.get(i).getId() == perguntaAtualizada.getId()) {
                perguntas.set(i, perguntaAtualizada);
                return;
            }
        }
    }

    // DELETE - remover pergunta
    public void deletar(UUID id) {
        perguntas.removeIf(p -> p.getId() == id);
    }
}