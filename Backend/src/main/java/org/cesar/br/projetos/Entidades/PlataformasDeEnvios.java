package org.cesar.br.projetos.Entidades;

public enum PlataformasDeEnvios {

    WHATSAPP(1, "WhatsApp"),
    EMAIL(2, "Email");

    private final int codigo;
    private final String plataforma;

    PlataformasDeEnvios(int codigo, String plataforma) {
        this.codigo = codigo;
        this.plataforma = plataforma;
    }

    public int getCodigo() {
        return codigo;
    }

    public String getPlataforma() {
        return plataforma;
    }
}
