package org.cesar.br.projetos.Dao;

import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.Perguntas;
import java.util.ArrayList;
import java.util.List;

public class PerguntasDAO {
    private static final List<Perguntas> listaPerguntas = new ArrayList<>();
    
    public boolean salvar(Perguntas perguntas) {
    	if (perguntas == null) {
    		return false;
    	}
    	listaPerguntas.add(perguntas);
    	return true;
    }
    
    public List<Perguntas> listarTodas(){
    	return new ArrayList<> (listaPerguntas);
    }
    
    public Perguntas buscarPorId(long id) {
        for (Perguntas perguntas : listaPerguntas) {
            if (perguntas.getId() == id) {
                return perguntas;
            }
        }
        
        return null;
    }
    
    public boolean deletar(long id) {
        Perguntas perguntas = buscarPorId(id);
        if (perguntas == null) {
            return false;
        }
        return listaPerguntas.remove(perguntas);
    }
    
    public boolean atualizarDescricao(long id, String novaDescricao) {
        Perguntas p = buscarPorId(id);
        if (p == null) return false;

        p.setDescricao(novaDescricao);
        return true;
    }

}
