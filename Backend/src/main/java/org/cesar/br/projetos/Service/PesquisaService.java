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
    private final EmailService emailService;

    @Autowired
    public PesquisaService(PesquisaRepository pesquisaRepository,
                           PesquisaRespondidaRepository pesquisaRespondidaRepository,
                           ModeloRepository modeloRepository,
                           PerguntaRepository perguntaRepository,
                           RespondenteService respondenteService,
                           EmailService emailService) {
        this.pesquisaRepository = pesquisaRepository;
        this.pesquisaRespondidaRepository = pesquisaRespondidaRepository;
        this.modeloRepository = modeloRepository;
        this.perguntaRepository = perguntaRepository;
        this.respondenteService = respondenteService;
        this.emailService = emailService;
    }

    // -----------------------------------------------------------------
    // DISPARAR EMAIL
    // -----------------------------------------------------------------
    public boolean dispararLinkPorEmail(Long pesquisaId, String nome, String email) {
        Respondente respondente = respondenteService.criarOuAtualizarPorEmail(nome, null, email, false);
        Pesquisa pesquisa = buscarPesquisaPorId(pesquisaId);

        if (respondente == null || pesquisa == null) return false;

        String link = "https://projetos-1f39.onrender.com/responder/" + pesquisaId + "/" + respondente.getId();

        String assunto = "Convite para Pesquisa: " + pesquisa.getNome();
        String corpo = "Olá " + nome + ",\n\n" +
                "Gostaríamos de ouvir sua opinião sobre: " + pesquisa.getNome() + ".\n" +
                "Por favor, clique no link abaixo para responder à pesquisa:\n\n" +
                link + "\n\n" +
                "Obrigado!";

        emailService.enviarEmail(email, assunto, corpo);
        return true;
    }

    // -----------------------------------------------------------------
    // CRUD PESQUISA
    // -----------------------------------------------------------------
    public Pesquisa criarPesquisa(String nome, Long modeloId, LocalDate dataInicio, LocalDate dataFinal) {
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

    public Pesquisa buscarPesquisaPorId(Long id) {
        if (id == null) return null;
        return pesquisaRepository.findById(id).orElse(null);
    }

    public Pesquisa editarPesquisa(Long id, String nome, LocalDate inicio, LocalDate fim) {
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

    public boolean deletarPesquisa(Long id) {
        if (id == null) return false;
        if (!pesquisaRepository.existsById(id)) return false;

        pesquisaRepository.deleteById(id);
        return true;
    }

    // -----------------------------------------------------------------
    // LISTAGENS
    // -----------------------------------------------------------------
    public List<Pesquisa> listarPesquisasPorModelo(Long modeloId) {
        if (modeloId == null) return List.of();
        Modelo modelo = modeloRepository.findById(modeloId).orElse(null);
        if (modelo == null) return List.of();
        return pesquisaRepository.findByModelo(modelo);
    }

    public List<Pesquisa> listarTodas() {
        return pesquisaRepository.findAll();
    }

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
    public boolean responderPesquisa(Long pesquisaId, Long respondenteId, Map<Long, String> respostas) {
        System.out.println("=== INÍCIO responderPesquisa ===");
        System.out.println("pesquisaId: " + pesquisaId);
        System.out.println("respondenteId: " + respondenteId);
        System.out.println("respostas recebidas: " + respostas.size());

        // 1. Buscar pesquisa
        Pesquisa pesquisa = pesquisaRepository.findById(pesquisaId).orElse(null);
        if (pesquisa == null) {
            System.err.println("❌ Pesquisa não encontrada: " + pesquisaId);
            return false;
        }
        System.out.println("✅ Pesquisa encontrada: " + pesquisa.getNome());

        // 2. Verificar período
        LocalDate hoje = LocalDate.now();
        if (hoje.isBefore(pesquisa.getDataInicio()) || hoje.isAfter(pesquisa.getDataFinal())) {
            System.err.println("❌ Pesquisa fora do período. Início: " + pesquisa.getDataInicio() + ", Fim: " + pesquisa.getDataFinal() + ", Hoje: " + hoje);
            return false;
        }
        System.out.println("✅ Pesquisa dentro do período");

        // 3. Buscar respondente
        Respondente respondente = respondenteService.buscarPorId(respondenteId);
        if (respondente == null) {
            System.err.println("❌ Respondente não encontrado: " + respondenteId);
            return false;
        }
        System.out.println("✅ Respondente encontrado: " + respondente.getEmail());

        // 4. Verificar se já respondeu
        boolean jaRespondeu = pesquisaRespondidaRepository.existsByPesquisaIdAndRespondenteId(pesquisaId, respondenteId);
        if (jaRespondeu) {
            System.err.println("❌ Respondente já respondeu esta pesquisa");
            return false;
        }
        System.out.println("✅ Respondente ainda não respondeu");

        // 5. Salvar respostas
        try {
            PesquisaRespondida pr = new PesquisaRespondida();
            pr.setPesquisa(pesquisa);
            pr.setRespondente(respondente);
            pr.setDataResposta(LocalDateTime.now());
            pr.setRespostas(respostas);
            pesquisaRespondidaRepository.save(pr);
            System.out.println("✅ Respostas salvas com sucesso!");
            return true;
        } catch (Exception e) {
            System.err.println("❌ Erro ao salvar: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public boolean respondenteJaRespondeu(Long pesquisaId, Long respondenteId) {
        if (pesquisaId == null || respondenteId == null) return false;
        Pesquisa p = pesquisaRepository.findById(pesquisaId).orElse(null);
        Respondente r = respondenteService.buscarPorId(respondenteId);
        if (p == null || r == null) return false;

        long qtd = pesquisaRespondidaRepository.countByPesquisaAndRespondente(p, r);
        return qtd > 0;
    }

    public List<PesquisaRespondida> listarTodasRespostasDaPesquisa(Long pesquisaId) {
        if (pesquisaId == null) return List.of();
        Pesquisa pesquisa = pesquisaRepository.findById(pesquisaId).orElse(null);
        if (pesquisa == null) return List.of();
        return pesquisaRespondidaRepository.findByPesquisa(pesquisa);
    }

    public long contarTotalRespostas(Long pesquisaId) {
        if (pesquisaId == null) return 0L;
        Pesquisa pesquisa = pesquisaRepository.findById(pesquisaId).orElse(null);
        if (pesquisa == null) return 0L;
        return pesquisaRespondidaRepository.countByPesquisa(pesquisa);
    }

    public List<PesquisaRespondida> listarHistoricoRespondente(Long respondenteId) {
        if (respondenteId == null) return List.of();
        Respondente respondente = respondenteService.buscarPorId(respondenteId);
        if (respondente == null) return List.of();
        return pesquisaRespondidaRepository.findByRespondente(respondente);
    }
}