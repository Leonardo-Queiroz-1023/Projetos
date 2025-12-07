package org.cesar.br.projetos.Entidades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@NoArgsConstructor
public class Pergunta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Getter @Setter
    private String questao;

    // depois você pode acrescentar tipo de pergunta:
    // @Getter @Setter
    // private String tipo; // TEXT, MULTIPLE_CHOICE, RATING...

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modelo_id", nullable = false)
    @JsonBackReference          // par com @JsonManagedReference em Modelo.perguntas
    @Getter @Setter
    private Modelo modelo;

    // Construtor de conveniência (sem id; o banco gera)
    public Pergunta(String questao, Modelo modelo) {
        this.questao = questao;
        this.modelo = modelo;
    }
}
