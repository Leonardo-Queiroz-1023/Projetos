package org.cesar.br.projetos.Controller;

import org.cesar.br.projetos.Entidades.Pergunta;
import org.cesar.br.projetos.Service.PerguntaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/perguntas")
public class ControllerPergunta {

    private final PerguntaService perguntaService;

    @Autowired
    public ControllerPergunta(PerguntaService perguntaService) {
        this.perguntaService = perguntaService;
    }

    // ADICIONAR PERGUNTA
    @PostMapping("/adicionar/{modeloId}")
    public ResponseEntity<?> adicionarPergunta(
            @PathVariable Long modeloId,
            @RequestBody Map<String, String> body) {

        String questao = body.get("questao");

        boolean adicionada = perguntaService.adicionarPergunta(modeloId, questao);

        if (adicionada) {
            return ResponseEntity.ok(Map.of("message", "Pergunta adicionada com sucesso!"));
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Não foi possível adicionar a pergunta."));
    }

    // LISTAR PERGUNTAS
    @GetMapping("/listar/{modeloId}")
    public ResponseEntity<?> listarPerguntas(@PathVariable Long modeloId) {

        List<Pergunta> lista = perguntaService.listarPerguntas(modeloId);

        if (lista == null || lista.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "Modelo não encontrado ou sem perguntas."));
        }

        return ResponseEntity.ok(lista);
    }

    // ATUALIZAR PERGUNTA
    @PutMapping("/atualizar/{modeloId}/{perguntaId}")
    public ResponseEntity<?> atualizarPergunta(
            @PathVariable Long modeloId,
            @PathVariable Long perguntaId,
            @RequestBody Map<String, String> body) {

        String novoTexto = body.get("texto");

        boolean atualizado = perguntaService.atualizarPergunta(modeloId, perguntaId, novoTexto);

        if (atualizado) {
            return ResponseEntity.ok(Map.of("message", "Pergunta atualizada com sucesso!"));
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Falha ao atualizar pergunta."));
    }

    // REMOVER PERGUNTA
    @DeleteMapping("/remover/{modeloId}/{perguntaId}")
    public ResponseEntity<?> remover(
            @PathVariable Long modeloId,
            @PathVariable Long perguntaId) {

        boolean removido = perguntaService.removerPergunta(modeloId, perguntaId);

        if (removido) {
            return ResponseEntity.ok(Map.of("message", "Pergunta removida com sucesso!"));
        }

        return ResponseEntity.status(404).body(Map.of("error", "Pergunta ou modelo não encontrados."));
    }
}
