package com.subsplit.admin.service.impl;

import com.subsplit.admin.dto.ProductRequestDto;
import com.subsplit.admin.dto.ProductRequestResponseDto;
import com.subsplit.admin.entity.ProductRequest;
import com.subsplit.admin.repository.ProductRequestRepository;
import com.subsplit.admin.service.ProductRequestService;
import com.subsplit.common.entity.User;
import com.subsplit.common.enums.NotificationType;
import com.subsplit.common.enums.ProductRequestStatus;
import com.subsplit.common.exception.BadRequestException;
import com.subsplit.common.exception.ResourceNotFoundException;
import com.subsplit.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductRequestServiceImpl implements ProductRequestService {

    private final ProductRequestRepository productRequestRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public ProductRequestResponseDto submitRequest(User user, ProductRequestDto dto) {
        ProductRequest request = ProductRequest.builder()
                .user(user)
                .productName(dto.getProductName())
                .category(dto.getCategory())
                .websiteUrl(dto.getWebsiteUrl())
                .description(dto.getDescription())
                .status(ProductRequestStatus.PENDING)
                .build();

        ProductRequest saved = productRequestRepository.save(request);
        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductRequestResponseDto> getAllRequests() {
        return productRequestRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductRequestResponseDto> getMyRequests(User user) {
        return productRequestRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductRequestResponseDto reviewRequest(Long id, String status, String adminNotes) {
        ProductRequest request = productRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product request not found with id: " + id));

        ProductRequestStatus newStatus;
        try {
            newStatus = ProductRequestStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status + ". Must be APPROVED or REJECTED.");
        }

        if (newStatus == ProductRequestStatus.PENDING) {
            throw new BadRequestException("Cannot set status back to PENDING.");
        }

        request.setStatus(newStatus);
        request.setAdminNotes(adminNotes);
        ProductRequest saved = productRequestRepository.save(request);

        // Send notification to the requester
        User requester = saved.getUser();
        String productName = saved.getProductName();

        if (newStatus == ProductRequestStatus.APPROVED) {
            notificationService.createNotification(
                    requester,
                    NotificationType.PRODUCT_REQUEST,
                    "Product Request Approved!",
                    "Great news! Your request to add \"" + productName + "\" to the SubSplit catalog has been approved. " +
                    "It will be available on the marketplace soon."
            );
        } else {
            String notes = (adminNotes != null && !adminNotes.isBlank()) ? " Reason: " + adminNotes : "";
            notificationService.createNotification(
                    requester,
                    NotificationType.PRODUCT_REQUEST,
                    "Product Request Update",
                    "Your request to add \"" + productName + "\" was not approved at this time." + notes
            );
        }

        return toDto(saved);
    }

    private ProductRequestResponseDto toDto(ProductRequest request) {
        User user = request.getUser();
        return ProductRequestResponseDto.builder()
                .id(request.getId())
                .userId(user.getId())
                .userEmail(user.getEmail())
                .userName(user.getFullName() != null ? user.getFullName() : user.getEmail())
                .productName(request.getProductName())
                .category(request.getCategory())
                .websiteUrl(request.getWebsiteUrl())
                .description(request.getDescription())
                .status(request.getStatus())
                .adminNotes(request.getAdminNotes())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }
}
