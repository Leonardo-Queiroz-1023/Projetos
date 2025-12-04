package org.cesar.br.projetos.Controller;

import org.cesar.br.projetos.Entidades.Pesquisa;
import org.cesar.br.projetos.Entidades.PesquisaRespondida;
import org.cesar.br.projetos.Service.PesquisaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/pesquisas")
public class ControllerPesquisa {

    private final PesquisaService pesquisaService;

    @Autowired
    public ControllerPesquisa(PesquisaService pesquisaService) {
        this.pesquisaService = pesquisaService;
    }

    // ---------------------------------------------------------
    // 1. CRIAR PESQUISA
    // Service: criarPesquisa
    // ---------------------------------------------------------
    @PostMapping("/criar")
    public ResponseEntity<?> criar(@RequestBody Map<String, Object> body) {
        try {
            String nome = (String) body.get("nome");
            String modeloIdStr = (String) body.get("modeloId");
            String dataInicioStr = (String) body.get("dataInicio");
            String dataFinalStr = (String) body.get("dataFinal");

            if (modeloIdStr == null || dataInicioStr == null || dataFinalStr == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Dados obrigatórios faltando."));
            }

            UUID modeloId = UUID.fromString(modeloIdStr);
            LocalDate dataInicio = LocalDate.parse(dataInicioStr);
            LocalDate dataFinal = LocalDate.parse(dataFinalStr);

            Pesquisa criada = pesquisaService.criarPesquisa(nome, modeloId, dataInicio, dataFinal);

            if (criada != null) {
                return ResponseEntity.ok(Map.of(
                        "message", "Pesquisa criada com sucesso!",
                        "id", criada.getId().toString()
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Não foi possível criar a pesquisa."));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados inválidos: " + e.getMessage()));
        }
    }

    // ---------------------------------------------------------
    // 2. BUSCAR PESQUISA POR ID
    // Service: buscarPesquisaPorId
    // ---------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable UUID id) {
        Pesquisa p = pesquisaService.buscarPesquisaPorId(id);

        if (p != null) {
            return ResponseEntity.ok(p);
        }
        return ResponseEntity.status(404).body(Map.of("error", "Pesquisa não encontrada."));
    }

    // ---------------------------------------------------------
    // 3. EDITAR PESQUISA
    // Service: editarPesquisa
    // ---------------------------------------------------------
    @PutMapping("/atualizar/{id}")
    public ResponseEntity<?> editar(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> body) {
        try {
            String nome = (String) body.get("nome");
            String dataInicioStr = (String) body.get("dataInicio");
            String dataFinalStr = (String) body.get("dataFinal");

            LocalDate inicio = (dataInicioStr != null) ? LocalDate.parse(dataInicioStr) : null;
            LocalDate fim = (dataFinalStr != null) ? LocalDate.parse(dataFinalStr) : null;

            Pesquisa editada = pesquisaService.editarPesquisa(id, nome, inicio, fim);

            if (editada != null) {
                return ResponseEntity.ok(Map.of("message", "Pesquisa atualizada com sucesso!"));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Falha ao editar pesquisa."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Erro ao processar datas: " + e.getMessage()));
        }
    }

    // ---------------------------------------------------------
    // 4. DELETAR PESQUISA
    // Service: deletarPesquisa
    // ---------------------------------------------------------
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<?> deletar(@PathVariable UUID id) {
        boolean removido = pesquisaService.deletarPesquisa(id);

        if (removido) {
            return ResponseEntity.ok(Map.of("message", "Pesquisa deletada com sucesso!"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Pesquisa não encontrada."));
    }

    // ---------------------------------------------------------
    // 5. LISTAR POR MODELO
    // Service: listarPesquisasPorModelo
    // ---------------------------------------------------------
    @GetMapping("/listar/modelo/{modeloId}")
    public ResponseEntity<?> listarPorModelo(@PathVariable UUID modeloId) {
        List<Pesquisa> lista = pesquisaService.listarPesquisasPorModelo(modeloId);
        return ResponseEntity.ok(lista);
    }

    // ---------------------------------------------------------
    // 6. LISTAR ATIVAS HOJE
    // Service: listarPesquisasAtivasHoje
    // ---------------------------------------------------------
    @GetMapping("/listar/ativas")
    public ResponseEntity<?> listarAtivas() {
        return ResponseEntity.ok(pesquisaService.listarPesquisasAtivasHoje());
    }

    // ---------------------------------------------------------
    // 7. LISTAR POR DATA INICIO
    // Service: listarPesquisasPorDataInicio
    // ---------------------------------------------------------
    @GetMapping("/listar/data-inicio")
    public ResponseEntity<?> listarPorDataInicio(@RequestParam String data) {
        try {
            LocalDate date = LocalDate.parse(data);
            return ResponseEntity.ok(pesquisaService.listarPesquisasPorDataInicio(date));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Formato de data inválido. Use YYYY-MM-DD."));
        }
    }

    // ---------------------------------------------------------
    // 8. LISTAR POR DATA FINAL
    // Service: listarPesquisasPorDataFinal
    // ---------------------------------------------------------
    @GetMapping("/listar/data-final")
    public ResponseEntity<?> listarPorDataFinal(@RequestParam String data) {
        try {
            LocalDate date = LocalDate.parse(data);
            return ResponseEntity.ok(pesquisaService.listarPesquisasPorDataFinal(date));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Formato de data inválido. Use YYYY-MM-DD."));
        }
    }

    // ---------------------------------------------------------
    // 9. RESPONDER PESQUISA
    // Service: responderPesquisa
    // ---------------------------------------------------------
    @PostMapping("/responder/{pesquisaId}")
    public ResponseEntity<?> responder(
            @PathVariable UUID pesquisaId,
            @RequestBody Map<String, Object> body) {
        try {
            // Conversão segura do ID do usuário
            Object usuarioIdObj = body.get("usuarioId");
            if (usuarioIdObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "ID do usuário obrigatório."));
            }
            Long usuarioId = Long.valueOf(usuarioIdObj.toString());

            // Tratamento do Map de respostas (Chave String -> UUID)
            Map<String, String> respostasRaw = (Map<String, String>) body.get("respostas");

            if (respostasRaw == null || respostasRaw.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Nenhuma resposta enviada."));
            }

            Map<UUID, String> respostasConvertidas = new HashMap<>();
            for (Map.Entry<String, String> entry : respostasRaw.entrySet()) {
                respostasConvertidas.put(UUID.fromString(entry.getKey()), entry.getValue());
            }

            boolean sucesso = pesquisaService.responderPesquisa(pesquisaId, usuarioId, respostasConvertidas);

            if (sucesso) {
                return ResponseEntity.ok(Map.of("message", "Pesquisa respondida com sucesso!"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Falha ao responder. Verifique se o usuário já respondeu ou se a pesquisa está fora do prazo."));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados inválidos: " + e.getMessage()));
        }
    }

    // ---------------------------------------------------------
    // 10. USUÁRIO JÁ RESPONDEU?
    // Service: usuarioJaRespondeu
    // ---------------------------------------------------------
    @GetMapping("/verificar-resposta")
    public ResponseEntity<?> usuarioJaRespondeu(
            @RequestParam UUID pesquisaId,
            @RequestParam Long usuarioId) {

        boolean jaRespondeu = pesquisaService.usuarioJaRespondeu(pesquisaId, usuarioId);
        return ResponseEntity.ok(Map.of("respondeu", jaRespondeu));
    }

    // ---------------------------------------------------------
    // 11. LISTAR HISTÓRICO DO USUÁRIO
    // Service: listarHistoricoUsuario
    // ---------------------------------------------------------
    @GetMapping("/historico/{usuarioId}")
    public ResponseEntity<?> listarHistorico(@PathVariable Long usuarioId) {
        List<PesquisaRespondida> historico = pesquisaService.listarHistoricoUsuario(usuarioId);
        return ResponseEntity.ok(historico);
    }

    // ---------------------------------------------------------
    // 12. LISTAR TODAS RESPOSTAS DA PESQUISA
    // Service: listarTodasRespostasDaPesquisa
    // ---------------------------------------------------------
    @GetMapping("/listar-respostas/{pesquisaId}")
    public ResponseEntity<?> listarRespostasDaPesquisa(@PathVariable UUID pesquisaId) {
        List<PesquisaRespondida> lista = pesquisaService.listarTodasRespostasDaPesquisa(pesquisaId);
        return ResponseEntity.ok(lista);
    }

    // ---------------------------------------------------------
    // 13. CONTAR TOTAL DE RESPOSTAS
    // Service: contarTotalRespostas
    // ---------------------------------------------------------
    @GetMapping("/contar-respostas/{pesquisaId}")
    public ResponseEntity<?> contarRespostas(@PathVariable UUID pesquisaId) {
        long total = pesquisaService.contarTotalRespostas(pesquisaId);
        return ResponseEntity.ok(Map.of("total", total));
    }
}