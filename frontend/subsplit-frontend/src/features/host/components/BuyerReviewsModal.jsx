import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Stack,
  Avatar,
} from '@mui/material';
import { X, Star } from 'lucide-react';
import styles from './ShareCredentialsModal.module.scss'; // Reuse modal styling

// Helper to generate deterministic but random-looking mock reviews based on a string seed
function generateMockReviews(seedString) {
  if (!seedString) return [];
  
  const seed = seedString.charCodeAt(0) + seedString.charCodeAt(seedString.length - 1);
  const reviewCount = (seed % 4) + 2; // 2 to 5 reviews
  
  const mockComments = [
    "Great communication and prompt payment. Highly recommended!",
    "Smooth transaction, no issues at all. Very reliable.",
    "Friendly buyer, paid on time. Perfect experience.",
    "Quick response to messages and very understanding.",
    "A pleasure to share my subscription with.",
    "Trustworthy and polite. 5/5 stars.",
    "Everything went perfectly. Would gladly host again."
  ];

  const mockNames = ["Alex T.", "Sarah M.", "David K.", "Jessica R.", "Michael B.", "Emma C."];

  const reviews = [];
  for (let i = 0; i < reviewCount; i++) {
    const commentIndex = (seed + i * 3) % mockComments.length;
    const nameIndex = (seed + i * 7) % mockNames.length;
    const rating = ((seed + i) % 10) > 8 ? 4 : 5; // Mostly 5 stars, occasional 4 star
    
    // Generate a recent date
    const date = new Date();
    date.setDate(date.getDate() - ((seed * 3 + i * 14) % 100)); // 0 to 100 days ago
    
    reviews.push({
      id: `rev_${i}`,
      reviewerName: mockNames[nameIndex],
      rating,
      comment: mockComments[commentIndex],
      date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });
  }
  
  return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function BuyerReviewsModal({ open, onClose, buyerName }) {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (open && buyerName) {
      setLoading(true);
      // Simulate API network request
      const timer = setTimeout(() => {
        setReviews(generateMockReviews(buyerName));
        setLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [open, buyerName]);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 5.0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: styles.modalPaper
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Star size={22} color="#f59e0b" fill="#f59e0b" />
          <Typography className={styles.modalTitle}>
            Ratings & Reviews
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#9ca3af' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 4 }}>
        <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', mb: 3 }}>
          What other hosts are saying about <strong style={{ color: '#f3f4f6' }}>{buyerName || 'this member'}</strong>
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#f59e0b' }} />
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, p: 2, background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: '#f3f4f6', lineHeight: 1 }}>
                  {averageRating}
                </Typography>
                <Star size={20} color="#f59e0b" fill="#f59e0b" style={{ position: 'relative', top: '2px' }}/>
              </Box>
              <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                Based on {reviews.length} reviews from verified hosts
              </Typography>
            </Box>

            <Stack spacing={3}>
              {reviews.map((review) => (
                <Box key={review.id} sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', pb: 3, '&:last-child': { borderBottom: 'none', pb: 0 } }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', background: '#374151', color: '#f3f4f6', fontWeight: 700 }}>
                      {review.reviewerName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: '#f3f4f6', fontSize: '0.9rem', fontWeight: 700 }}>
                        {review.reviewerName}
                      </Typography>
                      <Typography sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        {review.date}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        color={i < review.rating ? "#f59e0b" : "#4b5563"} 
                        fill={i < review.rating ? "#f59e0b" : "none"} 
                      />
                    ))}
                  </Box>
                  <Typography sx={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    "{review.comment}"
                  </Typography>
                </Box>
              ))}
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default BuyerReviewsModal;
