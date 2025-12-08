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

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/pesquisas")
public class ControllerPesquisa {

    private final PesquisaService pesquisaService;

    @Autowired
    public ControllerPesquisa(PesquisaService pesquisaService) {
        this.pesquisaService = pesquisaService;
    }

    @PostMapping("/criar")
    public ResponseEntity<?> criar(@RequestBody Map<String, Object> body) {
        try {
            String nome = (String) body.get("nome");
            Object modeloIdObj = body.get("modeloId");
            String dataInicioStr = (String) body.get("dataInicio");
            String dataFinalStr = (String) body.get("dataFinal");

            if (modeloIdObj == null || dataInicioStr == null || dataFinalStr == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Dados obrigatórios faltando."));
            }

            Long modeloId = Long.valueOf(modeloIdObj.toString());
            LocalDate dataInicio = LocalDate.parse(dataInicioStr);
            LocalDate dataFinal = LocalDate.parse(dataFinalStr);

            Pesquisa criada = pesquisaService.criarPesquisa(nome, modeloId, dataInicio, dataFinal);

            if (criada != null) {
                return ResponseEntity.ok(Map.of(
                        "message", "Pesquisa criada com sucesso!",
                        "id", criada.getId()
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Não foi possível criar a pesquisa."));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados inválidos: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        Pesquisa p = pesquisaService.buscarPesquisaPorId(id);

        if (p != null) {
            return ResponseEntity.ok(p);
        }
        return ResponseEntity.status(404).body(Map.of("error", "Pesquisa não encontrada."));
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<?> editar(
            @PathVariable Long id,
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

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        boolean removido = pesquisaService.deletarPesquisa(id);

        if (removido) {
            return ResponseEntity.ok(Map.of("message", "Pesquisa deletada com sucesso!"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Pesquisa não encontrada."));
    }

    @GetMapping("/listar/modelo/{modeloId}")
    public ResponseEntity<?> listarPorModelo(@PathVariable Long modeloId) {
        List<Pesquisa> lista = pesquisaService.listarPesquisasPorModelo(modeloId);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/listar/ativas")
    public ResponseEntity<?> listarAtivas() {
        return ResponseEntity.ok(pesquisaService.listarPesquisasAtivasHoje());
    }

    @GetMapping("/listar/data-inicio")
    public ResponseEntity<?> listarPorDataInicio(@RequestParam String data) {
        try {
            LocalDate date = LocalDate.parse(data);
            return ResponseEntity.ok(pesquisaService.listarPesquisasPorDataInicio(date));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Formato de data inválido. Use YYYY-MM-DD."));
        }
    }

    @GetMapping("/listar/data-final")
    public ResponseEntity<?> listarPorDataFinal(@RequestParam String data) {
        try {
            LocalDate date = LocalDate.parse(data);
            return ResponseEntity.ok(pesquisaService.listarPesquisasPorDataFinal(date));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Formato de data inválido. Use YYYY-MM-DD."));
        }
    }

    @PostMapping("/responder/{pesquisaId}")
    public ResponseEntity<?> responder(
            @PathVariable Long pesquisaId,
            @RequestBody Map<String, Object> body) {
        try {
            Object respondenteIdObj = body.get("respondenteId");
            if (respondenteIdObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "ID do respondente obrigatório."));
            }
            Long respondenteId = Long.valueOf(respondenteIdObj.toString());

            Map<String, String> respostasRaw = (Map<String, String>) body.get("respostas");

            if (respostasRaw == null || respostasRaw.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Nenhuma resposta enviada."));
            }

            Map<Long, String> respostasConvertidas = new HashMap<>();
            for (Map.Entry<String, String> entry : respostasRaw.entrySet()) {
                respostasConvertidas.put(Long.valueOf(entry.getKey()), entry.getValue());
            }

            boolean sucesso = pesquisaService.responderPesquisa(pesquisaId, respondenteId, respostasConvertidas);

            if (sucesso) {
                return ResponseEntity.ok(Map.of("message", "Pesquisa respondida com sucesso!"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Falha ao responder. Verifique se o respondente já respondeu ou se a pesquisa está fora do prazo."));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados inválidos: " + e.getMessage()));
        }
    }

    @GetMapping("/verificar-resposta")
    public ResponseEntity<?> respondenteJaRespondeu(
            @RequestParam Long pesquisaId,
            @RequestParam Long respondenteId) {

        boolean jaRespondeu = pesquisaService.respondenteJaRespondeu(pesquisaId, respondenteId);
        return ResponseEntity.ok(Map.of("respondeu", jaRespondeu));
    }

    @GetMapping("/historico/{respondenteId}")
    public ResponseEntity<?> listarHistorico(@PathVariable Long respondenteId) {
        List<PesquisaRespondida> historico = pesquisaService.listarHistoricoRespondente(respondenteId);
        return ResponseEntity.ok(historico);
    }

    @GetMapping("/listar-respostas/{pesquisaId}")
    public ResponseEntity<?> listarRespostasDaPesquisa(@PathVariable Long pesquisaId) {
        List<PesquisaRespondida> lista = pesquisaService.listarTodasRespostasDaPesquisa(pesquisaId);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/contar-respostas/{pesquisaId}")
    public ResponseEntity<?> contarRespostas(@PathVariable Long pesquisaId) {
        long total = pesquisaService.contarTotalRespostas(pesquisaId);
        return ResponseEntity.ok(Map.of("total", total));
    }
}
