package org.cesar.br.projetos.Dao;

import org.cesar.br.projetos.Entidades.Usuario;
import java.util.ArrayList;
import java.util.List;


public class UsuarioDAO {
	
	private static final List <Usuario> usuarios = new ArrayList<>();
	
	public boolean salvarUsuario (Usuario usuario) {
		if(usuario.getNome() == null) {
		usuarios.add(usuario); // método .add() do util List que adiciona a uma lista
		return true;
		}
		return false;
	}
	
	public Usuario buscarUsuarioNome (String nome) {
		for(Usuario user : usuarios) {
			if(user.getNome().equals(nome)) {
				return user;
			}
		}
		return null;
	}
	
	public List<Usuario> listar() { // não afetada por alterações externas
	    return new ArrayList<>(usuarios); // nova lista com os mesmos elementos
	}
}
