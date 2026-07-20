package com.subsplit.review.service.impl;

import com.subsplit.review.entity.Review;
import com.subsplit.review.repository.ReviewRepository;
import com.subsplit.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
}
