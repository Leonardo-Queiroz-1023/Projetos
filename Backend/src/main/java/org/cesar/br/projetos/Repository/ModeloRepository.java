package org.cesar.br.projetos.Repository;

import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModeloRepository extends JpaRepository<Modelo, Long> {

    // Todos os modelos de um usuário
    List<Modelo> findByUsuario(Usuario usuario);

    // Um modelo específico, garantindo que pertence ao usuário informado
    Optional<Modelo> findByIdAndUsuario(Long id, Usuario usuario);
}
