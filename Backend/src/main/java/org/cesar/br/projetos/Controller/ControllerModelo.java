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

    @PutMapping("/atualizar/nome/{id}")
    public ResponseEntity<?> atualizarNome(@PathVariable long id, @RequestBody Map<String, String> body) {
        String nome = body.get("nome");
        boolean atualizado = mediator.atualizarNome(id, nome);
        if (atualizado) {
            return ResponseEntity.ok(Map.of("message", "Nome atualizado com sucesso!"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Falha ao atualizar nome."));
        }
    }

    @PutMapping("/atualizar/descricao/{id}")
    public ResponseEntity<?> atualizarDescricao(@PathVariable long id, @RequestBody Map<String, String> body) {
        String descricao = body.get("descricao");
        boolean atualizado = mediator.atualizarDescricao(id, descricao);
        if (atualizado) {
            return ResponseEntity.ok(Map.of("message", "Descrição atualizada com sucesso!"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Falha ao atualizar descrição."));
        }
    }

    @PutMapping("/atualizar/plataforma/{id}")
    public ResponseEntity<?> atualizarPlataforma(@PathVariable long id, @RequestBody Map<String, String> body) {
        try {
            String plataformaStr = body.get("plataforma");
            if (plataformaStr == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "A chave 'plataforma' é obrigatória."));
            }
            PlataformasDeEnvios plataforma = PlataformasDeEnvios.valueOf(plataformaStr.toUpperCase());

            boolean atualizado = mediator.atualizarPlataforma(id, plataforma);
            if (atualizado) {
                return ResponseEntity.ok(Map.of("message", "Plataforma atualizada com sucesso!"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Falha ao atualizar plataforma (Modelo não encontrado)."));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Valor de plataforma inválido: " + body.get("plataforma")));
        } catch (NullPointerException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "A chave 'plataforma' é obrigatória."));
        }
    }

    @PutMapping("/atualizar/pergunta/{id}")
    public ResponseEntity<?> atualizarPergunta(@PathVariable long id, @RequestBody Perguntas pergunta) {

        if (pergunta == null || pergunta.getDescricao() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "JSON inválido. O objeto 'pergunta' e sua 'descricao' são obrigatórios."));
        }

        boolean atualizado = mediator.atualizarPergunta(
                id,
                pergunta,
                pergunta.getDescricao()
        );

        if (atualizado) {
            return ResponseEntity.ok(Map.of("message", "Pergunta atualizada com sucesso!"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Falha ao atualizar pergunta (verifique os IDs)."));
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