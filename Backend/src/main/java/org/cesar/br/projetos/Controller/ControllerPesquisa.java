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
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/pesquisas")
public class ControllerPesquisa {

    private final PesquisaService pesquisaService;

    @Autowired
    public ControllerPesquisa(PesquisaService pesquisaService) {
        this.pesquisaService = pesquisaService;
    }

    private Map<String, Object> converterParaMap(Pesquisa p) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        map.put("nome", p.getNome());
        map.put("dataInicio", p.getDataInicio());
        map.put("dataFinal", p.getDataFinal());

        try {
            long total = pesquisaService.contarTotalRespostas(p.getId());
            map.put("totalRespondentes", total);
        } catch (Exception e) {
            map.put("totalRespondentes", 0);
        }
        // ------------------------

        if (p.getModelo() != null) {
            map.put("modeloId", p.getModelo().getId());
            map.put("modeloNome", p.getModelo().getNome());
        } else {
            map.put("modeloId", null);
            map.put("modeloNome", "Sem Modelo");
        }

        return map;
    }

    @GetMapping("/listar/todas")
    public ResponseEntity<List<Map<String, Object>>> listarTodas() {
        List<Pesquisa> lista = pesquisaService.listarTodas();
        List<Map<String, Object>> resposta = lista.stream()
                .map(this::converterParaMap)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resposta);
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
            return ResponseEntity.ok(converterParaMap(p));
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
    public ResponseEntity<List<Map<String, Object>>> listarPorModelo(@PathVariable Long modeloId) {
        List<Pesquisa> lista = pesquisaService.listarPesquisasPorModelo(modeloId);
        List<Map<String, Object>> resposta = lista.stream()
                .map(this::converterParaMap)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/listar/ativas")
    public ResponseEntity<List<Map<String, Object>>> listarAtivas() {
        List<Pesquisa> lista = pesquisaService.listarPesquisasAtivasHoje();
        List<Map<String, Object>> resposta = lista.stream()
                .map(this::converterParaMap)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resposta);
    }

    @GetMapping("/listar/data-inicio")
    public ResponseEntity<?> listarPorDataInicio(@RequestParam String data) {
        try {
            LocalDate date = LocalDate.parse(data);
            List<Pesquisa> lista = pesquisaService.listarPesquisasPorDataInicio(date);
            List<Map<String, Object>> resposta = lista.stream()
                    .map(this::converterParaMap)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(resposta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Formato de data inválido. Use YYYY-MM-DD."));
        }
    }

    @GetMapping("/listar/data-final")
    public ResponseEntity<?> listarPorDataFinal(@RequestParam String data) {
        try {
            LocalDate date = LocalDate.parse(data);
            List<Pesquisa> lista = pesquisaService.listarPesquisasPorDataFinal(date);
            List<Map<String, Object>> resposta = lista.stream()
                    .map(this::converterParaMap)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(resposta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Formato de data inválido. Use YYYY-MM-DD."));
        }
    }

    @PostMapping("/responder/{pesquisaId}")
    public ResponseEntity<?> responder(
            @PathVariable Long pesquisaId,
            @RequestBody Map<String, Object> body) {
    
        try {
            // Validar respondenteId
            Object respIdObj = body.get("respondenteId");
            if (respIdObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "respondenteId ausente"));
            }
            Long respondenteId = Long.valueOf(respIdObj.toString());

            // Validar respostas
            Object respostasObj = body.get("respostas");
            if (!(respostasObj instanceof Map)) {
                return ResponseEntity.badRequest().body(Map.of("error", "respostas inválidas"));
            }

            Map<Long, String> respostasMap = new HashMap<>();
            ((Map<?, ?>) respostasObj).forEach((k, v) -> {
                respostasMap.put(Long.valueOf(k.toString()), v.toString());
            });

            boolean ok = pesquisaService.responderPesquisa(pesquisaId, respondenteId, respostasMap);
            
            if (ok) {
                return ResponseEntity.ok(Map.of("message", "Sucesso"));
            }
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Falha ao responder. Verifique se o respondente já respondeu ou se a pesquisa está fora do prazo."
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Erro interno: " + e.getMessage()));
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

    @PostMapping("/disparar")
    public ResponseEntity<?> dispararEmail(@RequestBody Map<String, Object> body) {
        try {
            Long pesquisaId = Long.valueOf(body.get("pesquisaId").toString());
            String nome = (String) body.get("nome");
            String email = (String) body.get("email");

            boolean enviado = pesquisaService.dispararLinkPorEmail(pesquisaId, nome, email);

            if (enviado) {
                return ResponseEntity.ok(Map.of("message", "E-mail enviado com sucesso!"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Erro ao processar dados. Verifique se a pesquisa existe."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Erro interno ao enviar e-mail: " + e.getMessage()));
        }
    }

}