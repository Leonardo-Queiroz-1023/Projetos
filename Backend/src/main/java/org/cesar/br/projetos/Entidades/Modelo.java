package org.cesar.br.projetos.Entidades;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

public class Modelo implements Serializable {

    @Getter
    private final long id;

    @Getter @Setter
    private String nome;

    @Getter @Setter
    private String descricao;

    @Getter @Setter
    private PlataformasDeEnvios plataformasDisponiveis;

    @Getter @Setter
    private List <Perguntas> perguntas = new ArrayList<>();

    public Modelo() {
        this.id = 0;
        this.perguntas = new ArrayList<>();
    }

    public Modelo(long id, String nome, String descricao, PlataformasDeEnvios plataformasDisponiveis, String pergunta) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.plataformasDisponiveis = plataformasDisponiveis;
        this.perguntas = new ArrayList<>();
    }
    
    public void adicionarPergunta(Perguntas pergunta) {
    	perguntas.add(pergunta);
    } 
    
    public Perguntas selecionarPergunta(int numeroPerguntas) {
    	int cont = 1;
    	for(Perguntas p : perguntas) {
    		if(cont == numeroPerguntas) {
    			return p;
    		}
    		cont++;
    	}
    	return null;
    }
    

}
