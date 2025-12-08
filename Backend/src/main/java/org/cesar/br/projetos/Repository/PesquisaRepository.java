package org.cesar.br.projetos.Repository;

import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.Pesquisa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PesquisaRepository extends JpaRepository<Pesquisa, Long> {

    List<Pesquisa> findByModelo(Modelo modelo);

    List<Pesquisa> findByDataInicioLessThanEqualAndDataFinalGreaterThanEqual(LocalDate dataInicio,
                                                                             LocalDate dataFinal);

    List<Pesquisa> findByDataInicio(LocalDate dataInicio);

    List<Pesquisa> findByDataFinal(LocalDate dataFinal);
}
