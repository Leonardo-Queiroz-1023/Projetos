package org.cesar.br.projetos.Entidades;

import java.io.Serializable;
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
    private String pergunta;

    Modelo() {
        this.id = 0;
    }

    public Modelo(long id, String nome, String descricao, PlataformasDeEnvios plataformasDisponiveis, String pergunta) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.plataformasDisponiveis = plataformasDisponiveis;
        this.pergunta = pergunta;
    }

    public Modelo gerarCopia() {
        return new Modelo(id, nome, descricao, plataformasDisponiveis, pergunta);
    }
}
