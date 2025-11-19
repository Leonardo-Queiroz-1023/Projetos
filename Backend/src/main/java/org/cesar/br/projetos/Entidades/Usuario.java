package org.cesar.br.projetos.Entidades;

import java.time.LocalDate;
import java.io.Serializable;

import jakarta.persistence.*;
import lombok.*;

@Entity
public class Usuario implements Serializable{

	@Id
	@GeneratedValue
	@Getter
	private Long id;

	@Getter @Setter private String nome;
	@Getter @Setter private String email;
	@Getter @Setter private String senha;
	@Getter private LocalDate dataCadastro;
	
	public Usuario(){}
	
	public Usuario(String nome, String email, String senha, LocalDate dataCadastro){
		this.nome = nome;
		this.email = email;
		this.senha = senha;
		this.dataCadastro = dataCadastro;
	}

}
