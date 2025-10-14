package org.example.projetos.domain;

import java.time.LocalDateTime;
import java.util.List;
public class SessaoResposta {
    private Long id;
    private String varianteId;
    private String linkId;
    private String deviceInfo;
    private String canal; // WEB, EMAIL, WHATSAPP, APP
    private LocalDateTime visto;
    private LocalDateTime iniciado;
    private LocalDateTime finalizado;
    private List<Resposta> respostas;
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVarianteId() { return varianteId; }
    public void setVarianteId(String varianteId) { this.varianteId = varianteId; }

    public String getLinkId() { return linkId; }
    public void setLinkId(String linkId) { this.linkId = linkId; }

    public String getDeviceInfo() { return deviceInfo; }
    public void setDeviceInfo(String deviceInfo) { this.deviceInfo = deviceInfo; }

    public String getCanal() { return canal; }
    public void setCanal(String canal) { this.canal = canal; }

    public LocalDateTime getVisto() { return visto; }
    public void setVisto(LocalDateTime visto) { this.visto = visto; }

    public LocalDateTime getIniciado() { return iniciado; }
    public void setIniciado(LocalDateTime iniciado) { this.iniciado = iniciado; }

    public LocalDateTime getFinalizado() { return finalizado; }
    public void setFinalizado(LocalDateTime finalizado) { this.finalizado = finalizado; }

    public List<Resposta> getRespostas() { return respostas; }
    public void setRespostas(List<Resposta> respostas) { this.respostas = respostas; }
}
