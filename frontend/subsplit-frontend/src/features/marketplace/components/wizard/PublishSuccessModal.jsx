import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateListingWizard.module.scss';

/**
 * PublishSuccessModal
 * Shown after Step 5's real backend publish call succeeds.
 * Props:
 *   open: boolean
 *   listingId: string | number | null — ID returned by the real create API
 *   onClose: () => void
 */
function PublishSuccessModal({ open, listingId, onClose }) {
  const navigate = useNavigate();

  const handleViewListing = () => {
    onClose();
    if (listingId) {
      navigate(`/app/marketplace/${listingId}`);
    } else {
      navigate('/app/marketplace');
    }
  };

  const handleDashboard = () => {
    onClose();
    navigate('/app/host');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ className: styles.successModalPaper, sx: { p: 4 } }}
    >
      <DialogContent sx={{ p: 0, textAlign: 'center' }}>
        <div className={styles.successIconRing}>
          <CheckCircle size={34} color="#22C55E" strokeWidth={2.5} />
        </div>

        <h2 className={styles.successTitle}>Listing Published!</h2>
        <p className={styles.successSubtitle}>
          Your pass is now live on the SubSplit marketplace. Members can discover and join it right
          away.
        </p>

        <div className={styles.successActions}>
          <button
            className={styles.btnSecondary}
            onClick={handleDashboard}
            id="publish-success-dashboard"
          >
            Go to Dashboard
          </button>
          <button
            className={styles.btnPrimary}
            onClick={handleViewListing}
            id="publish-success-view-listing"
          >
            View Listing
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PublishSuccessModal;
