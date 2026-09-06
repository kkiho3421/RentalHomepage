package com.everps.backend.controller;

import com.everps.backend.entity.Product;
import com.everps.backend.repository.ProductRepository;

import org.springframework.web.bind.annotation.*;

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
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    public Product getProduct(
            @PathVariable Long id
    ) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                "상품을 찾을 수 없습니다."));
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
