import { useState, useContext } from 'react';
import { createPortal } from 'react-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

// ProductCard and ProductModal
// - `ProductCard` shows a compact product summary with quick actions.
// - `ProductModal` renders a full product view in a portal when requested.
// Helper function to format price values to Philippine Peso format
const fmt = (v) =>
  '₱' + parseFloat(v).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Helper function to get category-specific product description
const getCategoryDescription = (category) => {
  if (!category) return '';
  const c = category.toLowerCase();
  if (c.includes('electronic'))
    return 'High-quality electronic device featuring cutting-edge technology. Designed for durability and peak performance, offering exceptional value with modern features.';
  if (c.includes("men's clothing"))
    return "Premium men's fashion crafted from quality materials. Tailored for style and comfort, suitable for both casual and semi-formal occasions.";
  if (c.includes("women's clothing"))
    return "Elegant women's fashion piece made from carefully selected fabrics. Combines comfort with contemporary design, perfect for everyday wear or special occasions.";
  if (c.includes('jewel'))
    return 'Exquisite jewelry piece crafted with exceptional attention to detail. Made from high-quality materials, adds elegance to any outfit.';
  return "Premium quality product carefully selected for Bill's. Backed by our buyer protection guarantee and fast delivery.";
};

// Helper function to get category-specific product features list
const getFeatures = (category) => {
  if (!category) return [];
  const c = category.toLowerCase();
  if (c.includes('electronic')) return ['1-Year Warranty', 'Free Tech Support', 'Certified Authentic', 'Fast Delivery'];
  if (c.includes('clothing') || c.includes('men') || c.includes('women'))
    return ['Premium Material', 'Comfortable Fit', 'Machine Washable', 'Multiple Sizes'];
  if (c.includes('jewel')) return ['Authentic Material', 'Elegant Design', 'Gift-Ready Packaging', 'Quality Certified'];
  return ['Quality Guaranteed', 'Fast Delivery', 'Easy Returns', 'Buyer Protection'];
};

/* ── Product View Modal ────────────────────────────────────── */
// Modal component for displaying detailed product information
const ProductModal = ({ product, onClose, onAddToCart }) => {
  // State for add to cart button feedback
  const [added, setAdded] = useState(false);
  // Get wishlist context methods and data
  const { toggleWishlist, isWishlisted } = useContext(WishlistContext);
  // Check if current product is wishlisted
  const wishlisted  = isWishlisted(product.id);
  // Get category-specific features and description
  const features    = getFeatures(product.category);
  const description = product.description || getCategoryDescription(product.category);

  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';

  // Handle adding product to cart with feedback animation
  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  // Handle closing modal and restoring body scroll
  const handleClose = () => {
    document.body.style.overflow = '';
    onClose();
  };

  const modal = (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.84)',
        zIndex: 999999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={handleClose}
    >
      {/* Modal Card - white background with product details */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--card-bg)', color: 'var(--text-dark)',
          borderRadius: 18, maxWidth: 860, width: '100%',
          maxHeight: '90vh',
          border: '1px solid var(--card-border)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
          animation: 'modalIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        {/* Sticky header — title and close button always visible when scrolling */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 14px 8px',
          flexShrink: 0,
          background: 'var(--card-bg)',
          borderBottom: '1px solid var(--card-border)',
          zIndex: 10,
          position: 'sticky', top: 0,
        }}>
          <span className="product-details-label" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--price-color)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif" }}>
            <i className="bi bi-eye-fill me-1"></i>Product Details
          </span>
          <button
            onClick={handleClose}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(128,0,32,0.1)', color: '#800020',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', flexShrink: 0,
            }}
            aria-label="Close"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Scrollable modal content area with product information */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '14px 18px 20px' }}>
          <div className="row g-3 g-md-4">
            {/* Product image with discount badge */}
            <div className="col-12 col-md-5">
              <div style={{
                background: 'var(--bg-section)', borderRadius: 12,
                minHeight: 180, display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '1.25rem', position: 'relative',
              }}>
                {product.discount > 0 && (
                  <span style={{
                    position: 'absolute', top: 10, left: 10,
                    background: '#800020', color: '#fff',
                    fontSize: '0.68rem', padding: '3px 9px',
                    borderRadius: 7, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
                  }}>
                    -{product.discount}% OFF
                  </span>
                )}
                <img src={product.image} alt={product.name}
                  style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            </div>

            {/* Product details - category, name, rating, price, and description */}
            <div className="col-12 col-md-7 d-flex flex-column">
              <span className="badge rounded-pill text-capitalize mb-2 product-details-label"
                style={{ background: 'rgba(128,0,32,0.1)', color: 'var(--price-color)', fontSize: '0.68rem', width: 'fit-content', fontFamily: "'DM Sans', sans-serif" }}>
                {product.category}
              </span>

              <h5 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: 1.35, color: 'var(--text-dark)', marginBottom: 6, fontSize: '1.05rem' }}>
                {product.name}
              </h5>

              <div style={{ color: '#c9a84c', fontSize: '0.83rem', marginBottom: 8 }}>
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa-star ${i < product.rating ? 'fas' : 'far'}`}></i>
                ))}
                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginLeft: 6, fontFamily: "'DM Sans', sans-serif" }}>
                  ({product.rating}/5) · Verified
                </span>
              </div>

              <div style={{ marginBottom: 10 }}>
                <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.82rem', marginRight: 8, fontFamily: "'DM Sans', sans-serif" }}>
                  {fmt(product.oldPrice)}
                </span>
                <span className="product-price-label" style={{ color: 'var(--price-color)', fontSize: '1.4rem', fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>
                  {fmt(product.price)}
                </span>
                {product.discount > 0 && (
                  <span className="badge rounded-pill ms-2"
                    style={{ background: '#800020', color: '#fff', fontSize: '0.62rem', fontFamily: "'DM Sans', sans-serif" }}>
                    Save {fmt(parseFloat(product.oldPrice) - parseFloat(product.price))}
                  </span>
                )}
              </div>

              <div style={{ background: 'var(--bg-section)', border: '1px solid var(--card-border)', borderRadius: 10, padding: '8px 12px', marginBottom: 10 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.7, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  {description}
                </p>
              </div>

              {/* Feature badges — display category-specific product benefits */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                {features.map((f, i) => (
                  <span key={i} className="feature-badge">
                    <i className="bi bi-check2-circle"></i>{f}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(26,154,26,0.07)', border: '1px solid rgba(26,154,26,0.15)', borderRadius: 8, padding: '6px 11px', marginBottom: 14 }}>
                <i className="bi bi-truck" style={{ color: '#1a9a1a' }}></i>
                <span style={{ color: '#1a9a1a', fontSize: '0.78rem', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
                  Free Delivery on this item
                </span>
              </div>

              {/* Action buttons - Add to Cart and Add to Wishlist */}
              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                {/* Add to Cart button */}
                <button
                  onClick={handleAdd}
                  style={{
                    flex: 1, padding: '10px 16px', borderRadius: 50,
                    background: added ? '#1a7a1a' : '#800020',
                    color: '#fff', border: 'none', fontWeight: 700,
                    fontSize: '0.86rem', cursor: 'pointer',
                    transition: 'background 0.28s ease',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <i className={`${added ? 'fas fa-check' : 'fas fa-shopping-cart'} me-2`}></i>
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>
                {/* Add to Wishlist button */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                  style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: wishlisted ? 'rgba(255,232,236,0.97)' : 'rgba(128,0,32,0.08)',
                    border: '1px solid rgba(128,0,32,0.2)',
                    color: '#800020', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.95rem', flexShrink: 0, transition: 'all 0.22s ease',
                  }}
                  title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <i className={`${wishlisted ? 'fas' : 'far'} fa-heart`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

/* ── Product Card ────────────────────────────────────────── */
// Product card component - displays product summary with quick actions
const ProductCard = ({ product, onCompareToggle, isInCompare }) => {
  // State for hover effect and animation feedback
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded]         = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { addToCart }             = useContext(CartContext);
  const { toggleWishlist, isWishlisted } = useContext(WishlistContext);
  const wishlisted = isWishlisted(product.id);

  const trackRecentlyViewed = () => {
    try {
      const key = 'bills_recently_viewed';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = existing.filter(p => p.id !== product.id);
      localStorage.setItem(key, JSON.stringify([product, ...filtered].slice(0, 8)));
    } catch (_) {}
  };

  const handleAddToCart = (p) => {
    addToCart(p && p.id ? p : product);
    trackRecentlyViewed();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompare = (e) => {
    e.stopPropagation();
    if (onCompareToggle) onCompareToggle(product);
  };

  const handleView = (e) => {
    if (e) e.stopPropagation();
    trackRecentlyViewed();
    setShowModal(true);
  };

  const handleCardClick = () => {
    trackRecentlyViewed();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    document.body.style.overflow = '';
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <ProductModal product={product} onClose={handleCloseModal} onAddToCart={handleAddToCart} />
      )}

      <div
        className={`bills-card h-100${isInCompare ? ' compare-selected' : ''}`}
        id={`product-${product.id}`}
        style={{ outline: isInCompare ? '2px solid #800020' : 'none' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div className="product-img-wrapper" style={{ position: 'relative' }}>
          {product.discount > 0 && (
            <div className="sale-badge" style={{
              position: 'absolute', top: 10, right: 10,
              color: '#fff', padding: '3px 9px', borderRadius: '7px',
              fontWeight: 700, fontSize: '0.7rem', zIndex: 2, fontFamily: "'DM Sans', sans-serif",
            }}>
              -{product.discount}%
            </div>
          )}

          <button
            className={`wishlist-btn${wishlisted ? ' wishlisted' : ''}`}
            onClick={handleWishlist}
            onTouchEnd={(e) => { e.preventDefault(); handleWishlist(e); }}
            title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
            aria-label={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <i className={`${wishlisted ? 'fas' : 'far'} fa-heart`}
              style={{ color: wishlisted ? '#800020' : '#bbb', fontSize: '0.9rem' }}></i>
          </button>

          {isInCompare && (
            <div style={{
              position: 'absolute', bottom: 8, left: 8,
              background: '#800020', color: '#fff',
              fontSize: '0.6rem', padding: '2px 7px',
              borderRadius: '6px', zIndex: 3, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            }}>
              Comparing
            </div>
          )}

          <img
            src={product.image} className="w-100 d-block" alt={product.name}
            style={{
              objectFit: 'contain', padding: '1.1rem', height: '185px',
              backgroundColor: 'transparent',
              transition: 'transform 0.28s ease',
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            }}
          />

          <div className="quick-view-overlay">
            <button
              className="btn fw-bold px-4 py-2 rounded-pill"
              style={{ background: '#fff', color: '#800020', fontSize: '0.8rem', boxShadow: '0 4px 16px rgba(0,0,0,0.28)', fontFamily: "'DM Sans', sans-serif" }}
              onClick={handleView}
            >
              <i className="bi bi-eye-fill me-2"></i>Quick View
            </button>
          </div>
        </div>

        <div className="product-card-body p-3 d-flex flex-column">
          <p className="fw-bold mb-1 text-truncate" title={product.name}
            style={{ fontSize: '0.8rem', color: 'var(--text-dark)', lineHeight: 1.35, fontFamily: "'DM Sans', sans-serif" }}>
            {product.name}
          </p>
          <div className="mb-1" style={{ color: '#c9a84c', fontSize: '0.68rem' }}>
            {[...Array(5)].map((_, i) => (
              <i key={i} className={`fa-star ${i < product.rating ? 'fas' : 'far'}`}></i>
            ))}
          </div>
          <div className="mb-2">
            <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '0.68rem', marginRight: 3, fontFamily: "'DM Sans', sans-serif" }}>
              {fmt(product.oldPrice)}
            </span>
            <span className="product-price-label" style={{ color: 'var(--price-color)', fontSize: '0.92rem', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
              {fmt(product.price)}
            </span>
          </div>
          <div className="mt-auto">
            <button
              className="btn btn-sm fw-bold rounded-pill w-100"
              onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
              style={{
                background: added ? '#1a7a1a' : '#800020',
                color: '#fff', fontSize: '0.75rem', border: 'none',
                transition: 'background 0.28s ease', fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <i className={`${added ? 'fas fa-check' : 'fas fa-shopping-cart'} me-1`}></i>
              {added ? 'Added!' : 'Add to Cart'}
            </button>
          </div>
          {onCompareToggle && (
            <button
              className={`btn btn-sm mt-2 w-100 rounded-pill btn-compare-card${isInCompare ? ' active' : ''}`}
              onClick={handleCompare}
            >
              {/* Changed icon from bi-arrows-angle-expand to bi-bar-chart-line for "compare" */}
              <i className={`bi ${isInCompare ? 'bi-x-circle' : 'bi-bar-chart-line'} me-1`}></i>
              {isInCompare ? 'Remove' : 'Compare'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
