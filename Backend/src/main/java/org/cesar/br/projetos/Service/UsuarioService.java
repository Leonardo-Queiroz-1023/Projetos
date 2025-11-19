package org.cesar.br.projetos.Service;

import org.cesar.br.projetos.Repository.UsuarioRepository;
import org.cesar.br.projetos.Entidades.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // ---------------------------------------------------------------------
    // CREATE - Lógica de negócio: registrar usuário
    // ---------------------------------------------------------------------
    public boolean registrarUsuario(String nome, String email, String senha, LocalDate dataCadastro) {

        // Validação: campos obrigatórios
        if (nome == null || nome.trim().isEmpty()) {
            return false;
        }
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        if (senha == null || senha.trim().isEmpty()) {
            return false;
        }

        // Regra de negócio: verifica se o usuário já existe
        if (usuarioRepository.findByNome(nome).isPresent()) {
            return false; // usuário já cadastrado
        }

        // Criação do usuário
        Usuario usuario = new Usuario(nome, email, senha, dataCadastro);

        // Persistência
        usuarioRepository.save(usuario);
        return true;
    }

    // ---------------------------------------------------------------------
    // READ - Lógica de negócio: buscar usuário por nome
    // ---------------------------------------------------------------------
    public Usuario buscarUsuario(String nome) {

        // Validação: nome obrigatório
        if (nome == null || nome.trim().isEmpty()) {
            return null;
        }

        // Busca no repositório
        return usuarioRepository.findByNome(nome).orElse(null);
    }

    // ---------------------------------------------------------------------
    // AUTENTICAÇÃO - Lógica de negócio: validar credenciais
    // ---------------------------------------------------------------------
    public boolean autenticarUsuario(String nome, String senha) {

        // Validação: campos obrigatórios
        if (nome == null || nome.trim().isEmpty()) {
            return false;
        }
        if (senha == null || senha.trim().isEmpty()) {
            return false;
        }

        // Busca o usuário
        Usuario usuario = usuarioRepository.findByNome(nome).orElse(null);

        // Verifica se o usuário foi encontrado
        if (usuario == null) {
            return false;
        }

        // return encoder.matches(senha, usuario.getSenha());

        // Validação temporária (senha em texto plano)
        return usuario.getSenha().equals(senha);
    }

    // ---------------------------------------------------------------------
    // READ - Lógica de negócio: listar todos os usuários (opcional)
    // ---------------------------------------------------------------------
    public java.util.List<Usuario> listarTodosUsuarios() {
        return usuarioRepository.findAll();
    }

    // ---------------------------------------------------------------------
    // UPDATE - Lógica de negócio: atualizar dados do usuário
    // ---------------------------------------------------------------------
    public boolean atualizarUsuario(Long id, String nome, String email, String senha) {

        // Validação: ID obrigatório
        if (id == null) {
            return false;
        }

        // Busca o usuário existente
        Usuario existente = usuarioRepository.findById(id).orElse(null);
        if (existente == null) {
            return false;
        }

        // Atualiza apenas campos não nulos
        if (nome != null && !nome.trim().isEmpty()) {
            existente.setNome(nome);
        }
        if (email != null && !email.trim().isEmpty()) {
            existente.setEmail(email);
        }
        if (senha != null && !senha.trim().isEmpty()) {
            existente.setSenha(senha);
        }

        // Persistência
        usuarioRepository.save(existente);
        return true;
    }

    // ---------------------------------------------------------------------
    // DELETE - Lógica de negócio: deletar usuário
    // ---------------------------------------------------------------------
    public boolean deletarUsuario(Long id) {

        // Validação: ID obrigatório
        if (id == null) {
            return false;
        }

        // Verifica se o usuário existe
        if (!usuarioRepository.existsById(id)) {
            return false;
        }

        // Deleção
        usuarioRepository.deleteById(id);
        return true;
    }
}
