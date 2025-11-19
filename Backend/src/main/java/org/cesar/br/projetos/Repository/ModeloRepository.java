package org.cesar.br.projetos.Repository;

import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ModeloRepository extends JpaRepository<Modelo, UUID> {
    List<Modelo> findByUsuario(Usuario usuario);
    Optional<Modelo> findByIdAndUsuario(UUID id, Usuario usuario);
}
