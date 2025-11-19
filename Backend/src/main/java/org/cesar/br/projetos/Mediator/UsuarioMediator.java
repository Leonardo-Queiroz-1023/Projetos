package org.cesar.br.projetos.Mediator;

import org.cesar.br.projetos.Repository.UsuarioRepository;
import org.cesar.br.projetos.Entidades.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class UsuarioMediator {
	
	private static UsuarioRepository usuarioRepository;
	private static UsuarioMediator instancia;
    // private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	// aparentemente precisa encriptografar a senha mas precisa decidir melhor como depois

	@Autowired
	public UsuarioMediator(UsuarioRepository usuarioRepository) {
		UsuarioMediator.usuarioRepository = usuarioRepository;
	}
	
	public static UsuarioMediator getInstancia() {
		return instancia;
	}

	@Autowired
	public void setInstancia() {
		instancia = this;
	}
	
	public boolean registrarUsuario(String nome, String email, String senha, LocalDate dataCadastro) {
	    // Verifica se o usuário já existe
	    if (usuarioRepository.findByNome(nome).isPresent()) {
	        return false; // usuário já cadastrado
	    }
	    Usuario usuario = new Usuario(nome, email, senha, dataCadastro);

	    // Salva usando o Repository
	    usuarioRepository.save(usuario);
	    return true;
	}
	
	public Usuario buscarUsuario(String nome) {
		// as validações ainda não foram adicionadas
		if(nome == null || nome.trim().isEmpty()) {
			return null;
		}
		return usuarioRepository.findByNome(nome).orElse(null);
	}

    public boolean autenticarSenha (String nome, String senha) {
        if(nome == null || nome.trim().isEmpty()) {
            return false;
        }

        Usuario usuario = usuarioRepository.findByNome(nome).orElse(null);

        // CORREÇÃO 1: Verificar se o usuário foi encontrado
        if(usuario == null) {
            return false;
        }

        // CORREÇÃO 2: Comparar a SENHA armazenada com a senha digitada
        if(usuario.getSenha().equals(senha)) {
            return true; // Login bem-sucedido
        }

        return false; // Senhas não batem
    }
}
