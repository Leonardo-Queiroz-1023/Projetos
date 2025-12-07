package org.cesar.br.projetos.Service;

import org.cesar.br.projetos.Entidades.Usuario;
import org.cesar.br.projetos.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // ---------------------------------------------------------------------
    // CREATE - registrar usuário
    // ---------------------------------------------------------------------
    /**
     * Registra um novo usuário.
     *
     * @param nome        nome da pessoa usuária
     * @param email       email (único no sistema)
     * @param senhaEmTexto senha em texto plano (por enquanto; ideal é hashear)
     * @param isAdmin     se é admin ou não
     */
    public boolean registrarUsuario(String nome,
                                    String email,
                                    String senhaEmTexto,
                                    boolean isAdmin) {

        // Validação: campos obrigatórios
        if (nome == null || nome.trim().isEmpty()) {
            return false;
        }
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        if (senhaEmTexto == null || senhaEmTexto.trim().isEmpty()) {
            return false;
        }

        // Regra de negócio: email deve ser único
        if (usuarioRepository.findByEmail(email).isPresent()) {
            return false; // já existe usuário com esse email
        }

        // Aqui seria o ponto ideal para aplicar um hash de senha:
        // String hash = passwordEncoder.encode(senhaEmTexto);
        // Por enquanto, só jogamos a senha em texto dentro de senhaHash
        String senhaHash = senhaEmTexto;

        // Criação do usuário com o construtor novo
        Usuario usuario = new Usuario(nome, email, senhaHash, isAdmin);

        usuarioRepository.save(usuario);
        return true;
    }

    // ---------------------------------------------------------------------
    // READ - buscar usuário por email (forma principal de login)
    // ---------------------------------------------------------------------
    public Usuario buscarPorEmail(String email) {

        if (email == null || email.trim().isEmpty()) {
            return null;
        }

        return usuarioRepository.findByEmail(email).orElse(null);
    }

    // (Método de compatibilidade com o nome antigo, se você ainda usar em controller)
    public Usuario buscarUsuario(String email) {
        return buscarPorEmail(email);
    }

    // ---------------------------------------------------------------------
    // READ - buscar usuário por ID
    // ---------------------------------------------------------------------
    public Usuario buscarPorId(Long id) {

        if (id == null) {
            return null;
        }

        return usuarioRepository.findById(id).orElse(null);
    }

    // ---------------------------------------------------------------------
    // AUTENTICAÇÃO - validar credenciais
    // ---------------------------------------------------------------------
    /**
     * Autentica usando email + senha em texto.
     * Ideal: substituir depois por hash com PasswordEncoder.
     */
    public boolean autenticarUsuario(String email, String senhaEmTexto) {

        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        if (senhaEmTexto == null || senhaEmTexto.trim().isEmpty()) {
            return false;
        }

        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        if (usuario == null) {
            return false;
        }

        // TODO: substituir por passwordEncoder.matches(senhaEmTexto, usuario.getSenhaHash())
        return senhaEmTexto.equals(usuario.getSenhaHash());
    }

    // ---------------------------------------------------------------------
    // READ - listar todos os usuários
    // ---------------------------------------------------------------------
    public List<Usuario> listarTodosUsuarios() {
        return usuarioRepository.findAll();
    }

    // ---------------------------------------------------------------------
    // UPDATE - atualizar dados do usuário
    // ---------------------------------------------------------------------
    public boolean atualizarUsuario(Long id,
                                    String nome,
                                    String email,
                                    String novaSenhaEmTexto,
                                    Boolean isAdmin) {

        if (id == null) {
            return false;
        }

        Usuario existente = usuarioRepository.findById(id).orElse(null);
        if (existente == null) {
            return false;
        }

        if (nome != null && !nome.trim().isEmpty()) {
            existente.setNome(nome);
        }

        if (email != null && !email.trim().isEmpty()) {
            // se o email for alterado, convém checar se já não existe outro usuário com esse email
            // aqui estou sendo simplista; em produção seria legal tratar colisão
            existente.setEmail(email);
        }

        if (novaSenhaEmTexto != null && !novaSenhaEmTexto.trim().isEmpty()) {
            // ideal: aplicar hash
            existente.setSenhaHash(novaSenhaEmTexto);
        }

        if (isAdmin != null) {
            existente.setIsAdmin(isAdmin);
        }

        usuarioRepository.save(existente);
        return true;
    }

    // ---------------------------------------------------------------------
    // DELETE - deletar usuário
    // ---------------------------------------------------------------------
    public boolean deletarUsuario(Long id) {

        if (id == null) {
            return false;
        }

        if (!usuarioRepository.existsById(id)) {
            return false;
        }

        usuarioRepository.deleteById(id);
        return true;
    }
}
