package org.cesar.br.projetos.DTO;

public class UsuarioDTO {
    private String username;
    private String password;
    private String email;

    // getters e setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
