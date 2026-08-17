import { MOCK_CATALOG } from '../data/mockCatalog';
import { MOCK_LISTINGS } from '../data/mockListings';

const PROVIDER_THEMES = {
  netflix: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  spotify: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  chatgpt: { color: '#14b8a6', bg: 'rgba(20,184,166,0.12)' },
  youtube: { color: '#f43f5e', bg: 'rgba(244,63,94,0.12)' },
  canva: { color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
  microsoft: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  playstation: { color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  udemy: { color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
};

export const normalizeListing = (backendItem) => {
  if (!backendItem) return null;

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  const providerName = backendItem.subscription?.providerName || backendItem.providerName || 'Subscription';
  const themeKey = providerName.toLowerCase();
  const theme = PROVIDER_THEMES[themeKey] || { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' };

  const hostName = backendItem.host?.name || backendItem.hostName || 'Verified Host';
  const initials = hostName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'VH';

  const totalSeats = Number(backendItem.totalSeats ?? 4);
  const seatPrice = Number(backendItem.seatPrice ?? backendItem.price ?? 0);

  // Dynamic original price from DB (check all possible backend entity fields)
  let originalPrice = Number(
    backendItem.originalPrice ??
    backendItem.plan?.monthlyPrice ??
    backendItem.plan?.price ??
    backendItem.subscriptionPlan?.monthlyPrice ??
    backendItem.subscriptionPlan?.price ??
    backendItem.subscription?.standardPrice ??
    backendItem.subscription?.price ??
    0
  );

  // If backend didn't provide standard retail price, lookup in catalog / standard provider pricing
  if (!originalPrice || originalPrice <= seatPrice) {
    const catalogItem = MOCK_CATALOG.find(
      (c) => c.name?.toLowerCase().includes(providerName.toLowerCase()) ||
             providerName.toLowerCase().includes(c.name?.toLowerCase())
    );
    if (catalogItem?.recommendedPrice) {
      originalPrice = catalogItem.recommendedPrice * totalSeats;
    } else {
      const mockItem = MOCK_LISTINGS.find(
        (m) => m.platform?.toLowerCase() === providerName.toLowerCase() ||
               m.title?.toLowerCase().includes(providerName.toLowerCase())
      );
      if (mockItem?.originalPrice) {
        originalPrice = mockItem.originalPrice;
      } else if (seatPrice > 0) {
        originalPrice = Math.round(seatPrice * totalSeats);
      }
    }
  }

  // Calculate dynamic savings percent
  let savingsPercent = Number(backendItem.savingsPercent) || 0;
  if (!savingsPercent && originalPrice && originalPrice > seatPrice && seatPrice > 0) {
    savingsPercent = Math.round(((originalPrice - seatPrice) / originalPrice) * 100);
  }

  // Map raw or legacy category names to the exact 6 master categories
  const rawCat = backendItem.subscription?.categoryName || backendItem.category || '';
  let normalizedCategory = 'Multimedia';
  const lowerCat = rawCat.toLowerCase().trim();

  if (lowerCat === 'design' || lowerCat === 'design & creative') {
    normalizedCategory = 'Design & Creative';
  } else if (lowerCat === 'productivity' || lowerCat === 'education' || lowerCat === 'learning') {
    normalizedCategory = 'Productivity';
  } else if (lowerCat === 'cloud storage' || lowerCat === 'cloud') {
    normalizedCategory = 'Cloud Storage';
  } else if (lowerCat === 'security' || lowerCat === 'security & privacy' || lowerCat === 'privacy') {
    normalizedCategory = 'Security & Privacy';
  } else if (lowerCat === 'developer tools' || lowerCat === 'dev tools' || lowerCat === 'ai') {
    normalizedCategory = 'Developer Tools';
  } else if (lowerCat === 'multimedia' || lowerCat === 'multimedia & entertainment' || lowerCat === 'ott' || lowerCat === 'music' || lowerCat === 'gaming' || lowerCat === 'entertainment') {
    normalizedCategory = 'Multimedia';
  } else if (rawCat) {
    normalizedCategory = rawCat;
  }

  const normalized = {
    id: String(backendItem.id),
    rawId: backendItem.id,
    title: backendItem.title || `${providerName} Family Slot`,
    platform: providerName,
    category: normalizedCategory,
    price: seatPrice,
    originalPrice: originalPrice > seatPrice ? Number(originalPrice) : null,
    savingsPercent: savingsPercent || 0,
    seatsLeft: backendItem.availableSeats ?? 1,
    totalSeats: backendItem.totalSeats ?? 4,
    rating: backendItem.host?.rating || 4.9,
    reviewCount: 24,
    hostName: hostName,
    isVerifiedHost: backendItem.isVerifiedHost ?? true,
    isAiVerified: backendItem.isAiVerified ?? true,
    isEscrowProtected: backendItem.isEscrowProtected ?? true,
    isFeatured: true,
    status: backendItem.status || 'ACTIVE',
    memberCount: (backendItem.totalSeats || 4) - (backendItem.availableSeats || 1),
    createdAt: backendItem.createdAt || new Date().toISOString(),
    iconColor: theme.color,
    iconBg: theme.bg,
    billingCycle: backendItem.billingCycle ? String(backendItem.billingCycle).toLowerCase() : 'monthly',
    renewalDate: backendItem.expiryDate || 'Next month',
    description: backendItem.description || `Join a verified ${providerName} subscription group. Dedicated screen profile with full feature access.`,
    quality: backendItem.quality || '4K Ultra HD + HDR',
    devices: backendItem.supportedDevices || '4 Screens (TV, Phone, Laptop)',
    region: backendItem.region || 'India (en-IN)',
    accessMethod: backendItem.accessMethod || 'Instant Email Invite / PIN',
    accountType: backendItem.accountType || 'Legitimate Shared Family Slot',
    supportAvailability: backendItem.supportAvailability || '24/7 Priority Resolution',
    features: backendItem.features && backendItem.features.length ? backendItem.features : ['Instant Access', 'Ad-Free Experience', 'Dedicated Profile', 'Multi-Device Support', 'Escrow Protected'],
    rules: backendItem.rules || [
      'Do not share account login credentials with external parties.',
      'Only log in on approved screens/devices.',
      'Timely monthly renewals to maintain active slot.',
      'Respect other group profile settings.'
    ],
    occupants: backendItem.occupants || [],
    reviewSummary: backendItem.reviewSummary || null,
    aiProofType: backendItem.aiProofType || 'Subscription Invoice',
    aiValidationStatus: backendItem.aiValidationStatus || 'PASSED',
    host: {
      id: backendItem.host?.id,
      name: hostName,
      initials: initials,
      avatarBg: '#2563eb',
      isKycVerified: backendItem.host?.isKycVerified ?? true,
      rating: backendItem.host?.rating || 4.9,
      successfulGroups: backendItem.host?.successfulGroups || 10,
      responseTime: '< 15 mins',
      memberSince: 'Jan 2024',
      bio: backendItem.host?.bio || 'Verified SubSplit super host managing active family subscription groups.',
    },
  };
  
  // Use DB binary logo endpoint if subscription ID is present, fallback to CDN URL
  if (backendItem.subscription?.id) {
    const catalogBaseUrl = apiUrl.replace(/\/v1\/?$/, '');
    normalized.logoUrl = `${catalogBaseUrl}/catalog/subscriptions/${backendItem.subscription.id}/logo`;
  } else {
    normalized.logoUrl = backendItem.subscription?.logoUrl;
  }
  
  return normalized;
};

