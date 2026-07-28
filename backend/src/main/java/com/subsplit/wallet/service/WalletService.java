package com.subsplit.wallet.service;

import com.subsplit.common.entity.User;
import com.subsplit.wallet.dto.WalletResponse;
import com.subsplit.wallet.entity.Wallet;


import java.math.BigDecimal;
import java.util.List;

public interface WalletService {

    List<Wallet> getAllWallets();

    WalletResponse getMyWallet(User user);

    WalletResponse addMoney(User user, BigDecimal amount);
}

