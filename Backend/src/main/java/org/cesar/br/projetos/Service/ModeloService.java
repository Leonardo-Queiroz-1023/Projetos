package org.cesar.br.projetos.Service;

import org.cesar.br.projetos.Entidades.Modelo;
import org.cesar.br.projetos.Entidades.Usuario;
import org.cesar.br.projetos.Repository.ModeloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ModeloService {

    private final ModeloRepository modeloRepository;

    @Autowired
    public ModeloService(ModeloRepository modeloRepository) {
        this.modeloRepository = modeloRepository;
    }

    // ---------------------------------------------------------------------
    // CREATE - Lógica de negócio: criar modelo
    // ---------------------------------------------------------------------
    public Modelo criarModelo(String nome, String descricao, Usuario usuario) {

        // Validação: nome obrigatório
        if (nome == null || nome.trim().isEmpty()) {
            return null;
        }

        // Validação: descrição obrigatória
        if (descricao == null || descricao.trim().isEmpty()) {
            return null;
        }

        // Validação: usuário obrigatório
        if (usuario == null) {
            return null;
        }

        // Criação do modelo (id é gerado pelo banco via @GeneratedValue)
        Modelo modelo = new Modelo(nome, descricao, usuario);

        // Persistência
        return modeloRepository.save(modelo);
    }

    // ---------------------------------------------------------------------
    // READ - Lógica de negócio: listar modelos de um usuário
    // ---------------------------------------------------------------------
    public List<Modelo> listarModelos(Usuario usuario) {
        if (usuario == null) {
            return List.of();
        }
        // assume que o repositório tem o método findByUsuario(Usuario usuario)
        return modeloRepository.findByUsuario(usuario);
    }

    // ---------------------------------------------------------------------
    // READ - Lógica de negócio: buscar modelo por ID (apenas do usuário)
    // ---------------------------------------------------------------------
    public Modelo buscarModeloPorId(Long id, Usuario usuario) {
        if (id == null || usuario == null) {
            return null;
        }
        // assume que o repositório tem findByIdAndUsuario(Long id, Usuario usuario)
        return modeloRepository.findByIdAndUsuario(id, usuario).orElse(null);
    }

    // ---------------------------------------------------------------------
    // UPDATE - Lógica de negócio: atualizar modelo (apenas do usuário)
    // ---------------------------------------------------------------------
    public boolean atualizarModelo(Long id,
                                   String nome,
                                   String descricao,
                                   Usuario usuario) {

        // Validação: ID e usuário obrigatórios
        if (id == null || usuario == null) {
            return false;
        }

        // Busca o modelo existente (apenas do usuário dono)
        Modelo existente = modeloRepository.findByIdAndUsuario(id, usuario).orElse(null);
        if (existente == null) {
            return false;
        }

        // Atualiza apenas campos não nulos e não vazios
        if (nome != null && !nome.trim().isEmpty()) {
            existente.setNome(nome);
        }
        if (descricao != null && !descricao.trim().isEmpty()) {
            existente.setDescricao(descricao);
        }

        // Persistência da atualização
        modeloRepository.save(existente);
        return true;
    }

    // ---------------------------------------------------------------------
    // DELETE - Lógica de negócio: deletar modelo (apenas do usuário)
    // ---------------------------------------------------------------------
    public boolean deletarModelo(Long id, Usuario usuario) {

        // Validação: ID e usuário obrigatórios
        if (id == null || usuario == null) {
            return false;
        }

        // Verifica se o modelo existe e pertence ao usuário
        Modelo modelo = modeloRepository.findByIdAndUsuario(id, usuario).orElse(null);
        if (modelo == null) {
            return false;
        }

        // Deleção
        modeloRepository.delete(modelo);
        return true;
    }
}
