package com.subsplit.admin.service;

import com.subsplit.admin.dto.ProductRequestDto;
import com.subsplit.admin.dto.ProductRequestResponseDto;
import com.subsplit.common.entity.User;

import java.util.List;

public interface ProductRequestService {

    ProductRequestResponseDto submitRequest(User user, ProductRequestDto dto);

    List<ProductRequestResponseDto> getAllRequests();

    List<ProductRequestResponseDto> getMyRequests(User user);

    ProductRequestResponseDto reviewRequest(Long id, String status, String adminNotes);
}
