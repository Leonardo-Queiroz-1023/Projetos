package org.cesar.br.projetos.Entidades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Pesquisa implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private LocalDate dataInicio;

    private LocalDate dataFinal;

    // Uma pesquisa usa um Modelo específico de questionário
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modelo_id", nullable = false)
    @JsonBackReference("modelo-pesquisas")
    private Modelo modelo;

    // Dono da pesquisa (usuário autenticado que criou)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario owner;

    // Uma pesquisa pode ser respondida várias vezes (várias PesquisaRespondida)
    @OneToMany(mappedBy = "pesquisa", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("pesquisa-respondidas")
    private List<PesquisaRespondida> respostas = new ArrayList<>();

    public Pesquisa() {
    }

    public Pesquisa(String nome, Modelo modelo, LocalDate dataInicio, LocalDate dataFinal, Usuario owner) {
        this.nome = nome;
        this.modelo = modelo;
        this.dataInicio = dataInicio;
        this.dataFinal = dataFinal;
        this.owner = owner;
    }
}
