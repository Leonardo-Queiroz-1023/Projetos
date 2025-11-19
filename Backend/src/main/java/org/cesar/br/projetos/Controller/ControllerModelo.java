package org.cesar.br.projetos.Controller;

import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.Perguntas;
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
        boolean criado = mediator.criarModelo(modelo);

        if (criado) {
            return ResponseEntity.ok(Map.of("message", "Modelo criado com sucesso!"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Não foi possível criar o modelo (verifique os dados)."));
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<Modelo>> listar() {
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

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<?> atualizarModelo(
            @PathVariable long id,
            @RequestBody Map<String, Object> body) {

        try {
            String nome = (String) body.get("nome");
            String descricao = (String) body.get("descricao");
            String pergunta = (String) body.get("pergunta");

            PlataformasDeEnvios plataforma = null;

            if (body.containsKey("plataformasDisponiveis") && body.get("plataformasDisponiveis") != null) {
                String plataformaStr = body.get("plataformasDisponiveis").toString().toUpperCase();
                plataforma = PlataformasDeEnvios.valueOf(plataformaStr);
            }

            boolean atualizado = mediator.atualizarModelo(
                    id,
                    nome,
                    descricao,
                    plataforma,
                    pergunta
            );

            if (atualizado) {
                return ResponseEntity.ok(Map.of("message", "Modelo atualizado com sucesso!"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Falha ao atualizar (modelo não encontrado ou dados inválidos)."));
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Valor de plataforma inválido."));
        }
    }
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<?> deletar(@PathVariable long id) {
        boolean deletado = mediator.deletarModelo(id);
        if (deletado) {
            return ResponseEntity.ok(Map.of("message", "Modelo deletado com sucesso!"));
        } else {
            return ResponseEntity.status(404).body(Map.of("error", "Modelo não encontrado!"));
        }
    }
}