import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '@mui/material';
import { Check, ChevronLeft, ChevronRight, X, Layers, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { createNewListing, fetchMyListings } from '../marketplaceSlice';
import { validatePrice } from '../utils/pricingHelpers';

import Step1Product from './wizard/Step1Product';
import Step2Plan from './wizard/Step2Plan';
import Step3Pricing from './wizard/Step3Pricing';
import Step4Verification from './wizard/Step4Verification';
import Step5Review from './wizard/Step5Review';
import RequestProductDialog from './wizard/RequestProductDialog';
import PublishSuccessModal from './wizard/PublishSuccessModal';

import styles from './wizard/CreateListingWizard.module.scss';

// ── Stepper config ─────────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Product' },
  { label: 'Plan' },
  { label: 'Pricing' },
  { label: 'Verification' },
  { label: 'Publish' },
];

// ── Initial state ──────────────────────────────────────────────────────────────
const INITIAL_PLAN = {
  seatsUsed: '1',
  maxMembers: '',
  renewalDate: '',
  billingCycle: 'MONTHLY',
};

const INITIAL_UPLOAD_STATES = {
  invoice: 'idle',
  billing: 'idle',
  renewal: 'idle',
  dashboard: 'idle',
};

/**
 * CreateListingModal — 5-step wizard shell.
 * Replaces the previous 3-step free-text form.
 *
 * Props:
 *   open: boolean
 *   onClose: () => void
 */
function CreateListingModal({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const kycStatus = useSelector((state) => state.auth.kycStatus);
  const isKycVerified = Boolean(user?.emailVerified) || kycStatus?.isKycVerified || kycStatus?.kycStatus === 'VERIFIED';

  // ── Wizard state ─────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed
  const [maxReachedStep, setMaxReachedStep] = useState(0); // highest step unlocked
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [plan, setPlan] = useState(INITIAL_PLAN);
  const [price, setPrice] = useState('');
  const [uploadStates, setUploadStates] = useState(INITIAL_UPLOAD_STATES);

  // ── Publish state ────────────────────────────────────────────────────────────
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [publishedId, setPublishedId] = useState(null);
  const [successOpen, setSuccessOpen] = useState(false);

  // ── Dialogs ──────────────────────────────────────────────────────────────────
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  // ── Reset on close ───────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setCurrentStep(0);
    setMaxReachedStep(0);
    setSelectedProduct(null);
    setPlan(INITIAL_PLAN);
    setPrice('');
    setUploadStates(INITIAL_UPLOAD_STATES);
    setPublishLoading(false);
    setPublishError(null);
    setPublishedId(null);
    onClose();
  }, [onClose]);

  // ── Per-step validation ──────────────────────────────────────────────────────
  const isStepValid = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return selectedProduct != null;

      case 1: {
        const used = parseInt(plan.seatsUsed, 10);
        const max = parseInt(plan.maxMembers, 10);
        const hardMax = selectedProduct?.maxCapacity || 10;

        let isFutureDate = false;
        if (plan.renewalDate !== '') {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const renewal = new Date(plan.renewalDate);
          isFutureDate = renewal > today;
        }

        return (
          isFutureDate &&
          !isNaN(used) &&
          !isNaN(max) &&
          max >= 2 &&
          max <= hardMax &&
          used >= 1 &&
          selectedProduct &&
          used < max
        );
      }

      case 2: {
        const p = parseFloat(price);
        if (!p || p <= 0) return false;
        const { valid } = validatePrice(p, selectedProduct);
        return valid;
      }

      case 3:
        return Object.values(uploadStates).some((s) => s === 'verified');

      case 4:
        return true; // Always valid; publish button handles the action

      default:
        return false;
    }
  };

  // ── Stepper navigation ───────────────────────────────────────────────────────
  const goToStep = (idx) => {
    // Can always go backward; can only go forward if already unlocked
    if (idx < currentStep || idx <= maxReachedStep) {
      setCurrentStep(idx);
    }
  };

  const handleNext = async () => {
    if (!isStepValid(currentStep)) return;

    if (currentStep === 4) {
      // Step 5: real publish
      await handlePublish();
      return;
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setMaxReachedStep((prev) => Math.max(prev, nextStep));
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  // ── Publish (real backend) ───────────────────────────────────────────────────
  const handlePublish = async () => {
    setPublishLoading(true);
    setPublishError(null);

    const seatsUsedNum = parseInt(plan.seatsUsed, 10);
    const maxMembersNum = parseInt(plan.maxMembers, 10);
    const availableSeats = maxMembersNum - seatsUsedNum;
    const priceNum = parseFloat(price);

    // Build accessMethod description line
    const accessLine = `Access: ${selectedProduct.accessMethod}`;

    // Calculate dynamic original price & savings percent from selected catalog product
    const recPrice = selectedProduct?.recommendedPrice ? Number(selectedProduct.recommendedPrice) : Math.round(priceNum * 1.5);
    const calculatedOriginalPrice = Math.round(recPrice * maxMembersNum);
    const calculatedSavings = calculatedOriginalPrice > priceNum
      ? Math.round(((calculatedOriginalPrice - priceNum) / calculatedOriginalPrice) * 100)
      : 0;

    const payload = {
      providerName: selectedProduct.name,
      categoryName: selectedProduct.category,
      planName: selectedProduct.name,
      title: `${selectedProduct.name} — ${availableSeats} Seat${availableSeats !== 1 ? 's' : ''} Available`,
      description: accessLine,
      seatPrice: priceNum,
      originalPrice: calculatedOriginalPrice,
      savingsPercent: calculatedSavings,
      totalSeats: maxMembersNum,
      availableSeats: availableSeats,
      billingCycle: plan.billingCycle,
      expiryDate: plan.renewalDate || undefined,
    };

    try {
      const resultAction = await dispatch(createNewListing(payload));
      if (createNewListing.fulfilled.match(resultAction)) {
        const created = resultAction.payload;
        setPublishedId(created?.id ?? null);
        dispatch(fetchMyListings());
        handleClose();
        setSuccessOpen(true);
      } else {
        setPublishError(resultAction.payload || 'Failed to create listing. Please try again.');
      }
    } catch (err) {
      setPublishError(err.message || 'An unexpected error occurred.');
    } finally {
      setPublishLoading(false);
    }
  };

  // ── Upload state handler ─────────────────────────────────────────────────────
  const handleUploadStateChange = useCallback((cardId, state) => {
    setUploadStates((prev) => ({ ...prev, [cardId]: state }));
  }, []);

  // ── Stepper node state ───────────────────────────────────────────────────────
  const getNodeState = (idx) => {
    if (idx < currentStep) return 'completed';
    if (idx === currentStep) return 'current';
    return 'future';
  };

  const nextLabel = currentStep === 4
    ? (publishLoading ? 'Publishing…' : 'Publish Listing')
    : 'Next';

  const canGoNext = isStepValid(currentStep) && !publishLoading;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ className: styles.wizardPaper }}
        scroll="paper"
      >
        {!isKycVerified ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', position: 'relative' }}>
            <button
              className={styles.closeBtn}
              onClick={handleClose}
              aria-label="Close wizard"
              style={{ position: 'absolute', top: 16, right: 16 }}
            >
              <X size={16} />
            </button>
            <ShieldAlert size={48} color="#f59e0b" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: 12, fontWeight: 900 }}>
              KYC Verification Required
            </h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.5 }}>
              To keep our marketplace safe and secure, all hosts must complete identity verification before listing passes.
            </p>
            <button
              onClick={() => {
                handleClose();
                navigate('/profile');
              }}
              style={{
                background: '#3b82f6',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Go to Profile to Verify
            </button>
          </div>
        ) : (
          <>
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <div className={styles.wizardHeader}>
              <div className={styles.wizardHeaderLeft}>
                <div className={styles.wizardIconTile}>
                  <Layers size={22} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <div className={styles.wizardTitle}>List a New Pass</div>
                  <div className={styles.wizardSubtitle}>
                    Pick a product from our verified catalog — we'll fill in the details.
                  </div>
                </div>
              </div>

              <div className={styles.wizardHeaderRight}>
                <span style={{ opacity: 0.6 }}>Host Center · New Listing</span>
                <button
                  className={styles.closeBtn}
                  onClick={handleClose}
                  aria-label="Close wizard"
                  id="wizard-close-btn"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ── Stepper ─────────────────────────────────────────────────────── */}
            <div className={styles.stepperBar}>
              <div className={styles.stepperTrack}>
                {STEPS.map((step, idx) => {
                  const nodeState = getNodeState(idx);
                  const isLocked = idx > maxReachedStep;
                  const isLast = idx === STEPS.length - 1;

                  return (
                    <div
                      key={step.label}
                      className={styles.stepperItem}
                      data-locked={isLocked && idx !== currentStep ? 'true' : 'false'}
                      onClick={() => goToStep(idx)}
                      id={`wizard-step-nav-${idx}`}
                      role="button"
                      tabIndex={!isLocked ? 0 : -1}
                      aria-label={`Go to step ${idx + 1}: ${step.label}`}
                      onKeyDown={(e) => { if (!isLocked && (e.key === 'Enter' || e.key === ' ')) goToStep(idx); }}
                    >
                      {/* Connector line (not after last item) */}
                      {!isLast && (
                        <div
                          className={styles.stepperConnector}
                          data-completed={nodeState === 'completed' ? 'true' : 'false'}
                        />
                      )}

                      {/* Node */}
                      <div className={styles.stepperNode} data-state={nodeState}>
                        {nodeState === 'completed' ? (
                          <Check size={14} strokeWidth={3} color="#fff" />
                        ) : (
                          idx + 1
                        )}
                      </div>

                      {/* Label */}
                      <div className={styles.stepperLabel} data-state={nodeState}>
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Step Content ────────────────────────────────────────────────── */}
            <div className={styles.stepContent}>
              {currentStep === 0 && (
                <Step1Product
                  selectedProduct={selectedProduct}
                  onSelect={(prod) => {
                    setSelectedProduct(prod);
                    setPlan(prev => ({ ...prev, maxMembers: String(prod.maxMembers) }));
                  }}
                  onRequestProduct={() => setRequestDialogOpen(true)}
                />
              )}

              {currentStep === 1 && selectedProduct && (
                <Step2Plan
                  product={selectedProduct}
                  plan={plan}
                  onChange={(patch) => setPlan((prev) => ({ ...prev, ...patch }))}
                />
              )}

              {currentStep === 2 && selectedProduct && (
                <Step3Pricing
                  product={selectedProduct}
                  price={price}
                  onChange={setPrice}
                />
              )}

              {currentStep === 3 && (
                <Step4Verification
                  uploadStates={uploadStates}
                  onUploadStateChange={handleUploadStateChange}
                />
              )}

              {currentStep === 4 && selectedProduct && (
                <Step5Review
                  product={selectedProduct}
                  plan={plan}
                  price={price}
                  uploadStates={uploadStates}
                  publishLoading={publishLoading}
                  publishError={publishError}
                  user={user}
                />
              )}
            </div>

            {/* ── Footer ──────────────────────────────────────────────────────── */}
            <div className={styles.wizardFooter}>
              <button
                className={styles.btnPrev}
                disabled={currentStep === 0 || publishLoading}
                onClick={handlePrev}
                id="wizard-prev-btn"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                className={currentStep === 4 ? styles.btnPublish : styles.btnNext}
                disabled={!canGoNext}
                onClick={handleNext}
                id="wizard-next-btn"
              >
                {nextLabel}
                {currentStep < 4 && <ChevronRight size={16} />}
              </button>
            </div>
          </>
        )}
      </Dialog>

      {/* ── Request Product Dialog ─────────────────────────────────────────── */}
      <RequestProductDialog
        open={requestDialogOpen}
        onClose={() => setRequestDialogOpen(false)}
      />

      {/* ── Publish Success Modal ──────────────────────────────────────────── */}
      <PublishSuccessModal
        open={successOpen}
        listingId={publishedId}
        onClose={() => setSuccessOpen(false)}
      />
    </>
  );
}

export default CreateListingModal;
