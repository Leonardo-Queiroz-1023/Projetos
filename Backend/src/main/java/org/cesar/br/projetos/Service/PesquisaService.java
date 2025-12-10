package org.cesar.br.projetos.Service;

import org.cesar.br.projetos.Entidades.*;
import org.cesar.br.projetos.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PesquisaService {

    private final PesquisaRepository pesquisaRepository;
    private final PesquisaRespondidaRepository pesquisaRespondidaRepository;
    private final ModeloRepository modeloRepository;
    private final PerguntaRepository perguntaRepository;
    private final RespondenteService respondenteService;
    private final EmailService emailService; // <--- 1. Injeção do EmailService

    @Autowired
    public PesquisaService(PesquisaRepository pesquisaRepository,
                           PesquisaRespondidaRepository pesquisaRespondidaRepository,
                           ModeloRepository modeloRepository,
                           PerguntaRepository perguntaRepository,
                           RespondenteService respondenteService,
                           EmailService emailService) { // <--- 2. Adicionado no construtor
        this.pesquisaRepository = pesquisaRepository;
        this.pesquisaRespondidaRepository = pesquisaRespondidaRepository;
        this.modeloRepository = modeloRepository;
        this.perguntaRepository = perguntaRepository;
        this.respondenteService = respondenteService;
        this.emailService = emailService; // <--- 3. Inicialização
    }

    // -----------------------------------------------------------------
    // DISPARAR EMAIL (NOVO MÉTODO)
    // -----------------------------------------------------------------
    public boolean dispararLinkPorEmail(Long pesquisaId, String nome, String email) {
        // A. Busca ou Cria o Respondente (usa o service existente para garantir consistência)
        // Passamos 'false' pois ele ainda não interagiu, apenas está recebendo o link
        Respondente respondente = respondenteService.criarOuAtualizarPorEmail(nome, null, email, false);

        Pesquisa pesquisa = buscarPesquisaPorId(pesquisaId);

        if (respondente == null || pesquisa == null) return false;

        // B. Gera o Link
        // Aponta para a rota do REACT: /responder/:pesquisaId/:respondenteId
        String link = "http://localhost:5173/responder/" + pesquisaId + "/" + respondente.getId();

        // C. Monta a mensagem
        String assunto = "Convite para Pesquisa: " + pesquisa.getNome();
        String corpo = "Olá " + nome + ",\n\n" +
                "Gostaríamos de ouvir sua opinião sobre: " + pesquisa.getNome() + ".\n" +
                "Por favor, clique no link abaixo para responder à pesquisa:\n\n" +
                link + "\n\n" +
                "Obrigado!";

        // D. Envia
        emailService.enviarEmail(email, assunto, corpo);
        return true;
    }

    // -----------------------------------------------------------------
    // CREATE - criar pesquisa
    // -----------------------------------------------------------------
    public Pesquisa criarPesquisa(String nome,
                                  Long modeloId,
                                  LocalDate dataInicio,
                                  LocalDate dataFinal) {

        if (nome == null || nome.trim().isEmpty()) return null;
        if (modeloId == null || dataInicio == null || dataFinal == null) return null;
        if (dataFinal.isBefore(dataInicio)) return null;

        LocalDate hoje = LocalDate.now();
        if (dataInicio.isBefore(hoje) && dataFinal.isBefore(hoje)) {
            return null;
        }

        Modelo modelo = modeloRepository.findById(modeloId).orElse(null);
        if (modelo == null) return null;
        if (modelo.getPerguntas() == null || modelo.getPerguntas().isEmpty()) {
            return null;
        }

        Pesquisa pesquisa = new Pesquisa(nome, modelo, dataInicio, dataFinal, null);
        return pesquisaRepository.save(pesquisa);
    }

    // -----------------------------------------------------------------
    // READ - buscar pesquisa por ID
    // -----------------------------------------------------------------
    public Pesquisa buscarPesquisaPorId(Long id) {
        if (id == null) return null;
        return pesquisaRepository.findById(id).orElse(null);
    }

    // -----------------------------------------------------------------
    // UPDATE - editar pesquisa
    // -----------------------------------------------------------------
    public Pesquisa editarPesquisa(Long id,
                                   String nome,
                                   LocalDate inicio,
                                   LocalDate fim) {

        Pesquisa p = buscarPesquisaPorId(id);
        if (p == null) return null;

        if (inicio == null || fim == null || fim.isBefore(inicio)) {
            return null;
        }

        p.setDataInicio(inicio);
        p.setDataFinal(fim);

        if (nome != null && !nome.trim().isEmpty()) {
            p.setNome(nome);
        }

        return pesquisaRepository.save(p);
    }

    // -----------------------------------------------------------------
    // DELETE - deletar pesquisa
    // -----------------------------------------------------------------
    public boolean deletarPesquisa(Long id) {
        if (id == null) return false;

        if (!pesquisaRepository.existsById(id)) {
            return false;
        }

        pesquisaRepository.deleteById(id);
        return true;
    }

    // -----------------------------------------------------------------
    // READ - listar pesquisas de um modelo
    // -----------------------------------------------------------------
    public List<Pesquisa> listarPesquisasPorModelo(Long modeloId) {
        if (modeloId == null) return List.of();

        Modelo modelo = modeloRepository.findById(modeloId).orElse(null);
        if (modelo == null) return List.of();

        return pesquisaRepository.findByModelo(modelo);
    }

    // -----------------------------------------------------------------
    // READ - listar todas as pesquisas
    // -----------------------------------------------------------------
    public List<Pesquisa> listarTodas() {
        return pesquisaRepository.findAll();
    }

    // -----------------------------------------------------------------
    // READ - listar pesquisas ativas hoje
    // -----------------------------------------------------------------
    public List<Pesquisa> listarPesquisasAtivasHoje() {
        LocalDate hoje = LocalDate.now();
        return pesquisaRepository.findByDataInicioLessThanEqualAndDataFinalGreaterThanEqual(hoje, hoje);
    }

    public List<Pesquisa> listarPesquisasPorDataInicio(LocalDate data) {
        if (data == null) return List.of();
        return pesquisaRepository.findByDataInicioGreaterThanEqual(data);
    }

    public List<Pesquisa> listarPesquisasPorDataFinal(LocalDate data) {
        if (data == null) return List.of();
        return pesquisaRepository.findByDataFinalLessThanEqual(data);
    }

    // -----------------------------------------------------------------
    // RESPONDER PESQUISA
    // -----------------------------------------------------------------
    public boolean responderPesquisa(Long pesquisaId,
                                     Long respondenteId,
                                     Map<Long, String> respostasUsuario) {

        if (pesquisaId == null || respondenteId == null) return false;
        if (respostasUsuario == null || respostasUsuario.isEmpty()) return false;

        Pesquisa pesquisa = pesquisaRepository.findById(pesquisaId).orElse(null);
        Respondente respondente = respondenteService.buscarPorId(respondenteId);

        if (pesquisa == null || respondente == null) return false;

        // Verifica se já existe uma submissão dessa pesquisa para esse respondente
        if (pesquisaRespondidaRepository.findByPesquisaAndRespondente(pesquisa, respondente) != null) {
            return false;
        }

        // Verifica se está no período de resposta
        LocalDate hoje = LocalDate.now();
        if (hoje.isBefore(pesquisa.getDataInicio()) || hoje.isAfter(pesquisa.getDataFinal())) {
            return false;
        }

        // Cria a submissão
        PesquisaRespondida pesquisaRespondida = new PesquisaRespondida(pesquisa, respondente);

        // Monta as respostas
        respostasUsuario.forEach((perguntaId, texto) -> {
            if (perguntaId != null && texto != null && !texto.trim().isEmpty()) {

                perguntaRepository.findById(perguntaId).ifPresent(pergunta -> {
                    Resposta resposta = new Resposta(texto, pergunta, pesquisaRespondida);
                    pesquisaRespondida.getRespostas().add(resposta);
                });
            }
        });

        if (pesquisaRespondida.getRespostas().isEmpty()) {
            return false;
        }

        pesquisaRespondida.setRespondida(true);
        pesquisaRespondida.setHorarioResposta(LocalDateTime.now());

        pesquisaRespondidaRepository.save(pesquisaRespondida);
        return true;
    }

    // -----------------------------------------------------------------
    // Verificar se um respondente já respondeu uma pesquisa
    // -----------------------------------------------------------------
    public boolean respondenteJaRespondeu(Long pesquisaId, Long respondenteId) {
        if (pesquisaId == null || respondenteId == null) return false;

        Pesquisa p = pesquisaRepository.findById(pesquisaId).orElse(null);
        Respondente r = respondenteService.buscarPorId(respondenteId);

        if (p == null || r == null) return false;

        return pesquisaRespondidaRepository.findByPesquisaAndRespondente(p, r) != null;
    }

    // -----------------------------------------------------------------
    // Histórico de respostas de um Respondente
    // -----------------------------------------------------------------
    public List<PesquisaRespondida> listarHistoricoRespondente(Long respondenteId) {
        if (respondenteId == null) return List.of();

        Respondente respondente = respondenteService.buscarPorId(respondenteId);
        if (respondente == null) return List.of();

        return pesquisaRespondidaRepository.findByRespondente(respondente);
    }

    // -----------------------------------------------------------------
    // Listar todas submissões (PesquisaRespondida) de uma pesquisa
    // -----------------------------------------------------------------
    public List<PesquisaRespondida> listarTodasRespostasDaPesquisa(Long pesquisaId) {
        if (pesquisaId == null) return List.of();

        Pesquisa pesquisa = pesquisaRepository.findById(pesquisaId).orElse(null);
        if (pesquisa == null) return List.of();

        return pesquisaRespondidaRepository.findByPesquisa(pesquisa);
    }

    // -----------------------------------------------------------------
    // Contar total de submissões de uma pesquisa
    // -----------------------------------------------------------------
    public long contarTotalRespostas(Long pesquisaId) {
        if (pesquisaId == null) return 0L;

        Pesquisa pesquisa = pesquisaRepository.findById(pesquisaId).orElse(null);
        if (pesquisa == null) return 0L;

        return pesquisaRespondidaRepository.countByPesquisa(pesquisa);
    }
}