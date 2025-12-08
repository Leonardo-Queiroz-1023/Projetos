package org.cesar.br.projetos.Repository;

import org.cesar.br.projetos.Entidades.Pergunta;
import org.cesar.br.projetos.Entidades.Modelo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerguntaRepository extends JpaRepository<Pergunta, Long> {

    List<Pergunta> findByModelo(Modelo modelo);

    List<Pergunta> findByModeloId(Long modeloId);
}
