package com.everps.backend.config;

import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origin}")
    private String allowedOrigin;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry
    ) {
        registry
                .addResourceHandler("/uploads/**")
                .addResourceLocations(
                        Paths.get(uploadDir)
                                .toAbsolutePath()
                                .toUri()
                                .toString()
                );
    }

    @Override
    public void addCorsMappings(
            CorsRegistry registry
    ) {
        registry
                .addMapping("/**")
                .allowedOrigins(
                        allowedOrigin
                )
                .allowedMethods(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}