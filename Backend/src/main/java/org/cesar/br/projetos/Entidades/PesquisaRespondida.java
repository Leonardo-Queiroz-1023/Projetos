package org.cesar.br.projetos.Entidades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"pesquisa_id", "usuario_id"})
})
public class PesquisaRespondida implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter
    private UUID id;

    @Getter @Setter
    private LocalDateTime horarioAcesso;
    private LocalDateTime horarioResposta;


    @ManyToOne
    @JoinColumn(name = "pesquisa_id", nullable = false)
    @JsonBackReference("pesquisa-respondidas") // Evita loop infinito ao serializar Pesquisa
    @Getter @Setter
    private Pesquisa pesquisa;

    boolean Respondida;
    boolean acessado;

    @OneToMany(mappedBy = "pesquisaRespondida", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("respondida-respostas")
    @Getter @Setter
    private List<Resposta> respostas = new ArrayList<>();

    public PesquisaRespondida() {}

    public PesquisaRespondida(Pesquisa pesquisa, Respondente respondente) {
        this.pesquisa = pesquisa;
        this.respondente = respondente;
        this.horarioResposta = LocalDateTime.now(); // Marca a data/hora atual automaticamente
    }
}