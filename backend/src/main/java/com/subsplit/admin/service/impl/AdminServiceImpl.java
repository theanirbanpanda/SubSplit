package com.subsplit.admin.service.impl;

import com.subsplit.admin.entity.AdminLog;
import com.subsplit.admin.repository.AdminLogRepository;
import com.subsplit.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminLogRepository adminLogRepository;

    @Override
    public List<AdminLog> getAllLogs() {
        return adminLogRepository.findAll();
    }
}
