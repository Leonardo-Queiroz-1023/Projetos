package org.cesar.br.projetos.Repository;

import org.cesar.br.projetos.Entidades.Pesquisa;
import org.cesar.br.projetos.Entidades.PesquisaRespondida;
import org.cesar.br.projetos.Entidades.Respondente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PesquisaRespondidaRepository extends JpaRepository<PesquisaRespondida, Long> {

    List<PesquisaRespondida> findByPesquisaAndRespondente(Pesquisa pesquisa, Respondente respondente);

    long countByPesquisaAndRespondente(Pesquisa pesquisa, Respondente respondente);

    List<PesquisaRespondida> findByRespondente(Respondente respondente);

    List<PesquisaRespondida> findByPesquisa(Pesquisa pesquisa);

    long countByPesquisa(Pesquisa pesquisa);
}