package org.cesar.br.projetos.DTO;

import lombok.Getter;
import lombok.Setter;
import org.cesar.br.projetos.Entidades.EnumTipoDePesquisas;
import org.cesar.br.projetos.Entidades.PlataformasDeEnvio;
import java.awt.Image;

@Getter
@Setter
public class ModeloDTO{
    private long id;
    private String nome;
    private String descricao;
    private PlataformasDeEnvios plataformasDisponiveis;
    private String pergunta;
    
 public ModeloDTO() {}

    public ModeloDTO(long id, String nome, String descricao, PlataformasDeEnvios plataformasDisponiveis, String pergunta) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.plataformasDisponiveis = plataformasDisponiveis;
        this.pergunta = pergunta;
    }

    // Conversão de Entidade para DTO
    public static ModeloDTO fromEntity(Modelo modelo) {
        return new ModeloDTO(
            modelo.getId(),
            modelo.getNome(),
            modelo.getDescricao(),
            modelo.getPlataformasDisponiveis(),
            modelo.getPergunta()
        );
    }

    // Conversão de DTO para Entidade
    public Modelo toEntity() {
        return new Modelo(id, nome, descricao, plataformasDisponiveis, pergunta);
    }
}