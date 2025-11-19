package org.cesar.br.projetos.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve arquivos estáticos do frontend (CSS, JS, imagens)
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/");

        registry.addResourceHandler("/Estampa.jpg")
                .addResourceLocations("classpath:/static/");

        // Todas as outras rotas não-API devem retornar index.html (SPA routing)
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        
                        // Se o recurso existe, retorna ele
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        
                        // Caso contrário, retorna index.html para SPA routing
                        // Mas NÃO para rotas da API
                        if (!resourcePath.startsWith("auth/") && 
                            !resourcePath.startsWith("modelos/") && 
                            !resourcePath.startsWith("perguntas/") &&
                            !resourcePath.startsWith("h2-console")) {
                            return new ClassPathResource("/static/index.html");
                        }
                        
                        return null;
                    }
                });
    }
}
