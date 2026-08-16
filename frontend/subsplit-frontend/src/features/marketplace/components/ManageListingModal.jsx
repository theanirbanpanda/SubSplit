import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Stack,
  IconButton,
  CircularProgress
} from '@mui/material';
import { X, CheckCircle, Plus, Minus, Calendar, UploadCloud, Users, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateListing, renewListing } from '../marketplaceSlice';
import Confetti from 'react-confetti';

const ManageListingModal = ({ open, handleClose, listing }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  
  // Update Seats State
  const [availableSeats, setAvailableSeats] = useState(0);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [seatsSuccess, setSeatsSuccess] = useState(false);

  // Renew Subscription State
  const [proofImage, setProofImage] = useState('');
  const [additionalMonths, setAdditionalMonths] = useState(1);
  const [renewLoading, setRenewLoading] = useState(false);
  const [renewSuccess, setRenewSuccess] = useState(false);

  useEffect(() => {
    if (listing && open) {
      setAvailableSeats(listing.availableSeats || 0);
      setActiveTab(0);
      setSeatsSuccess(false);
      setRenewSuccess(false);
      setProofImage('');
      setAdditionalMonths(1);
    }
  }, [listing, open]);

  const handleUpdateSeats = async () => {
    setSeatsLoading(true);
    setSeatsSuccess(false);
    try {
      const resultAction = await dispatch(updateListing({
        id: listing.id,
        listingData: {
          availableSeats: availableSeats,
          seatPrice: listing.seatPrice, // keep current price
          status: listing.status
        }
      }));
      if (updateListing.fulfilled.match(resultAction)) {
        setSeatsSuccess(true);
      }
    } finally {
      setSeatsLoading(false);
    }
  };

  const handleRenew = async () => {
    if (!proofImage) return;
    setRenewLoading(true);
    setRenewSuccess(false);
    
    // Calculate new expiry date based on listing's current expiry
    const currentDate = listing.expiryDate ? new Date(listing.expiryDate) : new Date();
    currentDate.setMonth(currentDate.getMonth() + additionalMonths);
    const newExpiryDate = currentDate.toISOString().split('T')[0];

    try {
      const resultAction = await dispatch(renewListing({
        id: listing.id,
        renewalData: {
          proofImage,
          newExpiryDate
        }
      }));
      if (renewListing.fulfilled.match(resultAction)) {
        setRenewSuccess(true);
      }
    } finally {
      setRenewLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setProofImage(event.target.result);
    reader.readAsDataURL(file);
  };

  const onTabChange = (e, val) => {
    setActiveTab(val);
    setSeatsSuccess(false);
    setRenewSuccess(false);
  };

  if (!listing) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'rgba(23,23,23,0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          color: '#fff',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          Manage Listing
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: '#9ca3af', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' } }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <Box sx={{ px: 3, mb: 1 }}>
        <Typography variant="body2" sx={{ color: '#9ca3af' }}>
          {listing.title} • {listing.plan?.name}
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.08)', px: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={onTabChange}
          sx={{
            '& .MuiTab-root': {
              color: '#9ca3af',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              minWidth: 'auto',
              mr: 4
            },
            '& .Mui-selected': {
              color: '#3b82f6 !important'
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#3b82f6'
            }
          }}
        >
          <Tab label="Modify Seats" />
          <Tab label="Renew Subscription" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        {activeTab === 0 && (
          <Stack spacing={4}>
            <Box sx={{ p: 3, borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Available Seats</Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
                Update the number of seats available. If you sold a seat offline, you can reduce this number so buyers don't over-purchase. Total capacity is {listing.totalSeats}.
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <IconButton 
                  onClick={() => setAvailableSeats(Math.max(0, availableSeats - 1))}
                  sx={{ background: 'rgba(255,255,255,0.08)', '&:hover': { background: 'rgba(255,255,255,0.15)' } }}
                >
                  <Minus size={20} color="#fff" />
                </IconButton>
                <Typography variant="h3" sx={{ fontWeight: 800, width: '60px', textAlign: 'center' }}>
                  {availableSeats}
                </Typography>
                <IconButton 
                  onClick={() => setAvailableSeats(Math.min(listing.totalSeats, availableSeats + 1))}
                  sx={{ background: 'rgba(255,255,255,0.08)', '&:hover': { background: 'rgba(255,255,255,0.15)' } }}
                >
                  <Plus size={20} color="#fff" />
                </IconButton>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              disabled={seatsLoading || availableSeats === listing.availableSeats}
              onClick={handleUpdateSeats}
              sx={{
                background: seatsSuccess ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff',
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                '&:hover': {
                  background: seatsSuccess ? '#059669' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                }
              }}
            >
              {seatsLoading ? <CircularProgress size={24} color="inherit" /> : seatsSuccess ? 'Updated Successfully!' : 'Update Seats'}
            </Button>
          </Stack>
        )}

        {activeTab === 1 && (
          <Stack spacing={4}>
            <Box sx={{ p: 3, borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Renew Listing</Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
                Upload the latest payment receipt to verify your renewal for the next billing cycle.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                 <Button
                    variant={additionalMonths === 1 ? 'contained' : 'outlined'}
                    onClick={() => setAdditionalMonths(1)}
                    sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', borderColor: 'rgba(255,255,255,0.2)' }}
                 >
                    +1 Month
                 </Button>
                 <Button
                    variant={additionalMonths === 3 ? 'contained' : 'outlined'}
                    onClick={() => setAdditionalMonths(3)}
                    sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', borderColor: 'rgba(255,255,255,0.2)' }}
                 >
                    +3 Months
                 </Button>
                 <Button
                    variant={additionalMonths === 12 ? 'contained' : 'outlined'}
                    onClick={() => setAdditionalMonths(12)}
                    sx={{ flex: 1, borderRadius: '8px', textTransform: 'none', borderColor: 'rgba(255,255,255,0.2)' }}
                 >
                    +1 Year
                 </Button>
              </Box>

              <label style={{ display: 'block' }}>
                <Box sx={{
                  border: '2px dashed rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#3b82f6', background: 'rgba(59,130,246,0.05)' },
                  transition: 'all 0.2s'
                }}>
                  {proofImage ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <img src={proofImage} alt="Proof" style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '8px', objectFit: 'contain' }} />
                      <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>Image ready to upload</Typography>
                    </Box>
                  ) : (
                    <Stack alignItems="center" spacing={1}>
                      <UploadCloud size={32} color="#60a5fa" />
                      <Typography variant="subtitle2" sx={{ color: '#fff' }}>Click to upload payment receipt</Typography>
                      <Typography variant="caption" sx={{ color: '#9ca3af' }}>JPG, PNG, GIF up to 5MB</Typography>
                    </Stack>
                  )}
                  <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                </Box>
              </label>
            </Box>

            <Button
              variant="contained"
              fullWidth
              disabled={renewLoading || !proofImage}
              onClick={handleRenew}
              sx={{
                background: renewSuccess ? '#10b981' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#fff',
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
                '&:hover': {
                  background: renewSuccess ? '#059669' : 'linear-gradient(135deg, #d97706, #b45309)',
                }
              }}
            >
              {renewLoading ? <CircularProgress size={24} color="inherit" /> : renewSuccess ? 'Renewed Successfully!' : 'Submit Proof & Renew'}
            </Button>
          </Stack>
        )}
      </DialogContent>
      {renewSuccess && <Confetti width={600} height={400} recycle={false} numberOfPieces={200} />}
    </Dialog>
  );
};

export default ManageListingModal;
