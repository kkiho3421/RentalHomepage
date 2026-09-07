package com.everps.backend.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

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
                .csrf(csrf -> csrf
                    .csrfTokenRepository(
                            CookieCsrfTokenRepository.withHttpOnlyFalse()
                    )
                    .csrfTokenRequestHandler(
                            new CsrfTokenRequestAttributeHandler()
                    )
                    .ignoringRequestMatchers(
                            "/api/auth/login",
                            "/api/consultations"
                    )
                )
                .cors(cors -> {
                })
                .authorizeHttpRequests(auth -> auth
                // 로그인 API
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
                // 관리자 전용 API
                .requestMatchers(
                        "/api/admin/**",
                        "/api/consultations/**",
                        "/api/auth/password",
                        "/api/auth/logout"
                ).hasRole("ADMIN")
                // 상품 등록
                .requestMatchers(
                        HttpMethod.POST,
                        "/api/products/**"
                ).hasRole("ADMIN")
                // 상품 수정
                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/products/**"
                ).hasRole("ADMIN")
                // 상품 삭제
                .requestMatchers(
                        HttpMethod.DELETE,
                        "/api/products/**"
                ).hasRole("ADMIN")
                // 이미지 업로드
                .requestMatchers(
                        "/api/uploads/**"
                ).hasRole("ADMIN")
                // 나머지는 로그인 필요
                .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                .authenticationEntryPoint(
                        (request, response, authException) -> {
                            response.sendError(
                                    HttpServletResponse.SC_UNAUTHORIZED
                            );
                        }
                )
                )
                .formLogin(form
                        -> form.disable()
                );

        return http.build();
    }
}
