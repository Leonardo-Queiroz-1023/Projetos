package org.cesar.br.projetos.Entidades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class Modelo implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter
    private UUID id;

    @Getter @Setter
    private String nome;

    @Getter @Setter
    private String descricao;

    @Getter @Setter
    @Enumerated(EnumType.STRING)
    private PlataformasDeEnvios plataformasDisponiveis;

    @OneToMany(mappedBy = "modelo", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    @JsonManagedReference
    @Getter @Setter
    private List<Pergunta> perguntas = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = true)
    @JsonBackReference
    @Getter @Setter
    private Usuario usuario;

    public Modelo() {}
    
    public Modelo(UUID id, String nome, String descricao, PlataformasDeEnvios plataformasDisponiveis, Usuario usuario) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.plataformasDisponiveis = plataformasDisponiveis;
        this.usuario = usuario;
    }
    
    // Construtor sem ID para deixar Hibernate gerar
    public Modelo(String nome, String descricao, PlataformasDeEnvios plataformasDisponiveis, Usuario usuario) {
        this.nome = nome;
        this.descricao = descricao;
        this.plataformasDisponiveis = plataformasDisponiveis;
        this.usuario = usuario;
    }
}
