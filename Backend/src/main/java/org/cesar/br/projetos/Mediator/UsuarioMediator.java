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
	
	public boolean registrarUsuario(String username,String email, String password, LocalDate date) {
	    // Verifica se o usuário já existe
	    if (usuarioD.buscarUsuarioNome(username) != null) {
	        return false; // usuário já cadastrado
	    }
	    Usuario usuario = new Usuario(username, email, password, date);

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
	
	public boolean autenticar (String nome, String senha) { // sistema de senhas
		if(nome == null || nome.trim().isEmpty() || nome.trim().equals(nome) == false) {
			return false;
		}
		
		Usuario usuario = usuarioD.buscarUsuarioNome(nome);
		
		if(usuario.getNome().equals(senha) == false) {
			return false;
		}
		
		return true;
	}
}
