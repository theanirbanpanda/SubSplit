package com.subsplit.dispute.service.impl;

import com.subsplit.common.entity.User;
import com.subsplit.common.enums.DisputeStatus;
import com.subsplit.common.enums.JoinRequestStatus;
import com.subsplit.common.enums.NotificationType;
import com.subsplit.common.enums.TransactionType;
import com.subsplit.common.exception.BadRequestException;
import com.subsplit.common.exception.ResourceNotFoundException;
import com.subsplit.dispute.dto.DisputeResponse;
import com.subsplit.dispute.dto.RaiseDisputeRequest;
import com.subsplit.dispute.dto.ResolveDisputeRequest;
import com.subsplit.dispute.entity.Dispute;
import com.subsplit.dispute.repository.DisputeRepository;
import com.subsplit.dispute.service.DisputeService;
import com.subsplit.listing.entity.JoinRequest;
import com.subsplit.listing.entity.Listing;
import com.subsplit.listing.repository.JoinRequestRepository;
import com.subsplit.listing.repository.ListingRepository;
import com.subsplit.notification.service.NotificationService;
import com.subsplit.wallet.entity.Wallet;
import com.subsplit.wallet.entity.WalletTransaction;
import com.subsplit.wallet.repository.WalletRepository;
import com.subsplit.wallet.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DisputeServiceImpl implements DisputeService {

    private final DisputeRepository disputeRepository;
    private final ListingRepository listingRepository;
    private final JoinRequestRepository joinRequestRepository;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public DisputeResponse raiseDispute(User user, RaiseDisputeRequest request) {
        Listing listing = null;
        if (request.getListingId() != null) {
            listing = listingRepository.findById(request.getListingId())
                    .orElse(null);
        }

        JoinRequest joinReq = null;
        if (request.getJoinRequestId() != null) {
            joinReq = joinRequestRepository.findById(request.getJoinRequestId())
                    .orElse(null);
            if (listing == null && joinReq != null) {
                listing = joinReq.getListing();
            }
        }

        User againstUser = null;
        if (listing != null) {
            if (listing.getHost() != null && !listing.getHost().getId().equals(user.getId())) {
                againstUser = listing.getHost();
            } else if (joinReq != null && joinReq.getMember() != null) {
                againstUser = joinReq.getMember();
            }
        }

        Dispute dispute = Dispute.builder()
                .listing(listing)
                .joinRequest(joinReq)
                .raisedBy(user)
                .againstUser(againstUser)
                .reason(request.getReason() != null ? request.getReason() : "GENERAL_DISPUTE")
                .description(request.getDescription())
                .proofImage(request.getProofImage())
                .status(DisputeStatus.OPEN)
                .build();

        Dispute saved = disputeRepository.save(dispute);

        // Send notifications
        try {
            notificationService.createNotification(
                    user,
                    NotificationType.SYSTEM,
                    "Dispute Raised Successfully ⚠️",
                    "Dispute #" + saved.getId() + " raised for '" + (listing != null ? listing.getTitle() : "Listing") + "'. Our admin team will audit and resolve it shortly."
            );
            if (againstUser != null) {
                notificationService.createNotification(
                        againstUser,
                        NotificationType.SYSTEM,
                        "Dispute Flagged on Listing ⚠️",
                        "A dispute #" + saved.getId() + " was raised on '" + (listing != null ? listing.getTitle() : "Listing") + "'. Reason: " + saved.getReason()
                );
            }
        } catch (Exception e) {
            log.error("Failed to send dispute creation notification: ", e);
        }

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisputeResponse> getUserDisputes(User user) {
        if (user == null) return List.of();
        List<Dispute> disputes = disputeRepository.findByRaisedByIdOrderByCreatedAtDesc(user.getId());
        return disputes.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisputeResponse> getAllDisputesAdmin() {
        List<Dispute> disputes = disputeRepository.findAllByOrderByCreatedAtDesc();
        return disputes.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DisputeResponse resolveDisputeAdmin(User admin, Long disputeId, ResolveDisputeRequest request) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new ResourceNotFoundException("Dispute not found with id: " + disputeId));

        if (dispute.getStatus() == DisputeStatus.RESOLVED_REFUNDED || dispute.getStatus() == DisputeStatus.RESOLVED_REJECTED) {
            throw new BadRequestException("Dispute #" + disputeId + " is already resolved.");
        }

        String action = request.getAction() != null ? request.getAction().toUpperCase() : "REJECT_DISPUTE";
        LocalDateTime now = LocalDateTime.now();
        dispute.setResolutionNotes(request.getResolutionNotes());
        dispute.setResolvedBy(admin);
        dispute.setResolvedAt(now);

        User member = dispute.getRaisedBy();
        Listing listing = dispute.getListing();
        BigDecimal refundAmount = (listing != null && listing.getSeatPrice() != null) ? listing.getSeatPrice() : BigDecimal.ZERO;

        if ("REFUND_MEMBER".equals(action)) {
            dispute.setStatus(DisputeStatus.RESOLVED_REFUNDED);

            // Perform wallet refund to member
            if (member != null && refundAmount.compareTo(BigDecimal.ZERO) > 0) {
                Wallet wallet = walletRepository.findByUserId(member.getId())
                        .orElseGet(() -> walletRepository.save(Wallet.builder()
                                .user(member)
                                .balance(BigDecimal.ZERO)
                                .build()));

                wallet.setBalance(wallet.getBalance().add(refundAmount));
                walletRepository.save(wallet);

                walletTransactionRepository.save(WalletTransaction.builder()
                        .wallet(wallet)
                        .transactionType(TransactionType.REFUND)
                        .amount(refundAmount)
                        .referenceId(dispute.getId())
                        .remarks("Admin dispute resolution refund for '" + (listing != null ? listing.getTitle() : "Listing") + "'")
                        .build());
            }

            // Update join request if exists
            if (dispute.getJoinRequest() != null) {
                JoinRequest jr = dispute.getJoinRequest();
                jr.setStatus(JoinRequestStatus.REJECTED);
                jr.setMessage("Dispute resolved with member refund.");
                joinRequestRepository.save(jr);
            }

            try {
                if (member != null) {
                    notificationService.createNotification(
                            member,
                            NotificationType.SYSTEM,
                            "Dispute Resolved - Refund Credited 💸",
                            "Admin resolved dispute #" + disputeId + ". Refund of ₹" + refundAmount + " credited to your wallet balance."
                    );
                }
            } catch (Exception ignored) {}
        } else {
            dispute.setStatus(DisputeStatus.RESOLVED_REJECTED);

            try {
                if (member != null) {
                    notificationService.createNotification(
                            member,
                            NotificationType.SYSTEM,
                            "Dispute Audit Completed ℹ️",
                            "Admin resolved dispute #" + disputeId + ": " + (request.getResolutionNotes() != null ? request.getResolutionNotes() : "Dispute dismissed following verification.")
                    );
                }
            } catch (Exception ignored) {}
        }

        Dispute saved = disputeRepository.save(dispute);
        return mapToResponse(saved);
    }

    private DisputeResponse mapToResponse(Dispute d) {
        Listing l = d.getListing();
        User raised = d.getRaisedBy();
        User against = d.getAgainstUser();
        BigDecimal amt = (l != null && l.getSeatPrice() != null) ? l.getSeatPrice() : BigDecimal.ZERO;

        String platform = (l != null && l.getPlan() != null && l.getPlan().getSubscription() != null)
                ? l.getPlan().getSubscription().getProviderName()
                : "Subscription";

        return DisputeResponse.builder()
                .id(d.getId())
                .listingId(l != null ? l.getId() : null)
                .listingTitle(l != null ? l.getTitle() : "Group Subscription Pass")
                .platformName(platform)
                .joinRequestId(d.getJoinRequest() != null ? d.getJoinRequest().getId() : null)
                .raisedById(raised != null ? raised.getId() : null)
                .raisedByName(raised != null ? raised.getFullName() : "User")
                .raisedByEmail(raised != null ? raised.getEmail() : null)
                .againstUserId(against != null ? against.getId() : null)
                .againstUserName(against != null ? against.getFullName() : "Host")
                .againstUserEmail(against != null ? against.getEmail() : null)
                .amount(amt)
                .reason(d.getReason())
                .description(d.getDescription())
                .proofImage(d.getProofImage())
                .status(d.getStatus() != null ? d.getStatus().name() : "OPEN")
                .resolutionNotes(d.getResolutionNotes())
                .createdAt(d.getCreatedAt())
                .resolvedAt(d.getResolvedAt())
                .build();
    }
}
