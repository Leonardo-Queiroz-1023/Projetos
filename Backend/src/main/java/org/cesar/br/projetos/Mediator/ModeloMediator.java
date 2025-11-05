package org.cesar.br.projetos.mediator;

import java.util.List;
import java.util.stream.Collectors;

import org.cesar.br.projetos.dao.ModeloDAO;
import org.cesar.br.projetos.dto.ModeloDTO;
import org.cesar.br.projetos.Entidades.Modelo;

public class ModeloMediator {

    private final ModeloDAO dao;

    public ModeloMediator() {
        this.dao = new ModeloDAO();
    }

    public void salvar(ModeloDTO dto) {
        Modelo modelo = dto.toEntity();
        dao.salvar(modelo);
    }

    public List<ModeloDTO> listarTodos() {
        return dao.listarTodos()
                .stream()
                .map(ModeloDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ModeloDTO buscarPorId(long id) {
        return dao.buscarPorId(id)
                .map(ModeloDTO::fromEntity)
                .orElse(null);
    }

    public void atualizar(ModeloDTO dto) {
        dao.atualizar(dto.toEntity());
    }

    public void deletar(long id) {
        dao.deletar(id);
    }
}
