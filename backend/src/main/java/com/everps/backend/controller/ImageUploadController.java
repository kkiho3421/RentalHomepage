package com.everps.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "http://localhost:5173")
public class ImageUploadController {

    private static final String UPLOAD_DIR
            = "uploads/products";

    @PostMapping("/product-image")
    public ResponseEntity<Map<String, String>> uploadProductImage(
            @RequestParam("image") MultipartFile image
    ) throws IOException {

        if (image.isEmpty()) {
            throw new RuntimeException(
                    "이미지 파일이 비어 있습니다."
            );
        }

        String contentType = image.getContentType();

        if (contentType == null
                || !contentType.startsWith("image/")) {

            throw new RuntimeException(
                    "이미지 파일만 업로드할 수 있습니다."
            );
        }

        String originalFilename
                = image.getOriginalFilename();

        String extension = "";

        if (originalFilename != null
                && originalFilename.contains(".")) {

            extension
                    = originalFilename.substring(
                            originalFilename.lastIndexOf(".")
                    );
        }

        String savedFilename
                = UUID.randomUUID() + extension;

        Path uploadPath
                = Paths.get(UPLOAD_DIR);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath
                = uploadPath.resolve(savedFilename);

        Files.copy(
                image.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        Map<String, String> response
                = new HashMap<>();

        response.put(
                "imageUrl",
                "/uploads/products/" + savedFilename
        );

        return ResponseEntity.ok(response);
    }
}
