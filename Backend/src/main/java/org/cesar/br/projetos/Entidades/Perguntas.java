package org.cesar.br.projetos.Entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.util.UUID;

@Entity
public class Pergunta implements Serializable {

    @Id
    @GeneratedValue
    @Getter
    private UUID id;

    @Getter @Setter
    private String questao;

    @ManyToOne
    @JoinColumn(name = "modelo_id")
    @Getter @Setter
    private Modelo modelo;


    public Pergunta(String questao) {
        this.id = id;
        this.questao = questao;
    }
}
