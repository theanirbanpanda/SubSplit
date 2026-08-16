import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, CircularProgress, Alert } from '@mui/material';
import { X, PackagePlus } from 'lucide-react';
import styles from './CreateListingWizard.module.scss';
import { submitProductRequestApi } from '../../api/productRequestApi';

const CATEGORIES = [
  'Design & Creative',
  'Productivity',
  'Cloud Storage',
  'Security & Privacy',
  'Developer Tools',
  'Multimedia',
  'Other',
];

/**
 * RequestProductDialog — wired to POST /api/v1/product-requests
 * Sends request to the backend; the admin team reviews it.
 * The user gets an in-app notification when approved/rejected.
 */
function RequestProductDialog({ open, onClose }) {
  const [form, setForm] = useState({
    productName: '',
    websiteUrl: '',
    category: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.productName.trim()) return;
    setLoading(true);
    try {
      await submitProductRequestApi({
        productName: form.productName.trim(),
        websiteUrl: form.websiteUrl.trim() || undefined,
        category: form.category || undefined,
        description: form.description.trim() || undefined,
      });
      setSnack({
        open: true,
        message: "Request submitted! You'll get a notification once it's reviewed.",
        severity: 'success',
      });
      setForm({ productName: '', websiteUrl: '', category: '', description: '' });
      onClose();
    } catch (err) {
      setSnack({
        open: true,
        message: err?.response?.data?.message || 'Failed to submit request. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{ className: styles.dialogPaper }}
      >
        <DialogTitle className={styles.dialogTitle}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PackagePlus size={18} color="#3b82f6" />
            Request a Product
            <button
              onClick={onClose}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#A1A1AA',
                display: 'flex',
                padding: 0,
              }}
            >
              <X size={18} />
            </button>
          </span>
        </DialogTitle>

        <DialogContent className={styles.dialogContent}>
          <p style={{ fontSize: '0.8rem', color: '#71717A', marginBottom: 16, lineHeight: 1.5 }}>
            Can't find your subscription? Let us know and we'll add it to the catalog. You'll get a notification once reviewed.
          </p>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="rp-name">Product Name *</label>
            <input
              id="rp-name"
              className={styles.formInput}
              placeholder="e.g. Notion Enterprise"
              value={form.productName}
              onChange={handleChange('productName')}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="rp-category">Category</label>
            <select
              id="rp-category"
              className={styles.formInput}
              value={form.category}
              onChange={handleChange('category')}
              disabled={loading}
              style={{ appearance: 'auto', cursor: 'pointer' }}
            >
              <option value="" style={{ background: '#1E1E24' }}>Select a category…</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ background: '#1E1E24' }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="rp-website">Official Website</label>
            <input
              id="rp-website"
              className={styles.formInput}
              placeholder="https://..."
              type="url"
              value={form.websiteUrl}
              onChange={handleChange('websiteUrl')}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label className={styles.formLabel} htmlFor="rp-desc">Why do you need it?</label>
            <textarea
              id="rp-desc"
              className={styles.formInput}
              placeholder="Tell us about your use case or why this should be added…"
              value={form.description}
              onChange={handleChange('description')}
              disabled={loading}
              rows={3}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>
        </DialogContent>

        <DialogActions className={styles.dialogActions}>
          <button className={styles.btnSecondary} onClick={onClose} disabled={loading} id="rp-cancel">
            Cancel
          </button>
          <button
            className={styles.btnPrimary}
            onClick={handleSubmit}
            disabled={!form.productName.trim() || loading}
            id="rp-submit"
            style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 130 }}
          >
            {loading ? <CircularProgress size={14} color="inherit" /> : null}
            {loading ? 'Submitting…' : 'Submit Request'}
          </button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((p) => ({ ...p, open: false }))}
          sx={{ borderRadius: '10px', fontWeight: 700 }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default RequestProductDialog;
