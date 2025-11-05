package org.cesar.br.projetos.Entidades;

import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;

public class Modelo implements Serializable {

    private final long id;

    @Getter @Setter private String nome;
    @Getter @Setter private String descricao;
    @Getter @Setter private PlataformasDeEnvios plataformasDisponiveis;
    @Getter @Setter private String pergunta;

    // Construtor sem parâmetros
    Modelo() {
        this.id = 0;  // ID deve ser configurado em um outro ponto, se necessário
    }

    // Construtor com parâmetros
    public Modelo(long id, String nome, String descricao, PlataformasDeEnvios plataformasDisponiveis, String pergunta) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.plataformasDisponiveis = plataformasDisponiveis;
        this.pergunta = pergunta;
    }

    // Método para gerar cópia
    public Modelo gerarCopia() {
        return new Modelo(id, nome, descricao, plataformasDisponiveis, pergunta);
    }
}
