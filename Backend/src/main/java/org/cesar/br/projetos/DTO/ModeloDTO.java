package org.cesar.br.projetos.DTO;

import lombok.Getter;
import lombok.Setter;
import org.cesar.br.projetos.Entidades.PlataformasDeEnvios;

public class ModeloDTO {

    @Getter
    private long id;

    @Getter @Setter
    private String nome;

    @Getter @Setter
    private String descricao;

    @Getter @Setter
    private PlataformasDeEnvios plataformasDisponiveis;

    @Getter @Setter
    private String pergunta;
}
