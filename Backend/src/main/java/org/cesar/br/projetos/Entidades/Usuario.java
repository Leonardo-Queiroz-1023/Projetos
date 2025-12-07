package org.cesar.br.projetos.Entidades;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor // gera o construtor vazio automaticamente
public class Usuario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Getter @Setter
    private String nome;

    @Column(unique = true, nullable = false)
    @Getter @Setter
    private String email;

    // Importante: agora a senha é armazenada como "hash" e não texto puro
    @Getter @Setter
    private String senhaHash;

    @Getter @Setter
    private boolean isAdmin;

    // Relação: UM usuário -> MUITOS modelos
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Getter @Setter
    private List<Modelo> modelos = new ArrayList<>();

    // Construtor de conveniência
    public Usuario(String nome, String email, String senhaHash, boolean isAdmin) {
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.isAdmin = isAdmin;
    }
}
