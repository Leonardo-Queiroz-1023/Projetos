package org.cesar.br.projetos.Entidades;

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
    @GeneratedValue
    @Getter
    private UUID id;

    @Getter @Setter
    private String nome;

    @Getter @Setter
    private String descricao;

    @Getter @Setter
    @Enumerated(EnumType.STRING)
    private PlataformasDeEnvios plataformasDisponiveis;

    @OneToMany(mappedBy = "modelo", cascade = CascadeType.ALL, orphanRemoval = true)
    @Getter @Setter
    private List<Pergunta> perguntas = new ArrayList<>();

    public Modelo(UUID id, String nome, String descricao, PlataformasDeEnvios plataformasDisponiveis) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.plataformasDisponiveis = plataformasDisponiveis;
    }
}
