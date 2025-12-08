package org.cesar.br.projetos.Repository;

import org.cesar.br.projetos.Entidades.Respondente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RespondenteRepository extends JpaRepository<Respondente, Long> {

    Optional<Respondente> findByEmail(String email);

    Optional<Respondente> findByTelefone(String telefone);
}
