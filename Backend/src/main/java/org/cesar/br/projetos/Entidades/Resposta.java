package org.cesar.br.projetos.Entidades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Resposta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // valor textual da resposta (usando TEXT no banco,
    // pra permitir respostas abertas grandes)
    @Column(columnDefinition = "TEXT")
    private String texto;

    // Se no futuro você tiver tipos de pergunta (escala, NPS, etc.),
    // pode adicionar um campo numérico aqui, por exemplo:
    // private BigDecimal valorNumerico;

    // Pergunta à qual esta resposta se refere
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pergunta_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Pergunta pergunta;

    // Submissão (PesquisaRespondida) à qual esta resposta pertence
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pesquisa_respondida_id", nullable = false)
    @JsonBackReference("respondida-respostas") // par com @JsonManagedReference em PesquisaRespondida.respostas
    private PesquisaRespondida pesquisaRespondida;

    // Construtor de conveniência
    public Resposta(String texto, Pergunta pergunta, PesquisaRespondida pesquisaRespondida) {
        this.texto = texto;
        this.pergunta = pergunta;
        this.pesquisaRespondida = pesquisaRespondida;
    }
}
