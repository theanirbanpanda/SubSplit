package com.subsplit.user.service;

import com.subsplit.user.dto.UserCreationRequest;
import com.subsplit.common.entity.User;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();

    User createUser(UserCreationRequest request);

}
