package com.subsplit.admin.controller;

import com.subsplit.admin.entity.AdminLog;
import com.subsplit.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/logs")
    public List<AdminLog> getAllLogs() {
        return adminService.getAllLogs();
    }
}
