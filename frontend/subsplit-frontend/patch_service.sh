#!/bin/bash
sed -i.bak '/public JoinRequestResponse rejectJoinRequest(User host, Long requestId) {/i \
    @Override\
    @Transactional\
    public JoinRequestResponse cancelJoinRequest(User member, Long requestId) {\
        JoinRequest joinReq = joinRequestRepository.findById(requestId)\
                .orElseThrow(() -> new ResourceNotFoundException("Join request not found with id: " + requestId));\
\
        if (member == null || joinReq.getMember() == null || !Objects.equals(joinReq.getMember().getId(), member.getId())) {\
            throw new UnauthorizedException("You are not authorized to cancel this join request");\
        }\
\
        if (joinReq.getStatus() != JoinRequestStatus.PENDING) {\
            throw new BadRequestException("Request is already " + joinReq.getStatus() + " and cannot be cancelled");\
        }\
\
        // Cancel join request\
        joinReq.setStatus(JoinRequestStatus.CANCELLED);\
        JoinRequest savedReq = joinRequestRepository.save(joinReq);\
\
        // Refund reserved escrow deposit back to member'"'"'s wallet\
        BigDecimal refundAmount = joinReq.getListing().getSeatPrice();\
        if (refundAmount != null && refundAmount.compareTo(BigDecimal.ZERO) > 0) {\
            Wallet memberWallet = walletRepository.findByUserId(member.getId()).orElse(null);\
            if (memberWallet != null) {\
                memberWallet.setBalance(memberWallet.getBalance().add(refundAmount));\
                walletRepository.save(memberWallet);\
\
                walletTransactionRepository.save(WalletTransaction.builder()\
                        .wallet(memberWallet)\
                        .transactionType(TransactionType.REFUND)\
                        .amount(refundAmount)\
                        .referenceId(joinReq.getListing().getId())\
                        .remarks("Refund of escrow deposit for cancelled join request: " + joinReq.getListing().getTitle())\
                        .build());\
            }\
        }\
\
        return JoinRequestResponse.builder()\
                .id(savedReq.getId())\
                .listingId(savedReq.getListing().getId())\
                .listingTitle(savedReq.getListing().getTitle())\
                .hostName(savedReq.getListing().getHost().getFullName())\
                .status(savedReq.getStatus().name())\
                .build();\
    }\
' /Users/anirban/Downloads/Subsplit/backend/src/main/java/com/subsplit/marketplace/service/impl/MarketplaceServiceImpl.java
