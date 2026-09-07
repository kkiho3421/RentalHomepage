package com.everps.backend.controller;

import com.everps.backend.entity.Product;
import com.everps.backend.repository.ProductRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(
            ProductRepository productRepository
    ) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> getProducts() {
        return productRepository.findByVisibleTrue();
    }

    @GetMapping("/{id}")
    public Product getProduct(
            @PathVariable Long id
    ) {
        return productRepository.findByIdAndVisibleTrue(id)
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "상품을 찾을 수 없습니다."
        ));
    }

    @PostMapping
    public Product createProduct(
            @RequestBody Product product
    ) {
        product.setId(null);

        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestBody Product request
    ) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                "상품을 찾을 수 없습니다."));

        product.setCategory(request.getCategory());
        product.setType(request.getType());
        product.setColor(request.getColor());
        product.setPaper(request.getPaper());
        product.setMonthlyPrint(request.getMonthlyPrint());
        product.setPrintRange(request.getPrintRange());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImage(request.getImage());
        product.setFeatured(request.getFeatured());
        product.setDisplayOrder(request.getDisplayOrder());
        product.setVisible(request.getVisible());

        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(
            @PathVariable Long id
    ) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                "상품을 찾을 수 없습니다."));

        productRepository.delete(product);
    }
}
