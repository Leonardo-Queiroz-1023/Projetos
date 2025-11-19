package org.cesar.br.projetos.Controller;

import org.cesar.br.projetos.Entidades.Pergunta;
import org.cesar.br.projetos.Mediator.PerguntasMediator;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/perguntas")
public class ControllerPerguntas {

    private final PerguntasMediator mediator = PerguntasMediator.getInstancia();

    // ---------------------------------------------------------
    // ADICIONAR PERGUNTA
    // ---------------------------------------------------------
    @PostMapping("/adicionar/{modeloId}")
    public ResponseEntity<?> adicionarPergunta(
            @PathVariable long modeloId,
            @RequestBody Pergunta pergunta) {

        boolean adicionada = mediator.adicionarPergunta(modeloId, pergunta);

        if (adicionada)
            return ResponseEntity.ok(Map.of("message", "Pergunta adicionada com sucesso!"));

        return ResponseEntity.badRequest().body(Map.of("error", "Não foi possível adicionar a pergunta."));
    }

    // ---------------------------------------------------------
    // LISTAR PERGUNTAS
    // ---------------------------------------------------------
    @GetMapping("/listar/{modeloId}")
    public ResponseEntity<?> listarPerguntas(@PathVariable long modeloId) {

        List<Pergunta> lista = mediator.listarPerguntas(modeloId);

        if (lista == null)
            return ResponseEntity.status(404).body(Map.of("error", "Modelo não encontrado."));

        return ResponseEntity.ok(lista);
    }

    // ---------------------------------------------------------
    // ATUALIZAR PERGUNTA
    // ---------------------------------------------------------
    @PutMapping("/atualizar/{modeloId}/{perguntaId}")
    public ResponseEntity<?> atualizarPergunta(
            @PathVariable long modeloId,
            @PathVariable long perguntaId,
            @RequestBody Map<String, String> body) {

        String novoTexto = body.get("texto");

        boolean atualizado = mediator.atualizarPergunta(modeloId, perguntaId, novoTexto);

        if (atualizado)
            return ResponseEntity.ok(Map.of("message", "Pergunta atualizada com sucesso!"));

        return ResponseEntity.badRequest().body(Map.of("error", "Falha ao atualizar pergunta."));
    }

    // ---------------------------------------------------------
    // REMOVER PERGUNTA
    // ---------------------------------------------------------
    @DeleteMapping("/remover/{modeloId}/{perguntaId}")
    public ResponseEntity<?> remover(
            @PathVariable long modeloId,
            @PathVariable long perguntaId) {

        boolean removido = mediator.removerPergunta(modeloId, perguntaId);

        if (removido)
            return ResponseEntity.ok(Map.of("message", "Pergunta removida com sucesso!"));

        return ResponseEntity.status(404).body(Map.of("error", "Pergunta ou modelo não encontrados."));
    }
}
