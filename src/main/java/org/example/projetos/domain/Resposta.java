package org.example.projetos.domain;

public class Resposta {
    private Long id;
    private String perguntaId;
    private String payload; // texto/valor/opções
    private double duracaoPergunta;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPerguntaId() { return perguntaId; }
    public void setPerguntaId(String perguntaId) { this.perguntaId = perguntaId; }

    public String getPayload() { return payload; }
    public void setPayload(String payload) { this.payload = payload; }

    public double getDuracaoPergunta() { return duracaoPergunta; }
    public void setDuracaoPergunta(double duracaoPergunta) { this.duracaoPergunta = duracaoPergunta; }
}
