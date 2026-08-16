import React from 'react';
import ZohoImg from '../../../assets/images/zoho_logo.png';

/* ── Netflix ── */
export function NetflixLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Netflix">
      <rect width="32" height="32" rx="8" fill="#E50914" />
      <path d="M10 7h3.5l4.5 11.5V7H21v18h-3.2L13 13.8V25h-3V7z" fill="#fff" />
    </svg>
  );
}

/* ── Spotify ── */
export function SpotifyLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Spotify">
      <rect width="32" height="32" rx="8" fill="#1DB954" />
      <path d="M22.5 15.2c-3.8-2.3-10.1-2.5-13.7-1.4-.6.2-1.2-.2-1.3-.7-.2-.6.2-1.2.7-1.3 4.2-1.3 11.1-1 15.5 1.6.5.3.7 1 .4 1.5-.3.4-1 .6-1.6.3z" fill="#fff" />
      <path d="M21.2 18c-3.2-1.9-8-2.5-11.8-1.4-.5.1-1-.1-1.2-.6-.1-.5.1-1 .6-1.2 4.3-1.3 9.7-.7 13.4 1.6.4.3.6.9.3 1.3-.3.4-.9.5-1.3.3z" fill="#fff" />
      <path d="M20.1 20.7c-2.7-1.6-6.2-2-9.2-1.1-.4.1-.8-.1-.9-.5-.1-.4.1-.8.5-.9 3.3-1 7.2-.5 10.3 1.3.4.2.5.7.2 1.1-.2.3-.6.4-.9.1z" fill="#fff" />
    </svg>
  );
}

/* ── YouTube ── */
export function YouTubeLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="YouTube">
      <rect width="32" height="32" rx="8" fill="#FF0000" />
      <path d="M25.5 12.5c-.3-1-1-1.8-2-2C22 10 16 10 16 10s-6 0-7.5.5c-1 .2-1.7 1-2 2C6 14 6 16 6 16s0 2 .5 3.5c.3 1 1 1.8 2 2C10 22 16 22 16 22s6 0 7.5-.5c1-.2 1.7-1 2-2 .5-1.5.5-3.5.5-3.5s0-2-.5-3.5z" fill="#fff" />
      <path d="M14 19.5V13l5 3.25L14 19.5z" fill="#FF0000" />
    </svg>
  );
}

/* ── ChatGPT ── */
export function ChatGPTLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ChatGPT">
      <rect width="32" height="32" rx="8" fill="#10A37F" />
      <path d="M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 13.5c-1.2 0-2.3-.4-3.2-1l.5-1c.7.5 1.6.8 2.7.8 2.5 0 4.5-2 4.5-4.5S18.5 11.4 16 11.4c-2 0-3.7 1.3-4.3 3.1h2.1l-2.5 3-2.5-3h1.8c.6-2.6 2.9-4.5 5.4-4.5 3.1 0 5.6 2.6 5.6 5.7 0 3-2.5 5.3-5.6 5.3z" fill="#fff" />
    </svg>
  );
}

/* ── Prime Video ── */
export function PrimeLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Prime Video">
      <rect width="32" height="32" rx="8" fill="#00A8E1" />
      <path d="M10 18.5c2.5 2.2 6 3.2 9.5 2.5.5-.1 1-.2 1.5-.4l1 1.2c-3.8 1.7-8.2 1.3-12-1.3v-2z" fill="#FF9900" />
      <path d="M14 13.5V19h-2v-8h1.8l3.7 5.2V11h2v8h-1.8L14 13.5z" fill="#fff" />
    </svg>
  );
}

/* ── Microsoft 365 ── */
export function MicrosoftLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Microsoft 365">
      <rect width="32" height="32" rx="8" fill="#2B2B2B" />
      <rect x="8" y="8" width="7" height="7" rx="1" fill="#F25022" />
      <rect x="17" y="8" width="7" height="7" rx="1" fill="#7FBA00" />
      <rect x="8" y="17" width="7" height="7" rx="1" fill="#00A4EF" />
      <rect x="17" y="17" width="7" height="7" rx="1" fill="#FFB900" />
    </svg>
  );
}

/* ── Zoho ── */
export function ZohoLogo({ size = 32 }) {
  return <img src={ZohoImg} width={size} height={size} alt="Zoho" style={{ objectFit: 'contain', display: 'block' }} />;
}

/* ── Logo map for data-driven rendering ── */
const LOGO_MAP = {
  netflix: NetflixLogo,
  spotify: SpotifyLogo,
  youtube: YouTubeLogo,
  chatgpt: ChatGPTLogo,
  prime: PrimeLogo,
  microsoft: MicrosoftLogo,
  zoho: ZohoLogo,
};

export function ServiceLogo({ logoKey, size = 32 }) {
  const LogoComponent = LOGO_MAP[logoKey];
  if (!LogoComponent) return null;
  return <LogoComponent size={size} />;
}

export default LOGO_MAP;
