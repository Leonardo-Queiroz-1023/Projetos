package org.cesar.br.projetos.Entidades;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;


public class Perguntas implements Serializable {
	
	@Getter final long id;
	@Getter @Setter int tipo;
	@Getter @Setter String descricao;
	@Getter @Setter String resposta;
	@Getter @Setter int numeroEstrelas;
	
	public Perguntas (){
		this.id = 0;
		}

	Perguntas(long id,int tipo, String descricao,String resposta, int numeroEstrelas){ // Construtor sobrecarregado para criar perguntas com respostas e estrlas
		this. id = id;
		this.tipo = tipo;
		this.descricao = descricao;
		this.resposta = null;
		this.numeroEstrelas = numeroEstrelas;
	}
	

	
	Perguntas(long id,int tipo, String descricao, String resposta){ // Construtor sobrecarregado para criar perguntas com respostas em texto
		this. id = id;
		this.tipo = tipo;
		this.descricao = descricao;
		this.resposta = null;
	}
	
	Perguntas(long id,int tipo, String descricao, int numeroEstrelas){ // Construtor sobrecarregado para criar perguntas com respostas estrelas
		this. id = id;
		this.tipo = tipo;
		this.descricao = descricao;
		this.numeroEstrelas = numeroEstrelas;
	}	

}
