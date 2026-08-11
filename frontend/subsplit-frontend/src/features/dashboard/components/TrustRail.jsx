import React from 'react';
import { ShieldCheck } from 'lucide-react';

/**
 * TrustRail — 4-step horizontal progress rail for join requests.
 *
 * @param {'PENDING'|'CREDENTIALS_SHARED'|'APPROVED'|'REJECTED'} status
 *   The real status enum from the join request object.
 * @param {boolean} [hostView=false]
 *   When true, PENDING maps to step 1 (Escrow Locked active) because from the
 *   host's perspective the escrow is already locked by the time they see the request.
 *   On the buyer side (hostView=false) PENDING maps to step 0 (Requested active).
 */

const STEPS = [
  { label: 'Requested' },
  { label: 'Escrow\nLocked' },
  { label: 'Access\nShared' },
  { label: 'Verified &\nProtected' },
];

/**
 * Maps real status → active step index (0-based). -1 = error/rejected.
 */
function statusToActiveStep(status, hostView = false) {
  switch (status) {
    case 'PENDING':            return hostView ? 1 : 0;
    case 'CREDENTIALS_SHARED': return 2;
    case 'APPROVED':           return 3;
    case 'REJECTED':           return -1;
    default:                   return 0;
  }
}

const TrustRail = ({ status, hostView = false }) => {
  const isRejected = status === 'REJECTED';
  const activeStep = statusToActiveStep(status, hostView);

  return (
    <div style={{ position: 'relative', padding: '8px 0 4px' }}>
      {/* Connecting line — background (grey) */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          left: 'calc(12.5%)',
          right: 'calc(12.5%)',
          height: 2,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 1,
        }}
      />

      {/* Connecting line — filled (green progress) */}
      {!isRejected && activeStep > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 18,
            left: 'calc(12.5%)',
            width: `${(activeStep / (STEPS.length - 1)) * 75}%`,
            height: 2,
            background: '#22c55e',
            borderRadius: 1,
            transition: 'width 0.4s ease',
          }}
        />
      )}

      {/* Steps row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
        }}
      >
        {STEPS.map((step, idx) => {
          const isDone = !isRejected && idx <= activeStep;
          const isCurrent = !isRejected && idx === activeStep;
          const isLast = idx === STEPS.length - 1;

          let dotBg = 'rgba(255,255,255,0.08)';
          let dotBorder = 'rgba(255,255,255,0.15)';
          let labelColor = 'rgba(255,255,255,0.35)';
          let dotContent = null;

          if (isRejected && idx === 0) {
            dotBg = 'rgba(239,68,68,0.2)';
            dotBorder = '#ef4444';
            labelColor = '#ef4444';
          } else if (isDone) {
            if (isCurrent && isLast) {
              // Final step active — amber/gold dot with shield icon
              dotBg = '#f59e0b';
              dotBorder = '#f59e0b';
              labelColor = '#f59e0b';
              dotContent = <ShieldCheck size={10} color="#1a1a1a" strokeWidth={2.5} />;
            } else if (isCurrent) {
              dotBg = '#22c55e';
              dotBorder = '#22c55e';
              labelColor = '#22c55e';
            } else {
              // Previously completed step
              dotBg = '#22c55e';
              dotBorder = '#22c55e';
              labelColor = 'rgba(34,197,94,0.7)';
            }
          }

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {/* Dot */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: dotBg,
                  border: `2px solid ${dotBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  flexShrink: 0,
                  boxShadow: isDone && !isRejected ? `0 0 8px ${isCurrent && isLast ? 'rgba(245,158,11,0.5)' : 'rgba(34,197,94,0.4)'}` : 'none',
                }}
              >
                {dotContent}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: isCurrent ? 700 : 500,
                  color: labelColor,
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.3,
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrustRail;
