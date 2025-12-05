package org.cesar.br.projetos.Entidades;

import java.time.LocalDate;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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

	// @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
	// @JsonManagedReference
	// @Getter @Setter
	// private List<Modelo> modelos = new ArrayList<>();

	public Usuario(){}	public Usuario(String nome, String email, String senha){
		this.nome = nome;
		this.email = email;
		this.senha = senha;
	}

}
