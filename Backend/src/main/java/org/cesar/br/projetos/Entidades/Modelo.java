package org.cesar.br.projetos.Entidades;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
public class Modelo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Getter @Setter
    private String nome;

    @Getter @Setter
    private String descricao;

    // Dono do modelo: UM usuário pode ter MUITOS modelos
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    @JsonBackReference          // par com @JsonManagedReference em Usuario.modelos
    @Getter @Setter
    private Usuario usuario;

    // UM modelo -> MUITAS perguntas
    @OneToMany(mappedBy = "modelo", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference       // par com @JsonBackReference em Pergunta.modelo
    @Getter @Setter
    private List<Pergunta> perguntas = new ArrayList<>();

    // Construtor de conveniência (sem id, que é gerado pelo banco)
    public Modelo(String nome, String descricao, Usuario usuario) {
        this.nome = nome;
        this.descricao = descricao;
        this.usuario = usuario;
    }

    // Métodos utilitários de domínio (sincronizam os dois lados da relação)
    public void adicionarPergunta(Pergunta p) {
        perguntas.add(p);
        p.setModelo(this);
    }

    public void removerPergunta(Pergunta p) {
        perguntas.remove(p);
        p.setModelo(null);
    }
}
