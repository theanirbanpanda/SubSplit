package com.subsplit.wallet.service.impl;

import com.subsplit.common.entity.User;
import com.subsplit.common.enums.TransactionType;
import com.subsplit.wallet.dto.WalletResponse;

import com.subsplit.wallet.entity.Wallet;
import com.subsplit.wallet.entity.WalletTransaction;
import com.subsplit.wallet.repository.WalletRepository;
import com.subsplit.wallet.repository.WalletTransactionRepository;
import com.subsplit.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import com.subsplit.notification.service.NotificationService;
import com.subsplit.common.enums.NotificationType;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final NotificationService notificationService;

    @Override
    public List<Wallet> getAllWallets() {
        return walletRepository.findAll();
    }

    @Override
    @Transactional
    public WalletResponse getMyWallet(User user) {
        boolean isKycVerified = Boolean.TRUE.equals(user.getEmailVerified()) || "VERIFIED".equalsIgnoreCase(user.getKycStatus());
        if (!isKycVerified) {
            throw new IllegalArgumentException("KYC_REQUIRED: Identity KYC verification is required to access wallet and escrow funds.");
        }

        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Wallet newWallet = Wallet.builder()
                            .user(user)
                            .balance(BigDecimal.ZERO)
                            .build();
                    return walletRepository.save(newWallet);
                });

        return mapToResponse(wallet);
    }

    @Override
    @Transactional
    public WalletResponse addMoney(User user, BigDecimal amount) {
        boolean isKycVerified = Boolean.TRUE.equals(user.getEmailVerified()) || "VERIFIED".equalsIgnoreCase(user.getKycStatus());
        if (!isKycVerified) {
            throw new IllegalArgumentException("KYC_REQUIRED: Identity KYC verification is required before adding funds to your wallet.");
        }

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Wallet newWallet = Wallet.builder()
                            .user(user)
                            .balance(BigDecimal.ZERO)
                            .build();
                    return walletRepository.save(newWallet);
                });

        BigDecimal newBalance = wallet.getBalance().add(amount);
        wallet.setBalance(newBalance);
        Wallet savedWallet = walletRepository.save(wallet);

        // Record credit transaction
        WalletTransaction transaction = WalletTransaction.builder()
                .wallet(savedWallet)
                .transactionType(TransactionType.CREDIT)
                .amount(amount)
                .remarks("Added funds via instant wallet top-up")
                .build();
        walletTransactionRepository.save(transaction);

        // Send notification
        try {
            notificationService.createNotification(
                    user,
                    NotificationType.PAYMENT,
                    "Wallet Top-Up Successful 💳",
                    "₹" + amount + " added to your SubSplit wallet balance."
            );
        } catch (Exception ignored) {}

        return mapToResponse(savedWallet);
    }

    private WalletResponse mapToResponse(Wallet wallet) {
        List<WalletTransaction> transactions = walletTransactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId());

        List<WalletResponse.TransactionDto> txDtos = transactions.stream()
                .map(tx -> WalletResponse.TransactionDto.builder()
                        .id(tx.getId())
                        .type(tx.getTransactionType() != null ? tx.getTransactionType().name() : "CREDIT")
                        .amount(tx.getAmount())
                        .remarks(tx.getRemarks())
                        .createdAt(tx.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return WalletResponse.builder()
                .id(wallet.getId())
                .userId(wallet.getUser().getId())
                .balance(wallet.getBalance())
                .recentTransactions(txDtos)
                .build();
    }
}

