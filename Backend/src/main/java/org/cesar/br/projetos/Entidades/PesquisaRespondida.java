package org.cesar.br.projetos.Entidades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class PesquisaRespondida implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Vínculo com a Pesquisa (muitas respostas para uma pesquisa)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pesquisa_id", nullable = false)
    @JsonBackReference("pesquisa-respondidas") // par com @JsonManagedReference em Pesquisa.respostas
    private Pesquisa pesquisa;

    // Vínculo com o Respondente (muitas submissões de um mesmo respondente)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "respondente_id", nullable = false)
    @JsonBackReference("respondente-respondidas") // par com @JsonManagedReference em Respondente.pesquisasRespondidas
    private Respondente respondente;

    // Quando a pessoa acessou o link (primeiro acesso)
    private LocalDateTime horarioAcesso;

    // Quando finalizou a resposta
    private LocalDateTime horarioResposta;

    // ex.: saiu sem terminar, abandonou
    private boolean cessado;

    // ex.: completou e enviou
    private boolean respondida;

    // Uma submissão (PesquisaRespondida) tem várias Respostas (uma por Pergunta)
    @OneToMany(mappedBy = "pesquisaRespondida", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("respondida-respostas")
    private List<Resposta> respostas = new ArrayList<>();

    // Construtor de conveniência
    public PesquisaRespondida(Pesquisa pesquisa, Respondente respondente) {
        this.pesquisa = pesquisa;
        this.respondente = respondente;
        this.horarioAcesso = LocalDateTime.now();
        this.respondida = false;
        this.cessado = false;
    }
}
