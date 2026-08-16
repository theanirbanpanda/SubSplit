import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Search, Check, Mail, Users } from 'lucide-react';
import { MOCK_CATALOG, CATALOG_CATEGORIES } from '../../data/mockCatalog';
import { getBrandLogoUrl } from '../../utils/brandLogos';
import styles from './CreateListingWizard.module.scss';

/** How many cards to load per batch (one grid row = 2 cards). */
const BATCH_SIZE = 8;
const BATCH_INCREMENT = 2;

/**
 * Step 1 — Select Product
 * Infinite-scroll version: loads BATCH_INCREMENT more cards whenever the
 * sentinel element at the bottom of the list enters the viewport.
 *
 * Props:
 *   selectedProduct: object | null — currently selected catalog product
 *   onSelect: (product) => void
 *   onRequestProduct: () => void — opens the Request Product dialog
 */
function Step1Product({ selectedProduct, onSelect, onRequestProduct }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [dbLogosMap, setDbLogosMap] = useState([]);

  useEffect(() => {
    const fetchDbCatalog = async () => {
      try {
        const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
        const apiUrl = rawApiUrl.replace(/\/v1\/?$/, '');
        const response = await fetch(`${apiUrl}/catalog/subscriptions`);
        if (response.ok) {
          const data = await response.json();
          // Create map of { providerName: logoUrl }
          const map = data.map(sub => ({
            keyword: sub.providerName.toLowerCase().replace(' business', '').replace(' premium', '').trim(),
            logoUrl: `${apiUrl}/catalog/subscriptions/${sub.id}/logo`
          }));
          
          // Add some manual aliases for tricky mock catalog names
          map.push({ keyword: 'adobe', logoUrl: map.find(m => m.keyword.includes('adobe'))?.logoUrl });
          map.push({ keyword: 'google workspace', logoUrl: map.find(m => m.keyword.includes('google'))?.logoUrl });
          
          setDbLogosMap(map);
        }
      } catch (err) {
        console.error("Failed to fetch DB logos:", err);
      }
    };
    fetchDbCatalog();
  }, []);

  // Reset pagination whenever filter or search changes
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setVisibleCount(BATCH_SIZE);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setVisibleCount(BATCH_SIZE);
  };

  /** Full filtered list — searches across the entire catalog. */
  const filtered = useMemo(() => {
    return MOCK_CATALOG.filter((p) => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  // When searching show all results; otherwise paginate
  const isSearching = search.trim().length > 0;
  const visible = isSearching ? filtered : filtered.slice(0, visibleCount);
  const hasMore = !isSearching && visibleCount < filtered.length;

  // ── Infinite scroll sentinel ─────────────────────────────────────────────────
  const sentinelRef = useRef(null);

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + BATCH_INCREMENT, filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div>
      <h2 className={styles.stepHeading}>Select a Product</h2>
      <p className={styles.stepDescription}>
        Search our verified catalog. Listings must be based on a real, verifiable subscription
        product — you can't create a custom or unlisted one.
      </p>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search size={16} />
        <input
          className={styles.searchInput}
          placeholder="Search product name or category..."
          value={search}
          onChange={handleSearchChange}
          id="wizard-product-search"
          autoComplete="off"
        />
      </div>

      {/* Category Chips */}
      <div className={styles.categoryChips}>
        {CATALOG_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={styles.chip}
            data-active={activeCategory === cat ? 'true' : 'false'}
            onClick={() => handleCategoryChange(cat)}
            id={`wizard-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid or Empty State */}
      {filtered.length > 0 ? (
        <>
          <div className={styles.productGrid}>
            {visible.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isSelected={selectedProduct?.id === p.id}
              onSelect={onSelect}
              dbLogosMap={dbLogosMap}
            />
          ))}
          </div>

          {/* Infinite scroll sentinel — invisible, triggers when scrolled into view */}
          {hasMore && (
            <div ref={sentinelRef} className={styles.scrollSentinel} aria-hidden="true" />
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          No matching subscription found.
        </div>
      )}

      {/* Request Product */}
      <button
        className={styles.requestProductBtn}
        onClick={onRequestProduct}
        id="wizard-request-product"
      >
        <Search size={14} />
        Can't find your subscription? Request Product
      </button>
    </div>
  );
}

function ProductCard({ product, isSelected, onSelect, dbLogosMap }) {
  const { name, category, accessMethod, subtitle, brandColor, initials } = product;
  const isEmail = accessMethod === 'Invite via Email';
  const tileBg = `${brandColor}28`;
  
  // Find matching DB logo
  const productNameLower = name.toLowerCase();
  const dbLogoMatch = dbLogosMap.find(m => m.keyword && productNameLower.includes(m.keyword));
  const finalLogoUrl = dbLogoMatch ? dbLogoMatch.logoUrl : getBrandLogoUrl(name);

  return (
    <div
      className={styles.productCard}
      data-selected={isSelected ? 'true' : 'false'}
      onClick={() => onSelect(product)}
      id={`wizard-product-${product.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(product); }}
    >
      {isSelected && (
        <div className={styles.selectedBadge}>
          <Check size={13} color="#fff" strokeWidth={3} />
        </div>
      )}

      <div className={styles.productCardHeader}>
        <div className={styles.logoTile} style={{ background: tileBg, color: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {finalLogoUrl ? (
            <img 
              src={finalLogoUrl} 
              alt={name}
              style={{ width: '60%', height: '60%', objectFit: 'contain' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
            />
          ) : null}
          <div style={{ display: finalLogoUrl ? 'none' : 'flex' }}>
            {initials}
          </div>
        </div>
        <div className={styles.productInfo}>
          <div className={styles.productName}>{name}</div>
          <div className={styles.productCategory}>{category}</div>
        </div>
      </div>

      <div className={styles.productSubtitle}>{subtitle}</div>

      <div className={styles.accessBadge}>
        {isEmail ? <Mail size={10} /> : <Users size={10} />}
        {accessMethod}
      </div>
    </div>
  );
}

export default Step1Product;
