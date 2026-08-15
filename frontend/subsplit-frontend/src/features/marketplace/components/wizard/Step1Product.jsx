import React, { useState, useMemo } from 'react';
import { Search, Check, Mail, Users } from 'lucide-react';
import { MOCK_CATALOG, CATALOG_CATEGORIES } from '../../data/mockCatalog';
import styles from './CreateListingWizard.module.scss';

/**
 * Step 1 — Select Product
 * Renders the product catalog with search + category filter chips.
 * Props:
 *   selectedProduct: object | null — currently selected catalog product
 *   onSelect: (product) => void
 *   onRequestProduct: () => void — opens the Request Product dialog
 */
function Step1Product({ selectedProduct, onSelect, onRequestProduct }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

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
          placeholder="Search product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            onClick={() => setActiveCategory(cat)}
            id={`wizard-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className={styles.productGrid}>
          {filtered.map((product) => {
            const isSelected = selectedProduct?.id === product.id;
            return (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={isSelected}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#71717A', fontSize: '0.88rem' }}>
          No products found for "{search}".
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

function ProductCard({ product, isSelected, onSelect }) {
  const { name, category, accessMethod, subtitle, brandColor, initials } = product;
  const isEmail = accessMethod === 'Invite via Email';

  // Make a lighter bg from the brand color
  const tileBg = `${brandColor}28`;

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
        <div className={styles.logoTile} style={{ background: tileBg, color: brandColor }}>
          {initials}
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
