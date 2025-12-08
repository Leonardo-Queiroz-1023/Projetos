package org.cesar.br.projetos.Entidades;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Respondente implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // Depois você pode padronizar para +55DDDNÚMERO
    private String telefone;

    private String email;

    /**
     * Indica se essa pessoa já interagiu em alguma transação com o Sebrae.
     * (nome camelCase para ficar consistente com Java)
     */
    private boolean interagiuTransacaoSebrae;

    /**
     * Base de contatos geral:
     * Um mesmo Respondente pode ter várias participações em pesquisas diferentes,
     * cada uma representada por uma PesquisaRespondida.
     */
    @OneToMany(mappedBy = "respondente", cascade = CascadeType.ALL, orphanRemoval = false)
    @JsonManagedReference("respondente-respondidas")
    private List<PesquisaRespondida> pesquisasRespondidas = new ArrayList<>();

    // Construtor de conveniência
    public Respondente(String nome, String telefone, String email, boolean interagiuTransacaoSebrae) {
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.interagiuTransacaoSebrae = interagiuTransacaoSebrae;
    }
}
