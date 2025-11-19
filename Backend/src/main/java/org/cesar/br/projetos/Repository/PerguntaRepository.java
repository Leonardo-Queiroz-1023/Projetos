package org.cesar.br.projetos.Repository;

import org.cesar.br.projetos.Entidades.Pergunta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PerguntaRepository extends JpaRepository<Pergunta, UUID> {
}
