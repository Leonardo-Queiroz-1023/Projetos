package org.cesar.br.projetos.Controller;

import org.cesar.br.projetos.Entidades.Pergunta;
import org.cesar.br.projetos.Service.PerguntaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/perguntas")
public class ControllerPergunta {

    private final PerguntaService perguntaService;

    @Autowired
    public ControllerPergunta(PerguntaService perguntaService) {
        this.perguntaService = perguntaService;
    }

    // ---------------------------------------------------------
    // ADICIONAR PERGUNTA
    // ---------------------------------------------------------
    @PostMapping("/adicionar/{modeloId}")
    public ResponseEntity<?> adicionarPergunta(
            @PathVariable UUID modeloId,
            @RequestBody Map<String, String> body) {

        String questao = body.get("questao");
        Pergunta novaPergunta = new Pergunta(questao);
        
        boolean adicionada = perguntaService.adicionarPergunta(modeloId, novaPergunta);

        if (adicionada)
            return ResponseEntity.ok(Map.of("message", "Pergunta adicionada com sucesso!"));

        return ResponseEntity.badRequest().body(Map.of("error", "Não foi possível adicionar a pergunta."));
    }

    // ---------------------------------------------------------
    // LISTAR PERGUNTAS
    // ---------------------------------------------------------
    @GetMapping("/listar/{modeloId}")
    public ResponseEntity<?> listarPerguntas(@PathVariable UUID modeloId) {

        List<Pergunta> lista = perguntaService.listarPerguntas(modeloId);

        if (lista == null)
            return ResponseEntity.status(404).body(Map.of("error", "Modelo não encontrado."));

        return ResponseEntity.ok(lista);
    }

    // ---------------------------------------------------------
    // ATUALIZAR PERGUNTA
    // ---------------------------------------------------------
    @PutMapping("/atualizar/{modeloId}/{perguntaId}")
    public ResponseEntity<?> atualizarPergunta(
            @PathVariable UUID modeloId,
            @PathVariable UUID perguntaId,
            @RequestBody Map<String, String> body) {

        String novoTexto = body.get("texto");

        boolean atualizado = perguntaService.atualizarPergunta(modeloId, perguntaId, novoTexto);

        if (atualizado)
            return ResponseEntity.ok(Map.of("message", "Pergunta atualizada com sucesso!"));

        return ResponseEntity.badRequest().body(Map.of("error", "Falha ao atualizar pergunta."));
    }

    // ---------------------------------------------------------
    // REMOVER PERGUNTA
    // ---------------------------------------------------------
    @DeleteMapping("/remover/{modeloId}/{perguntaId}")
    public ResponseEntity<?> remover(
            @PathVariable UUID modeloId,
            @PathVariable UUID perguntaId) {

        boolean removido = perguntaService.removerPergunta(modeloId, perguntaId);

        if (removido)
            return ResponseEntity.ok(Map.of("message", "Pergunta removida com sucesso!"));

        return ResponseEntity.status(404).body(Map.of("error", "Pergunta ou modelo não encontrados."));
    }
}
