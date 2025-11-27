package org.cesar.br.projetos.Repository;

import org.cesar.br.projetos.Entidades.Pesquisa;
import org.cesar.br.projetos.Entidades.PesquisaRespondida;
import org.cesar.br.projetos.Entidades.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PesquisaRespondidaRepository extends JpaRepository<PesquisaRespondida, UUID> {

    PesquisaRespondida findByPesquisaAndUsuario(Pesquisa pesquisa, Usuario usuario);

    List<PesquisaRespondida> findByUsuario(Usuario usuario);

    List<PesquisaRespondida> findByPesquisa(Pesquisa pesquisa);

    long countByPesquisa(Pesquisa pesquisa);
}