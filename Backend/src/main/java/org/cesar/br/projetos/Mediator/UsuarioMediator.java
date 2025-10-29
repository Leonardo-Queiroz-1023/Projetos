package org.cesar.br.projetos.Mediator;

import org.cesar.br.projetos.Dao.UsuarioDAO;
import org.cesar.br.projetos.Entidades.Usuario;
import java.time.LocalDate;

public class UsuarioMediator {
	
	private static UsuarioDAO usuarioD;
	private static UsuarioMediator instancia; //não sei bem ainda a relação exata com o banco de dados
    // private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	// aparentemente precisa encriptografar a senha mas precisa decidir melhor como depois
	
	private UsuarioMediator() {}
	
	public static UsuarioMediator getInstancia() {
		if(instancia == null) {
			instancia = new UsuarioMediator();
			usuarioD = new UsuarioDAO();
		}
		return instancia;
	}
	
	public boolean registrarUsuario(String nome,String email, String senha, LocalDate dataCadastro) {
	    // Verifica se o usuário já existe
	    if (usuarioD.buscarUsuarioNome(nome) != null) {
	        return false; // usuário já cadastrado
	    }
	    Usuario usuario = new Usuario(nome, email, senha, dataCadastro);

	    // Salva usando o DAO
	    return usuarioD.salvarUsuario(usuario);    // falta verificação

	}
	
	public Usuario buscarUsuario(String nome) {
		// as validações ainda não foram adicionadas
		if(nome.trim().isEmpty() || nome == null) {
			return null;
		}
		return usuarioD.buscarUsuarioNome(nome);
	}

    public boolean autenticarSenha (String nome, String senha) {
        if(nome == null || nome.trim().isEmpty()) {
            return false;
        }

        Usuario usuario = usuarioD.buscarUsuarioNome(nome);

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
