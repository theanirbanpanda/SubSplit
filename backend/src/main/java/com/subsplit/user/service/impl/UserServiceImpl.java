package com.subsplit.user.service.impl;

import com.subsplit.common.entity.User;
import com.subsplit.user.repository.UserRepository;
import com.subsplit.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
