package com.subsplit.wallet.service.impl;

import com.subsplit.wallet.entity.Wallet;
import com.subsplit.wallet.repository.WalletRepository;
import com.subsplit.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;

    @Override
    public List<Wallet> getAllWallets() {
        return walletRepository.findAll();
    }
}
