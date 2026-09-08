package com.everps.backend.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final int BLOCK_MINUTES = 10;

    private final Map<String, AttemptInfo> attempts =
            new ConcurrentHashMap<>();

    public boolean isBlocked(String key) {
        AttemptInfo info = attempts.get(key);

        if (info == null) {
            return false;
        }

        if (info.blockedUntil == null) {
            return false;
        }

        if (LocalDateTime.now().isAfter(info.blockedUntil)) {
            attempts.remove(key);
            return false;
        }

        return true;
    }

    public void loginFailed(String key) {
        AttemptInfo info = attempts.getOrDefault(
                key,
                new AttemptInfo()
        );

        info.count++;

        if (info.count >= MAX_ATTEMPTS) {
            info.blockedUntil =
                    LocalDateTime.now()
                            .plusMinutes(BLOCK_MINUTES);
        }

        attempts.put(key, info);
    }

    public void loginSucceeded(String key) {
        attempts.remove(key);
    }

    private static class AttemptInfo {
        private int count = 0;
        private LocalDateTime blockedUntil;
    }
}