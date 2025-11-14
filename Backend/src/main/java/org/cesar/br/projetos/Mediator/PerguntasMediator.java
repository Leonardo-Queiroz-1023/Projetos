package org.cesar.br.projetos.Mediator; //Não está nem perto de complet

import org.cesar.br.projetos.Entidades.Perguntas;
import org.cesar.br.projetos.Dao.PerguntasDAO;

public class PerguntasMediator {
	
	private static PerguntasMediator instancia;
	private static PerguntasDAO perguntasD;
	
	private PerguntasMediator() {
		if(instancia == null) {
			instancia = new PerguntasMediator();
			perguntasD = new PerguntasDAO();			
		}
	}
	
	public boolean incluirPergunta(Perguntas perguntas) {
		if(perguntas == null) {
			return false;
		}
		
		boolean resultado = perguntasD.salvar(perguntas);
		
		return resultado;		
	}
	
	public boolean exluirPergunta(long id) {
		if(id<1) {
			return false;
		}
		
		boolean resultado = perguntasD.deletar(id);
		
		return resultado;
		
	}

}
