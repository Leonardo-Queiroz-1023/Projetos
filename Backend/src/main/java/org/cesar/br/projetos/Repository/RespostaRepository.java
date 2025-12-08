package org.cesar.br.projetos.Repository;

import org.cesar.br.projetos.Entidades.Resposta;
import org.cesar.br.projetos.Entidades.Pergunta;
import org.cesar.br.projetos.Entidades.PesquisaRespondida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RespostaRepository extends JpaRepository<Resposta, Long> {

    List<Resposta> findByPergunta(Pergunta pergunta);

    List<Resposta> findByPesquisaRespondida(PesquisaRespondida pesquisaRespondida);
}
