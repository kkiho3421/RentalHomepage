package com.everps.backend.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.everps.backend.entity.Admin;
import com.everps.backend.repository.AdminRepository;

@Service
public class AdminUserDetailsService
        implements UserDetailsService {

    private final AdminRepository adminRepository;

    public AdminUserDetailsService(
            AdminRepository adminRepository
    ) {
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(
            String username
    ) throws UsernameNotFoundException {

        Admin admin = adminRepository
                .findByUsername(username)
                .orElseThrow(()
                        -> new UsernameNotFoundException(
                        "관리자 계정을 찾을 수 없습니다."
                )
                );

        return User.builder()
                .username(admin.getUsername())
                .password(admin.getPassword())
                .roles(admin.getRole())
                .build();
    }
}
