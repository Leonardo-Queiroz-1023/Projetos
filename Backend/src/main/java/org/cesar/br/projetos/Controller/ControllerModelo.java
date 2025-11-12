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
public class ModeloController {

    private final ModeloMediator mediator = ModeloMediator.getInstancia();

    // ---------------------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------------------
    @PostMapping("/criar")
    public ResponseEntity<?> criar(@RequestBody Modelo modelo) {
        try {
            boolean criado = mediator.criarModelo(
                    modelo.getId(),
                    modelo.getNome(),
                    modelo.getDescricao(),
                    modelo.getPlataformasDisponiveis(),
                    modelo.getPergunta()
            );

            if (criado) {
                return ResponseEntity.ok(Map.of("message", "Modelo criado com sucesso!"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Não foi possível criar o modelo (verifique os dados ou ID duplicado)."));
            }

        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    // ---------------------------------------------------------------------
    // READ
    // ---------------------------------------------------------------------
    @GetMapping("/listar")
    public ResponseEntity<?> listar() {
        List<Modelo> modelos = mediator.listarModelos();
        return ResponseEntity.ok(modelos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable long id) {
        Modelo modelo = mediator.buscarModeloPorId(id);
        if (modelo != null) {
            return ResponseEntity.ok(modelo);
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Modelo não encontrado!"));
        }
    }

    // ---------------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------------
    @PutMapping("/atualizar/{id}")
    public ResponseEntity<?> atualizar(@PathVariable long id, @RequestBody Modelo modelo) {
        boolean atualizado = mediator.atualizarModelo(
                id,
                modelo.getNome(),
                modelo.getDescricao(),
                modelo.getPlataformasDisponiveis(),
                modelo.getPergunta()
        );

        if (atualizado) {
            return ResponseEntity.ok(Map.of("message", "Modelo atualizado com sucesso!"));
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Modelo não encontrado ou dados inválidos!"));
        }
    }

    // ---------------------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------------------
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<?> deletar(@PathVariable long id) {
        boolean deletado = mediator.deletarModelo(id);
        if (deletado) {
            return ResponseEntity.ok(Map.of("message", "Modelo deletado com sucesso!"));
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Modelo não encontrado!"));
        }
    }

    // ---------------------------------------------------------------------
    // TESTE
    // ---------------------------------------------------------------------
    @GetMapping("/teste")
    public String teste() {
        return "Endpoint de modelos funcionando!";
    }
}
