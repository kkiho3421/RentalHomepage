package com.everps.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.everps.backend.entity.Consultation;

public interface ConsultationRepository
        extends JpaRepository<Consultation, Long> {
}