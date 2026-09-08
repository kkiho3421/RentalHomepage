package com.everps.backend.controller;

import com.everps.backend.dto.LoginRequest;
import com.everps.backend.dto.PasswordChangeRequest;

import com.everps.backend.entity.Admin;

import com.everps.backend.repository.AdminRepository;

import com.everps.backend.service.LoginAttemptService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginAttemptService loginAttemptService;

    public AuthController(
            AuthenticationManager authenticationManager,
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            LoginAttemptService loginAttemptService
    ) {
        this.authenticationManager = authenticationManager;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.loginAttemptService = loginAttemptService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {

        String clientIp = httpRequest.getRemoteAddr();

        if (loginAttemptService.isBlocked(clientIp)) {
            return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(
                            Map.of(
                                    "message",
                                    "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요."
                            )
                    );
        }

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getUsername(),
                                    request.getPassword()
                            )
                    );

            loginAttemptService.loginSucceeded(clientIp);

            SecurityContext context =
                    SecurityContextHolder.createEmptyContext();

            context.setAuthentication(authentication);

            SecurityContextHolder.setContext(context);

            httpRequest.getSession(true)
                    .setAttribute(
                            HttpSessionSecurityContextRepository
                                    .SPRING_SECURITY_CONTEXT_KEY,
                            context
                    );

            return ResponseEntity.ok(
                    Map.of(
                            "username",
                            authentication.getName(),
                            "authenticated",
                            true
                    )
            );

        } catch (AuthenticationException e) {

            loginAttemptService.loginFailed(clientIp);

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "message",
                                    "아이디 또는 비밀번호가 올바르지 않습니다."
                            )
                    );
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(
            Authentication authentication
    ) {
        if (authentication == null
                || !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "authenticated",
                                    false));
        }

        return ResponseEntity.ok(
                Map.of(
                        "username",
                        authentication.getName(),
                        "authenticated",
                        true));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletRequest request
    ) {
        if (request.getSession(false) != null) {
            request.getSession(false).invalidate();
        }

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "로그아웃되었습니다."));
    }

    @PatchMapping("/password")
    public void changePassword(
            @RequestBody PasswordChangeRequest request,
            Authentication authentication
    ) {
        if (authentication == null
                || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "로그인이 필요합니다."
            );
        }

        Admin admin = adminRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "관리자 정보를 찾을 수 없습니다."
        ));

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                admin.getPassword()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "현재 비밀번호가 일치하지 않습니다."
            );
        }

        if (request.getNewPassword() == null
                || request.getNewPassword().length() < 8) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "새 비밀번호는 8자 이상이어야 합니다."
            );
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                admin.getPassword()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "새 비밀번호는 현재 비밀번호와 달라야 합니다."
            );
        }

        admin.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        adminRepository.save(admin);
    }
}