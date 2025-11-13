package org.cesar.br.projetos.Dao;

import java.util.ArrayList;
import java.util.List;
import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.Perguntas;
import org.cesar.br.projetos.Dao.PerguntasDAO;
import org.cesar.br.projetos.Entidades.PlataformasDeEnvios;
import org.cesar.br.projetos.Mediator.PerguntasMediator;

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

    public boolean atualizarNome(long id, String nome) { // ❌ Desvantagem: os dados somem quando o programa encerra, uma daas solução é usa SQL
        Modelo modelo = buscarPorId(id);
        if (modelo == null || nome == null || nome.trim().isEmpty()) {
            return false;
        }
        modelo.setNome(nome);
        return true;
    }

    public boolean atualizarDescricao(long id, String descricao) { // ❌ Desvantagem: os dados somem quando o programa encerra, uma daas solução é usa SQL
        Modelo modelo = buscarPorId(id);
        if (modelo == null || descricao == null || descricao.trim().isEmpty()) {
            return false;
        }
        modelo.setDescricao(descricao);
        return true;
    }

    public boolean atualizarPlataforma(long id, PlataformasDeEnvios plataforma) { // ❌ Desvantagem: os dados somem quando o programa encerra, uma daas solução é usa SQL
        Modelo modelo = buscarPorId(id);
        if (modelo == null || plataforma == null) {
            return false;
        }
        modelo.setPlataformasDisponiveis(plataforma);
        return true;
    }

    public boolean atualizarPerguntaDescricao(long id, Perguntas perguntaParaAtualizar, String descricao) { // Vai precisar de funções diferentes para atualizar coisas diferentes
        Modelo modelo = buscarPorId(id);
        
        if (modelo == null || perguntaParaAtualizar == null) {
            return false;
        }
        
        long idP = perguntaParaAtualizar.getId();
        
      for(Perguntas p : modelo.getPerguntas()) {
    	  if(p.getId() == idP) {
    		  p.setDescricao(descricao);
    		  
              PerguntasDAO perguntaDAO = new PerguntasDAO(); // ou injetar via construtor
              perguntaDAO.atualizarDescricao(idP, descricao);
    		  
    	  }
      }  
        
        return false;
    }

    public boolean deletar(long id) {
        Modelo modelo = buscarPorId(id);
        if (modelo == null) {
            return false;
        }
        return modelos.remove(modelo);
    }
}
