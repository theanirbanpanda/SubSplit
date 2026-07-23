package com.subsplit.auth.service;

import com.subsplit.auth.dto.AuthResponse;
import com.subsplit.auth.dto.LoginRequest;
import com.subsplit.auth.dto.RefreshTokenRequest;
import com.subsplit.auth.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

}
