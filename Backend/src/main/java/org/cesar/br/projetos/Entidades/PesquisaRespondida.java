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
    private LocalDateTime dataResposta;

    @ManyToOne
    @JoinColumn(name = "pesquisa_id", nullable = false)
    @JsonBackReference("pesquisa-respondidas") // Evita loop infinito ao serializar Pesquisa
    @Getter @Setter
    private Pesquisa pesquisa;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    @Getter @Setter
    private Usuario usuario;

    @OneToMany(mappedBy = "pesquisaRespondida", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("respondida-respostas")
    @Getter @Setter
    private List<Resposta> respostas = new ArrayList<>();

    public PesquisaRespondida() {}

    public PesquisaRespondida(Pesquisa pesquisa, Usuario usuario) {
        this.pesquisa = pesquisa;
        this.usuario = usuario;
        this.dataResposta = LocalDateTime.now(); // Marca a data/hora atual automaticamente
    }
}