/**
 * TEMPORARY MOCK CATALOG
 * -----------------------
 * Wire to GET /api/catalog/subscriptions once the backend circular-reference
 * serialization bug is fixed (Subscription ↔ SubscriptionPlan infinite nesting).
 * See: CatalogController.java → CatalogServiceImpl.java
 *
 * Shape matches: { id, name, category, accessMethod, maxMembers, subtitle,
 *                  recommendedPrice, brandColor, initials }
 */

export const CATALOG_CATEGORIES = [
  'All',
  'Design',
  'Productivity',
  'Cloud Storage',
  'Security',
  'Developer Tools',
];

export const MOCK_CATALOG = [
  // ── Design ──────────────────────────────────────────────────────────────────
  {
    id: 'canva-teams',
    name: 'Canva Teams',
    category: 'Design',
    accessMethod: 'Invite via Email',
    maxMembers: 5,
    subtitle: 'Design & branding suite for teams',
    recommendedPrice: 299,
    brandColor: '#EC4899',
    initials: 'CT',
  },
  {
    id: 'figma-professional',
    name: 'Figma Professional',
    category: 'Design',
    accessMethod: 'Invite via Email',
    maxMembers: 5,
    subtitle: 'Collaborative interface design',
    recommendedPrice: 399,
    brandColor: '#A855F7',
    initials: 'FP',
  },
  {
    id: 'adobe-creative',
    name: 'Adobe Creative Cloud',
    category: 'Design',
    accessMethod: 'Shared Login',
    maxMembers: 2,
    subtitle: 'Full creative suite (Ps, Ai, Pr)',
    recommendedPrice: 499,
    brandColor: '#EF4444',
    initials: 'AC',
  },

  // ── Productivity ─────────────────────────────────────────────────────────────
  {
    id: 'notion-team',
    name: 'Notion Team',
    category: 'Productivity',
    accessMethod: 'Invite via Email',
    maxMembers: 10,
    subtitle: 'All-in-one workspace for teams',
    recommendedPrice: 199,
    brandColor: '#F3F4F6',
    initials: 'NT',
  },
  {
    id: 'slack-pro',
    name: 'Slack Pro',
    category: 'Productivity',
    accessMethod: 'Invite via Email',
    maxMembers: 15,
    subtitle: 'Team messaging and collaboration',
    recommendedPrice: 249,
    brandColor: '#F59E0B',
    initials: 'SP',
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    category: 'Productivity',
    accessMethod: 'Shared Login',
    maxMembers: 2,
    subtitle: 'GPT-4 AI assistant',
    recommendedPrice: 399,
    brandColor: '#14B8A6',
    initials: 'CP',
  },

  // ── Cloud Storage ────────────────────────────────────────────────────────────
  {
    id: 'google-one',
    name: 'Google One',
    category: 'Cloud Storage',
    accessMethod: 'Invite via Email',
    maxMembers: 5,
    subtitle: '2 TB cloud storage family plan',
    recommendedPrice: 149,
    brandColor: '#3B82F6',
    initials: 'GO',
  },
  {
    id: 'dropbox-plus',
    name: 'Dropbox Plus',
    category: 'Cloud Storage',
    accessMethod: 'Invite via Email',
    maxMembers: 3,
    subtitle: '2 TB + smart sync across devices',
    recommendedPrice: 299,
    brandColor: '#06B6D4',
    initials: 'DP',
  },

  // ── Security ─────────────────────────────────────────────────────────────────
  {
    id: '1password-families',
    name: '1Password Families',
    category: 'Security',
    accessMethod: 'Shared Login',
    maxMembers: 5,
    subtitle: 'Password manager for families',
    recommendedPrice: 149,
    brandColor: '#3B82F6',
    initials: '1P',
  },
  {
    id: 'nordpass-family',
    name: 'NordPass Family',
    category: 'Security',
    accessMethod: 'Shared Login',
    maxMembers: 6,
    subtitle: 'Password & vault manager',
    recommendedPrice: 129,
    brandColor: '#3B82F6',
    initials: 'NP',
  },
  {
    id: 'bitdefender-family',
    name: 'Bitdefender Family',
    category: 'Security',
    accessMethod: 'Shared Login',
    maxMembers: 6,
    subtitle: 'Antivirus for up to 15 devices',
    recommendedPrice: 199,
    brandColor: '#22C55E',
    initials: 'BF',
  },

  // ── Developer Tools ──────────────────────────────────────────────────────────
  {
    id: 'github-team',
    name: 'GitHub Team',
    category: 'Developer Tools',
    accessMethod: 'Invite via Email',
    maxMembers: 10,
    subtitle: 'Private repos & team tools',
    recommendedPrice: 249,
    brandColor: '#F3F4F6',
    initials: 'GT',
  },
  {
    id: 'jetbrains-all',
    name: 'JetBrains All Products',
    category: 'Developer Tools',
    accessMethod: 'Invite via Email',
    maxMembers: 5,
    subtitle: 'IDE suite for developers',
    recommendedPrice: 349,
    brandColor: '#F59E0B',
    initials: 'JA',
  },
];
