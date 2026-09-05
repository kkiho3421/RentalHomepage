package com.everps.backend.controller;

import com.everps.backend.entity.Product;
import com.everps.backend.repository.ProductRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(
            ProductRepository productRepository
    ) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public Product getProduct(
            @PathVariable Long id
    ) {
        return productRepository.findById(id)
                .orElseThrow(()
                        -> new RuntimeException(
                        "상품을 찾을 수 없습니다."
                )
                );
    }
}
