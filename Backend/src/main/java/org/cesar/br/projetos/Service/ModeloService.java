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

        if (nome == null || nome.trim().isEmpty()) {
            return null;
        }

        if (descricao == null || descricao.trim().isEmpty()) {
            return null;
        }

        if (usuario == null) {
            return null;
        }

        Modelo modelo = new Modelo(nome, descricao, usuario);

        return modeloRepository.save(modelo);
    }

    // ---------------------------------------------------------------------
    // READ - Lógica de negócio: listar modelos de um usuário
    // ---------------------------------------------------------------------
    public List<Modelo> listarModelos(Usuario usuario) {
        if (usuario == null) {
            return List.of();
        }
        return modeloRepository.findByUsuario(usuario);
    }

    // ---------------------------------------------------------------------
    // READ - Lógica de negócio: buscar modelo por ID (apenas do usuário)
    // ---------------------------------------------------------------------
    public Modelo buscarModeloPorId(Long id, Usuario usuario) {
        if (id == null || usuario == null) {
            return null;
        }
        return modeloRepository.findByIdAndUsuario(id, usuario).orElse(null);
    }

    // ---------------------------------------------------------------------
    // READ - Lógica de negócio: buscar modelo por ID (sem validar)
    // ---------------------------------------------------------------------
    public Modelo buscarModeloPeloIdSemValidacao(Long id) {
        if (id == null) {
            return null;
        }
        Modelo m = modeloRepository.findById(id).orElse(null);
        if (m != null) {
            m.getPerguntas().size();
        }
        return m;
    }

    // ---------------------------------------------------------------------
    // UPDATE - Lógica de negócio: atualizar modelo (apenas do usuário)
    // ---------------------------------------------------------------------
    public boolean atualizarModelo(Long id,
                                   String nome,
                                   String descricao,
                                   Usuario usuario) {

        if (id == null || usuario == null) {
            return false;
        }

        Modelo existente = modeloRepository.findByIdAndUsuario(id, usuario).orElse(null);
        if (existente == null) {
            return false;
        }

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

        if (id == null || usuario == null) {
            return false;
        }

        Modelo modelo = modeloRepository.findByIdAndUsuario(id, usuario).orElse(null);
        if (modelo == null) {
            return false;
        }

        modeloRepository.delete(modelo);
        return true;
    }
}
