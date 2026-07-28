package com.subsplit.wallet.controller;

import com.subsplit.common.dto.ApiResponse;
import com.subsplit.common.entity.User;
import com.subsplit.common.exception.UnauthorizedException;
import com.subsplit.wallet.dto.AddMoneyRequest;
import com.subsplit.wallet.dto.WalletResponse;
import com.subsplit.wallet.entity.Wallet;
import com.subsplit.wallet.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/wallets")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public List<Wallet> getAllWallets() {
        return walletService.getAllWallets();
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<WalletResponse>> getMyWallet(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            throw new UnauthorizedException("User is not authenticated");
        }

        WalletResponse wallet = walletService.getMyWallet(user);
        return ResponseEntity.ok(
                ApiResponse.<WalletResponse>builder()
                        .success(true)
                        .message("Wallet details retrieved successfully")
                        .data(wallet)
                        .build());
    }

    @PostMapping("/add-money")
    public ResponseEntity<ApiResponse<WalletResponse>> addMoney(
            Authentication authentication,
            @RequestBody(required = false) AddMoneyRequest request,
            @RequestParam(value = "amount", required = false) BigDecimal queryAmount) {

        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            throw new UnauthorizedException("User is not authenticated");
        }

        BigDecimal amount = (request != null && request.getAmount() != null) ? request.getAmount() : queryAmount;
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valid amount greater than 0 is required");
        }

        WalletResponse updatedWallet = walletService.addMoney(user, amount);
        return ResponseEntity.ok(
                ApiResponse.<WalletResponse>builder()
                        .success(true)
                        .message("₹" + amount + " added to wallet successfully!")
                        .data(updatedWallet)
                        .build());
    }
}

