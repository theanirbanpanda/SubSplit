package com.subsplit.user.controller;

import com.subsplit.user.dto.UserCreationRequest;
import com.subsplit.user.entity.User;
import com.subsplit.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public User createUser(@Valid @RequestBody UserCreationRequest request) {
        return userService.createUser(request);
    }
}
