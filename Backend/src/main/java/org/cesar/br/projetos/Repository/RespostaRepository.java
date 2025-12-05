package org.cesar.br.projetos.Repository;

import org.cesar.br.projetos.Entidades.Resposta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RespostaRepository extends JpaRepository<Resposta, UUID> {

}