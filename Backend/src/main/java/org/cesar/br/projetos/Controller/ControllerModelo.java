package org.cesar.br.projetos.Controller;

import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.PlataformasDeEnvios;
import org.cesar.br.projetos.Mediator.ModeloMediator;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/modelos")
public class ControllerModelo {

    private final ModeloMediator mediator = ModeloMediator.getInstancia();

    @PostMapping("/criar")
    public ResponseEntity<?> criar(@RequestBody Modelo modelo) {

        boolean criado = mediator.criarModelo(
                modelo.getId(),
                modelo.getNome(),
                modelo.getDescricao(),
                modelo.getPlataformasDisponiveis()
        );

        if (criado) {
            return ResponseEntity.ok(Map.of("message", "Modelo criado com sucesso!"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Não foi possível criar o modelo."));
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Modelo>> listar() {
        return ResponseEntity.ok(mediator.listarModelos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable long id) {
        Modelo m = mediator.buscarModeloPorId(id);

        if (m != null)
            return ResponseEntity.ok(m);

        return ResponseEntity.status(404).body(Map.of("error", "Modelo não encontrado!"));
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable long id,
            @RequestBody Map<String, Object> body) {

        try {
            String nome = (String) body.get("nome");
            String descricao = (String) body.get("descricao");

            PlataformasDeEnvios plataforma = null;

            if (body.containsKey("plataformasDisponiveis") && body.get("plataformasDisponiveis") != null) {
                String plataformaStr = body.get("plataformasDisponiveis").toString().toUpperCase();
                plataforma = PlataformasDeEnvios.valueOf(plataformaStr);
            }

            boolean atualizado = mediator.atualizarModelo(id, nome, descricao, plataforma);

            if (atualizado)
                return ResponseEntity.ok(Map.of("message", "Modelo atualizado com sucesso!"));

            return ResponseEntity.badRequest().body(Map.of("error", "Falha ao atualizar modelo."));
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Plataforma inválida."));
        }
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<?> deletar(@PathVariable long id) {
        boolean removido = mediator.deletarModelo(id);

        if (removido)
            return ResponseEntity.ok(Map.of("message", "Modelo deletado com sucesso!"));

        return ResponseEntity.status(404).body(Map.of("error", "Modelo não encontrado!"));
    }
}
