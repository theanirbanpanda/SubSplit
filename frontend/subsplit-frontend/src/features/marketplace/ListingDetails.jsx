import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListingDetails } from './marketplaceSlice';
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import PublicNavbar from '../landing/components/PublicNavbar';
import SubscriptionHero from './components/details/SubscriptionHero';
import StickyJoinCard from './components/details/StickyJoinCard';
import SubscriptionDetails from './components/details/SubscriptionDetails';
import HostProfileCard from './components/details/HostProfileCard';
import OccupancyCard from './components/details/OccupancyCard';
import TrustSection from './components/details/TrustSection';
import MemberReviews from './components/details/MemberReviews';
import RelatedListings from './components/details/RelatedListings';
import JoinModal from './components/details/JoinModal';
import ListingDetailsSkeleton from './components/details/ListingDetailsSkeleton';

import Footer from '../landing/components/Footer';
import ScrollToTop from '../landing/components/ScrollToTop';

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedListing: listing, detailsLoading: loading } = useSelector((state) => state.marketplace);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchListingDetails(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return <ListingDetailsSkeleton />;
  }

  // Empty State if listing unavailable
  if (!listing) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#09090B', color: '#ffffff' }}>
        <PublicNavbar />
        <Box sx={{ py: 12, textAlign: 'center', maxWidth: 480, mx: 'auto', px: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: '24px',
              border: '1px solid #2A2A30',
              background: '#111114',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <AlertCircle size={32} color="#ef4444" />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff', mb: 1 }}>
              Listing no longer available
            </Typography>

            <Typography sx={{ color: '#A1A1AA', fontSize: '0.92rem', mb: 3.5, lineHeight: 1.6 }}>
              This subscription group has either reached max capacity or was removed by the host.
            </Typography>

            <Button
              variant="contained"
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate('/app/marketplace')}
              sx={{
                borderRadius: '12px',
                fontWeight: 700,
                px: 3.5,
                py: 1.2,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              }}
            >
              Back to Marketplace
            </Button>
          </Paper>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#09090B', color: '#ffffff', overflowX: 'hidden' }}>
      <PublicNavbar />

      <Box sx={{ width: '92%', maxWidth: '1440px', mx: 'auto', pt: { xs: 10, md: 13 }, pb: 8 }}>
        <Grid container spacing={{ xs: 3, md: 5 }}>
          {/* Left Column — 65% (8 Cols) */}
          <Grid item xs={12} md={7.8}>
            <SubscriptionHero listing={listing} />
            <SubscriptionDetails listing={listing} />
            <HostProfileCard host={listing.host} />
            <OccupancyCard listing={listing} />
            <TrustSection />
            <MemberReviews />
          </Grid>

          {/* Right Column — 35% (4 Cols) Sticky Join Sidebar */}
          <Grid item xs={12} md={4.2}>
            <StickyJoinCard
              listing={listing}
              onJoinClick={() => setJoinModalOpen(true)}
            />
          </Grid>
        </Grid>

        {/* Related Subscriptions Section */}
        <RelatedListings currentId={listing.id} category={listing.category} />
      </Box>

      {/* Join Confirmation Modal */}
      <JoinModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        listing={listing}
      />

      <Footer />
      <ScrollToTop />
    </Box>
  );
}

export default ListingDetails;
