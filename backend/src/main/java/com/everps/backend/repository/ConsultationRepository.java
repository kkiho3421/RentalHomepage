package com.everps.backend.repository;

import com.everps.backend.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultationRepository
        extends JpaRepository<Consultation, Long> {

    List<Consultation> findAllByOrderByCreatedAtDesc();
}
