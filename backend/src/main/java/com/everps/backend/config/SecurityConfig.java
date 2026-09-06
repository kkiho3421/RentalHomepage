package com.everps.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .authorizeHttpRequests(auth -> auth
                //로그인 API
                .requestMatchers(
                        "/api/auth/login"
                ).permitAll()
                // 상품 조회
                .requestMatchers(
                        HttpMethod.GET,
                        "/api/products",
                        "/api/products/**"
                ).permitAll()
                // 상담 신청
                .requestMatchers(
                        HttpMethod.POST,
                        "/api/consultations"
                ).permitAll()
                // 업로드된 이미지 조회
                .requestMatchers(
                        HttpMethod.GET,
                        "/uploads/**"
                ).permitAll()
                // 나머지는 로그인 필요
                .anyRequest().authenticated()
                )
                .formLogin(form
                        -> form.disable()
                );

        return http.build();
    }
}
