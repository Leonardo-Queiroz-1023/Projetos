package org.cesar.br.projetos.Service;

import org.cesar.br.projetos.Entidades.Respondente;
import org.cesar.br.projetos.Repository.RespondenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RespondenteService {

    private final RespondenteRepository respondenteRepository;

    @Autowired
    public RespondenteService(RespondenteRepository respondenteRepository) {
        this.respondenteRepository = respondenteRepository;
    }

    // ---------------------------------------------------------------------
    // CREATE - registrar um respondente na base de contatos
    // ---------------------------------------------------------------------
    public Respondente criarRespondente(String nome,
                                        String telefone,
                                        String email,
                                        boolean interagiuTransacaoSebrae) {

        if ((telefone == null || telefone.trim().isEmpty())
                && (email == null || email.trim().isEmpty())) {
            return null;
        }

        Respondente r = new Respondente(nome, telefone, email, interagiuTransacaoSebrae);
        return respondenteRepository.save(r);
    }

    // "Upsert" por email: se existir, atualiza; senão, cria
    public Respondente criarOuAtualizarPorEmail(String nome,
                                                String telefone,
                                                String email,
                                                boolean interagiuTransacaoSebrae) {

        if (email == null || email.trim().isEmpty()) {
            // se não tiver email, usa o fluxo simples
            return criarRespondente(nome, telefone, email, interagiuTransacaoSebrae);
        }

        Respondente existente = respondenteRepository.findByEmail(email).orElse(null);
        if (existente == null) {
            return criarRespondente(nome, telefone, email, interagiuTransacaoSebrae);
        }

        if (nome != null && !nome.trim().isEmpty()) {
            existente.setNome(nome);
        }
        if (telefone != null && !telefone.trim().isEmpty()) {
            existente.setTelefone(telefone);
        }

        // Se já era true ou novo valor é true, mantém true
        existente.setInteragiuTransacaoSebrae(
                existente.isInteragiuTransacaoSebrae() || interagiuTransacaoSebrae
        );

        return respondenteRepository.save(existente);
    }

    // ---------------------------------------------------------------------
    // READ
    // ---------------------------------------------------------------------
    public Respondente buscarPorId(Long id) {
        if (id == null) return null;
        return respondenteRepository.findById(id).orElse(null);
    }

    public Respondente buscarPorEmail(String email) {
        if (email == null || email.trim().isEmpty()) return null;
        return respondenteRepository.findByEmail(email).orElse(null);
    }

    public Respondente buscarPorTelefone(String telefone) {
        if (telefone == null || telefone.trim().isEmpty()) return null;
        return respondenteRepository.findByTelefone(telefone).orElse(null);
    }

    public List<Respondente> listarTodos() {
        return respondenteRepository.findAll();
    }

    // ---------------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------------
    public boolean atualizarRespondente(Long id,
                                        String nome,
                                        String telefone,
                                        String email,
                                        Boolean interagiuTransacaoSebrae) {

        if (id == null) return false;

        Respondente existente = respondenteRepository.findById(id).orElse(null);
        if (existente == null) return false;

        if (nome != null && !nome.trim().isEmpty()) {
            existente.setNome(nome);
        }
        if (telefone != null && !telefone.trim().isEmpty()) {
            existente.setTelefone(telefone);
        }
        if (email != null && !email.trim().isEmpty()) {
            existente.setEmail(email);
        }
        if (interagiuTransacaoSebrae != null) {
            existente.setInteragiuTransacaoSebrae(interagiuTransacaoSebrae);
        }

        respondenteRepository.save(existente);
        return true;
    }

    // ---------------------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------------------
    public boolean deletarRespondente(Long id) {
        if (id == null) return false;
        if (!respondenteRepository.existsById(id)) return false;

        respondenteRepository.deleteById(id);
        return true;
    }
}
