import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';
import { X } from 'lucide-react';
import styles from './CreateListingWizard.module.scss';

const CATEGORIES = ['Design', 'Productivity', 'Cloud Storage', 'Security', 'Developer Tools', 'Other'];

/**
 * RequestProductDialog — frontend-only
 * On submit, shows a snackbar success message only.
 * Does NOT call any backend — no endpoint for product requests exists yet.
 *
 * TODO: Wire to a real backend endpoint when built, e.g.:
 *   POST /catalog/product-requests  { name, website, category }
 */
function RequestProductDialog({ open, onClose }) {
  const [form, setForm] = useState({ name: '', website: '', category: 'Design' });
  const [snackOpen, setSnackOpen] = useState(false);

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    // Frontend-only: no backend call
    setSnackOpen(true);
    setForm({ name: '', website: '', category: 'Design' });
    onClose();
  };

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

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
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Request a Product
            <button
              onClick={onClose}
              style={{
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
            Can't find your subscription? Let us know and we'll add it to the catalog.
          </p>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="rp-name">Product Name *</label>
            <input
              id="rp-name"
              className={styles.formInput}
              placeholder="e.g. Figma Enterprise"
              value={form.name}
              onChange={handleChange('name')}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="rp-website">Official Website</label>
            <input
              id="rp-website"
              className={styles.formInput}
              placeholder="https://..."
              type="url"
              value={form.website}
              onChange={handleChange('website')}
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label className={styles.formLabel} htmlFor="rp-category">Category</label>
            <select
              id="rp-category"
              className={styles.formInput}
              value={form.category}
              onChange={handleChange('category')}
              style={{ appearance: 'auto', cursor: 'pointer' }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ background: '#1E1E24' }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </DialogContent>

        <DialogActions className={styles.dialogActions}>
          <button className={styles.btnSecondary} onClick={onClose} id="rp-cancel">
            Cancel
          </button>
          <button
            className={styles.btnPrimary}
            onClick={handleSubmit}
            disabled={!form.name.trim()}
            id="rp-submit"
          >
            Submit Request
          </button>
        </DialogActions>
      </Dialog>

      {/* Success snackbar — frontend only */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message="Request submitted! We'll review and add it to the catalog soon."
        ContentProps={{
          className: styles.snackbarSuccess,
          sx: {
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: '#22C55E',
            fontWeight: 700,
            borderRadius: '10px',
          },
        }}
      />
    </>
  );
}

export default RequestProductDialog;
