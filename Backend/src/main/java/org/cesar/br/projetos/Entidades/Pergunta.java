package org.cesar.br.projetos.Entidades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;
import java.util.UUID;

@Entity
public class Pergunta implements Serializable {

    @Id
    @Getter
    private UUID id;

    @Getter @Setter
    private String questao;

    @ManyToOne
    @JoinColumn(name = "modelo_id")
    @JsonBackReference
    @Getter @Setter
    private Modelo modelo;

    public Pergunta() {}

    public Pergunta(String questao) {


        this.id = UUID.randomUUID();
        this.questao = questao;
    }
}