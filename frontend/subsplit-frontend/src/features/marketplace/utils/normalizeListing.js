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

  const providerName = backendItem.subscription?.providerName || 'Subscription';
  const themeKey = providerName.toLowerCase();
  const theme = PROVIDER_THEMES[themeKey] || { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' };

  const hostName = backendItem.host?.name || 'Verified Host';
  const initials = hostName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'VH';

  const monthlyPrice = backendItem.plan?.monthlyPrice || (backendItem.seatPrice ? Number(backendItem.seatPrice) * 3 : null);
  const seatPrice = Number(backendItem.seatPrice) || 0;

  let savingsPercent = backendItem.savingsPercent;
  if (!savingsPercent && monthlyPrice && monthlyPrice > seatPrice) {
    savingsPercent = Math.round(((monthlyPrice - seatPrice) / monthlyPrice) * 100);
  }

  return {
    id: String(backendItem.id),
    rawId: backendItem.id,
    title: backendItem.title || `${providerName} Family Slot`,
    platform: providerName,
    category: backendItem.subscription?.categoryName || 'OTT',
    price: seatPrice,
    originalPrice: monthlyPrice ? Number(monthlyPrice) : null,
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
    memberCount: (backendItem.totalSeats || 4) - (backendItem.availableSeats || 1),
    createdAt: backendItem.createdAt || new Date().toISOString(),
    iconColor: theme.color,
    iconBg: theme.bg,
    billingCycle: backendItem.billingCycle ? backendItem.billingCycle.toLowerCase() : 'monthly',
    renewalDate: backendItem.expiryDate || 'Next month',
    description: backendItem.description || `Join a verified ${providerName} subscription group. Dedicated screen profile with full feature access.`,
    features: ['Instant Access', 'Ad-Free Experience', 'Dedicated Profile', 'Multi-Device Support', 'Escrow Protected'],
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
};
