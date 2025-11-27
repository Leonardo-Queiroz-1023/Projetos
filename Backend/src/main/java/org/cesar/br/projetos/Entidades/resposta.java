package org.cesar.br.projetos.Entidades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Getter @Setter
public class Resposta implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(columnDefinition = "TEXT")
    private String texto;

    @ManyToOne
    @JoinColumn(name = "pergunta_id", nullable = false)
    private Pergunta pergunta;

    @ManyToOne
    @JoinColumn(name = "pesquisa_respondida_id", nullable = false)
    @JsonBackReference("respondida-respostas") // Conecta com o @JsonManagedReference da PesquisaRespondida
    private PesquisaRespondida pesquisaRespondida;

    public Resposta() {}

    public Resposta(String texto, Pergunta pergunta, PesquisaRespondida pesquisaRespondida) {
        this.texto = texto;
        this.pergunta = pergunta;
        this.pesquisaRespondida = pesquisaRespondida;
    }
}