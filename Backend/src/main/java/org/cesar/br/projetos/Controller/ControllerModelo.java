package org.cesar.br.projetos.Controller;

import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.Usuario;
import org.cesar.br.projetos.Service.ModeloService;
import org.cesar.br.projetos.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/modelos")
public class ControllerModelo {

    private final ModeloService modeloService;
    private final UsuarioService usuarioService;

    @Autowired
    public ControllerModelo(ModeloService modeloService, UsuarioService usuarioService) {
        this.modeloService = modeloService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/criar")
    public ResponseEntity<?> criar(@RequestBody Map<String, Object> body) {
        try {
            Long usuarioId = Long.valueOf(body.get("usuarioId").toString());
            Usuario usuario = usuarioService.buscarPorId(usuarioId);

            if (usuario == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Usuário não encontrado!"));
            }

            String nome = (String) body.get("nome");
            String descricao = (String) body.get("descricao");

            Modelo criado = modeloService.criarModelo(nome, descricao, usuario);

            if (criado != null) {
                return ResponseEntity.ok(Map.of(
                        "message", "Modelo criado com sucesso!",
                        "id", criado.getId()
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Não foi possível criar o modelo."
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Dados inválidos: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<?> listar(@RequestParam Long usuarioId) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId);

        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuário não encontrado!"));
        }

        return ResponseEntity.ok(modeloService.listarModelos(usuario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id, @RequestParam(required = false) Long usuarioId) {

        // --- BYPASS: SE FOR USUÁRIO 0 (RESPONDENTE) ---
        if (usuarioId == null || usuarioId == 0L) {
            Modelo m = modeloService.buscarModeloPeloIdSemValidacao(id);

            if (m != null) {
                // Converte para Map para evitar LazyInitializationException no PostgreSQL
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", m.getId());
                dto.put("nome", m.getNome());
                dto.put("descricao", m.getDescricao());
                dto.put("perguntas", m.getPerguntas().stream().map(p -> {
                    Map<String, Object> pDto = new HashMap<>();
                    pDto.put("id", p.getId());
                    pDto.put("questao", p.getQuestao());
                    return pDto;
                }).collect(Collectors.toList()));
                return ResponseEntity.ok(dto);
            } else {
                return ResponseEntity.status(404).body(Map.of("error", "Modelo público não encontrado!"));
            }
        }
        // --- FLUXO NORMAL: SE FOR ADMIN/DONO ---
        Usuario usuario = usuarioService.buscarPorId(usuarioId);

        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuário não encontrado!"));
        }

        Modelo m = modeloService.buscarModeloPorId(id, usuario);

        if (m != null) {
            return ResponseEntity.ok(m);
        }

        return ResponseEntity.status(404).body(Map.of(
                "error", "Modelo não encontrado ou sem permissão!"
        ));
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable Long id,
            @RequestParam Long usuarioId,
            @RequestBody Map<String, Object> body) {

        try {
            Usuario usuario = usuarioService.buscarPorId(usuarioId);

            if (usuario == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "error", "Usuário não encontrado!"
                ));
            }

            String nome = (String) body.get("nome");
            String descricao = (String) body.get("descricao");

            boolean atualizado = modeloService.atualizarModelo(id, nome, descricao, usuario);

            if (atualizado) {
                return ResponseEntity.ok(Map.of(
                        "message", "Modelo atualizado com sucesso!"
                ));
            }

            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Falha ao atualizar modelo ou sem permissão."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Dados inválidos: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id, @RequestParam Long usuarioId) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId);

        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", "Usuário não encontrado!"
            ));
        }

        boolean removido = modeloService.deletarModelo(id, usuario);

        if (removido) {
            return ResponseEntity.ok(Map.of(
                    "message", "Modelo deletado com sucesso!"
            ));
        }

        return ResponseEntity.status(404).body(Map.of(
                "error", "Modelo não encontrado ou sem permissão!"
        ));
    }
}
