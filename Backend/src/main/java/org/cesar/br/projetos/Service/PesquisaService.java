package org.cesar.br.projetos.Service;

import org.cesar.br.projetos.Repository.*;
import org.cesar.br.projetos.Entidades.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class PesquisaService {

    private final PesquisaRepository pesquisaRepository;
    private final PesquisaRespondidaRepository pesquisaRespondidaRepository;
    private final ModeloRepository modeloRepository;
    private final UsuarioRepository usuarioRepository;
    private final PerguntaRepository perguntaRepository;

    @Autowired
    public PesquisaService(PesquisaRepository pesquisaRepository,
                           PesquisaRespondidaRepository pesquisaRespondidaRepository,
                           ModeloRepository modeloRepository,
                           UsuarioRepository usuarioRepository,
                           PerguntaRepository perguntaRepository) {
        this.pesquisaRepository = pesquisaRepository;
        this.pesquisaRespondidaRepository = pesquisaRespondidaRepository;
        this.modeloRepository = modeloRepository;
        this.usuarioRepository = usuarioRepository;
        this.perguntaRepository = perguntaRepository;
    }

    public Pesquisa criarPesquisa(String nome, UUID modeloId, LocalDate dataInicio, LocalDate dataFinal) {
        if (nome = null || modeloId == null || dataInicio == null || dataFinal == null || nome.trim().isEmpty()) return null;
        if (dataFinal.isBefore(dataInicio)) return null;

        Modelo modelo = modeloRepository.findById(modeloId).orElse(null);
        if (modelo == null) return null;

        Pesquisa pesquisa = new Pesquisa(nome, modelo, dataInicio, dataFinal);
        return pesquisaRepository.save(pesquisa);
    }

    public Pesquisa buscarPesquisaPorId(UUID id) {
        if (id == null) return null;
        return pesquisaRepository.findById(id).orElse(null);
    }

    public Pesquisa editarPesquisa(UUID id, string nome, LocalDate inicio, LocalDate fim) {
        Pesquisa p = buscarPesquisaPorId(id);
        if (p != null && inicio != null && fim != null && !fim.isBefore(inicio)) {
            p.setDataInicio(inicio);
            p.setDataFinal(fim);
            if (nome != null && !nome.trim().isEmpty()) {
                p.setNome(nome);
            }
            return pesquisaRepository.save(p);
        }
        return null;
    }

    public boolean deletarPesquisa(UUID id) {
        if (id != null && pesquisaRepository.existsById(id)) {
            pesquisaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Pesquisa> listarPesquisasPorModelo(UUID modeloId) {
        Modelo modelo = modeloRepository.findById(modeloId).orElse(null);
        if (modelo == null) return List.of();
        return pesquisaRepository.findByModelo(modelo);
    }

    public List<Pesquisa> listarPesquisasAtivasHoje() {
        LocalDate hoje = LocalDate.now();
        return pesquisaRepository.findByDataBetween(hoje, hoje);
    }

    public List<Pesquisa> listarPesquisasPorDataInicio(LocalDate data) {
        return pesquisaRepository.findByDataInicio(data);
    }

    public List<Pesquisa> listarPesquisasPorDataFinal(LocalDate data) {
        return pesquisaRepository.findByDataFinal(data);
    }

    public boolean responderPesquisa(UUID pesquisaId, Long usuarioId, Map<UUID, String> respostasUsuario) {
        if (pesquisaId == null || usuarioId == null || respostasUsuario == null || respostasUsuario.isEmpty()) return false;

        Pesquisa pesquisa = pesquisaRepository.findById(pesquisaId).orElse(null);
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);

        if (pesquisa == null || usuario == null) return false;

        if (pesquisaRespondidaRepository.findByPesquisaAndUsuario(pesquisa, usuario) != null) {
            return false;
        }

        LocalDate hoje = LocalDate.now();
        if (hoje.isBefore(pesquisa.getDataInicio()) || hoje.isAfter(pesquisa.getDataFinal())) {
            return false;
        }

        PesquisaRespondida pesquisaRespondida = new PesquisaRespondida(pesquisa, usuario);

        respostasUsuario.forEach((perguntaId, texto) -> {
            if (texto != null) {
                perguntaRepository.findById(perguntaId).ifPresent(pergunta -> {

                    Resposta resposta = new Resposta(texto, pergunta, pesquisaRespondida);

                    pesquisaRespondida.getRespostas().add(resposta);
                });
            }
        });
        pesquisaRespondidaRepository.save(pesquisaRespondida);
        return true;
    }

    public boolean usuarioJaRespondeu(UUID pesquisaId, Long usuarioId) {
        Pesquisa p = pesquisaRepository.findById(pesquisaId).orElse(null);
        Usuario u = usuarioRepository.findById(usuarioId).orElse(null);

        if (p == null || u == null) return false;

        return pesquisaRespondidaRepository.findByPesquisaAndUsuario(p, u) != null;
    }

    public List<PesquisaRespondida> listarHistoricoUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
        if (usuario == null) return List.of();

        return pesquisaRespondidaRepository.findByUsuario(usuario);
    }

    public List<PesquisaRespondida> listarTodasRespostasDaPesquisa(UUID pesquisaId) {
        Pesquisa pesquisa = pesquisaRepository.findById(pesquisaId).orElse(null);
        if (pesquisa == null) return List.of();

        return pesquisaRespondidaRepository.findByPesquisa(pesquisa);
    }

    public long contarTotalRespostas(UUID pesquisaId) {
        Pesquisa pesquisa = pesquisaRepository.findById(pesquisaId).orElse(null);
        if (pesquisa == null) return 0;

        return pesquisaRespondidaRepository.countByPesquisa(pesquisa);
    }
}