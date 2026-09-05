package com.everps.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.everps.backend.dto.ConsultationRequest;
import com.everps.backend.entity.Consultation;
import com.everps.backend.repository.ConsultationRepository;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "http://localhost:5173")
public class ConsultationController {

    private final ConsultationRepository consultationRepository;

    public ConsultationController(
            ConsultationRepository consultationRepository
    ) {
        this.consultationRepository = consultationRepository;
    }

    @PostMapping
    public Consultation createConsultation(
            @RequestBody ConsultationRequest request
    ) {
        Consultation consultation = new Consultation();

        consultation.setName(request.getName());
        consultation.setPhone(request.getPhone());
        consultation.setCompany(request.getCompany());
        consultation.setEmail(request.getEmail());
        consultation.setMessage(request.getMessage());
        consultation.setProductId(request.getProductId());

        return consultationRepository.save(consultation);
    }

    @GetMapping
    public List<Consultation> getConsultations() {
        return consultationRepository.findAllByOrderByCreatedAtDesc();
    }

    @PatchMapping("/{id}/status")
    public Consultation updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("상담 정보를 찾을 수 없습니다."));

        consultation.setStatus(status);

        return consultationRepository.save(consultation);
    }

    @DeleteMapping("/{id}")
    public void deleteConsultation(@PathVariable Long id) {
        Consultation consultation = consultationRepository.findById(id)
                .orElseThrow(()
                        -> new RuntimeException("상담 정보를 찾을 수 없습니다.")
                );

        consultationRepository.delete(consultation);
    }
}
