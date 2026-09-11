package com.everps.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/uploads")
public class ImageUploadController {

    private static final Set<String> ALLOWED_CONTENT_TYPES
            = Set.of(
                    "image/jpeg",
                    "image/png",
                    "image/webp"
            );

    @Value("${app.upload.dir}")
    private String uploadDir;

    @PostMapping("/product-image")
    public ResponseEntity<Map<String, String>> uploadProductImage(
            @RequestParam("image") MultipartFile image
    ) throws IOException {

        if (image.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이미지 파일이 비어 있습니다."
            );
        }

        String contentType = image.getContentType();

        if (contentType == null
                || !ALLOWED_CONTENT_TYPES.contains(contentType)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "JPG, PNG, WEBP 이미지 파일만 업로드할 수 있습니다."
            );
        }

        String extension;

        switch (contentType) {
            case "image/jpeg":
                extension = ".jpg";
                break;

            case "image/png":
                extension = ".png";
                break;

            case "image/webp":
                extension = ".webp";
                break;

            default:
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "지원하지 않는 이미지 형식입니다."
                );
        }

        String savedFilename
                = UUID.randomUUID() + extension;

        Path uploadPath = Paths.get(
                uploadDir,
                "products"
        );

        Files.createDirectories(uploadPath);

        Path filePath
                = uploadPath.resolve(savedFilename);

        Files.copy(
                image.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        return ResponseEntity.ok(
                Map.of(
                        "imageUrl",
                        "/uploads/products/" + savedFilename
                )
        );
    }
}