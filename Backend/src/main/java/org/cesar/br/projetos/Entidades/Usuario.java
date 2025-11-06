package org.cesar.br.projetos.Entidades;

import java.time.LocalDate;
import java.io.Serializable;

import lombok.*;

public class Usuario implements Serializable{

	@Getter @Setter private String nome;
	@Getter @Setter private String email;
	@Getter @Setter private String senha;
	@Getter private LocalDate dataCadastro;
	
	Usuario(){}
	
	public Usuario(String nome, String email, String senha, LocalDate dataCadastro){
		this.nome = nome;
		this.email = email;
		this.senha = senha;
		this.dataCadastro = dataCadastro;
	}

}
