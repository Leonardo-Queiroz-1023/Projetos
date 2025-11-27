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
import java.util.UUID;

@Entity
@Getter @Setter
public class Pesquisa implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private LocalDate dataInicio;
    private LocalDate dataFinal;

    // Relacionamento ManyToOne com Modelo
    // Uma pesquisa usa um Modelo específico de questionário
    @ManyToOne
    @JoinColumn(name = "modelo_id", nullable = false)
    @JsonBackReference("modelo-pesquisas")
    private Modelo modelo;

    // Relacionamento OneToMany com PesquisaRespondida
    // Uma pesquisa pode ser respondida por vários usuários (gerando várias PesquisaRespondida)
    @OneToMany(mappedBy = "pesquisa", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("pesquisa-respondidas")
    private List<PesquisaRespondida> respostas = new ArrayList<>();

    public Pesquisa() {}

    public Pesquisa(Modelo modelo, LocalDate dataInicio, LocalDate dataFinal) {
        this.modelo = modelo;
        this.dataInicio = dataInicio;
        this.dataFinal = dataFinal;
    }
}