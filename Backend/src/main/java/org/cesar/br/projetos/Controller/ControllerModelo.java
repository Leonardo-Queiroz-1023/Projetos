package org.cesar.br.projetos.Controller;

import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.PlataformasDeEnvios;
import org.cesar.br.projetos.Entidades.Usuario;
import org.cesar.br.projetos.Service.ModeloService;
import org.cesar.br.projetos.Service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

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
            String plataformaStr = (String) body.get("plataformasDisponiveis");
            
            PlataformasDeEnvios plataforma = null;
            if (plataformaStr != null) {
                plataforma = PlataformasDeEnvios.valueOf(plataformaStr.toUpperCase());
            }

            Modelo criado = modeloService.criarModelo(nome, descricao, plataforma, usuario);

            if (criado != null) {
                return ResponseEntity.ok(Map.of("message", "Modelo criado com sucesso!", "id", criado.getId().toString()));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Não foi possível criar o modelo."));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dados inválidos: " + e.getMessage()));
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
    public ResponseEntity<?> buscarPorId(@PathVariable UUID id, @RequestParam Long usuarioId) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuário não encontrado!"));
        }
        
        Modelo m = modeloService.buscarModeloPorId(id, usuario);

        if (m != null)
            return ResponseEntity.ok(m);

        return ResponseEntity.status(404).body(Map.of("error", "Modelo não encontrado ou sem permissão!"));
    }

    @PutMapping("/atualizar/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable UUID id,
            @RequestParam Long usuarioId,
            @RequestBody Map<String, Object> body) {

        try {
            Usuario usuario = usuarioService.buscarPorId(usuarioId);
            
            if (usuario == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Usuário não encontrado!"));
            }
            
            String nome = (String) body.get("nome");
            String descricao = (String) body.get("descricao");

            PlataformasDeEnvios plataforma = null;

            if (body.containsKey("plataformasDisponiveis") && body.get("plataformasDisponiveis") != null) {
                String plataformaStr = body.get("plataformasDisponiveis").toString().toUpperCase();
                plataforma = PlataformasDeEnvios.valueOf(plataformaStr);
            }

            boolean atualizado = modeloService.atualizarModelo(id, nome, descricao, plataforma, usuario);

            if (atualizado)
                return ResponseEntity.ok(Map.of("message", "Modelo atualizado com sucesso!"));

            return ResponseEntity.badRequest().body(Map.of("error", "Falha ao atualizar modelo ou sem permissão."));
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Plataforma inválida."));
        }
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<?> deletar(@PathVariable UUID id, @RequestParam Long usuarioId) {
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        
        if (usuario == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuário não encontrado!"));
        }
        
        boolean removido = modeloService.deletarModelo(id, usuario);

        if (removido)
            return ResponseEntity.ok(Map.of("message", "Modelo deletado com sucesso!"));

        return ResponseEntity.status(404).body(Map.of("error", "Modelo não encontrado ou sem permissão!"));
    }
}
