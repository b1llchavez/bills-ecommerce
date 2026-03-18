
import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';

// ProductList page: fetches products, applies filters/sorting, and
// supports infinite-loading and a compare feature (modal + compare bar).

const fmt = (v) =>
  '₱' + parseFloat(v).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const getCategoryDescription = (category) => {
  if (!category) return "Premium quality product carefully selected for Bill's.";
  const c = category.toLowerCase();
  if (c.includes('electronic')) return 'Cutting-edge electronic device with modern features and premium build quality.';
  if (c.includes("men's")) return "Premium men's fashion crafted for style and everyday comfort.";
  if (c.includes("women's")) return "Elegant women's fashion combining contemporary design with comfort.";
  if (c.includes('jewel')) return 'Exquisite jewelry crafted with exceptional attention to detail.';
  return "Premium quality product backed by our buyer protection guarantee.";
};

const SkeletonCard = () => (
  <div className="bills-card h-100">
    <div className="skeleton skeleton-img w-100"></div>
    <div className="p-3">
      <div className="skeleton skeleton-text w-75 mb-2"></div>
      <div className="skeleton skeleton-text w-50 mb-3"></div>
      <div className="skeleton skeleton-btn w-100"></div>
    </div>
  </div>
);

const ITEMS_PER_PAGE = 8;

const toPHP = (usdPrice, category) => {
  const c = (category || '').toLowerCase();
  let rate = 58;
  if (c.includes('electronic')) rate = 60;
  if (c.includes('jewel')) rate = 62;
  if (c.includes('clothing') || c.includes('men') || c.includes('women')) rate = 55;
  return (parseFloat(usdPrice) * rate).toFixed(2);
};

/* ── Compare Modal ───────────────────────────────────────── */
const CompareModal = ({ compareList, onClose, onRemove }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const colCount = compareList.length;

  const rows = [
    { label: 'Category', key: 'category', render: (p) => <span className="text-capitalize" style={{ fontSize: '0.74rem', color: 'var(--text-dark)', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.02em' }}>{p.category}</span> },
    { label: 'Price',    key: 'price',    render: (p) => <strong className="product-price-label" style={{ color: 'var(--price-color)', fontSize: '0.92rem', fontFamily: "'DM Sans', sans-serif" }}>{fmt(p.price)}</strong> },
    { label: 'Was',      key: 'oldPrice', render: (p) => <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.76rem', fontFamily: "'DM Sans', sans-serif" }}>{fmt(p.oldPrice)}</span> },
    { label: 'Discount', key: 'discount', render: (p) => <span className="badge rounded-pill" style={{ background: '#800020', color: '#fff', fontSize: '0.66rem', fontFamily: "'DM Sans', sans-serif" }}>{p.discount}% OFF</span> },
    { label: 'Rating',   key: 'rating',   render: (p) => (
      <span>
        <span style={{ color: '#c9a84c', fontSize: '0.78rem' }}>
          {[...Array(5)].map((_, i) => <i key={i} className={`fa-star ${i < p.rating ? 'fas' : 'far'}`}></i>)}
        </span>
        <small style={{ color: 'var(--text-muted)', marginLeft: 4, fontSize: '0.68rem', fontFamily: "'DM Sans', sans-serif" }}>{p.rating}/5</small>
      </span>
    )},
    { label: 'Desc.',    key: 'description', isDesc: true, render: (p) => (
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif", textAlign: 'left' }}>
        {p.description ? p.description.slice(0, 120) + (p.description.length > 120 ? '…' : '') : getCategoryDescription(p.category)}
      </span>
    )},
  ];

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `90px repeat(${colCount}, 1fr)`,
    width: '100%',
  };
  const gridStyleMobile = `90px repeat(${colCount}, 1fr)`;

  const modal = (
    <div className="compare-modal-backdrop" onClick={onClose}>
      <div className="compare-modal-card" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="compare-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="bi bi-bar-chart-line text-white"></i>
            <span style={{ color: '#fff', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1rem' }}>
              Product Comparison
            </span>
            <span className="badge rounded-pill ms-1" style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', fontFamily: "'DM Sans', sans-serif" }}>
              {compareList.length} items
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '50%', width: 32, height: 32, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}
            aria-label="Close"
          >
            <i className="bi bi-x-lg" style={{ fontSize: '0.85rem' }}></i>
          </button>
        </div>

        {/* Body */}
        <div className="compare-modal-body">

          {/* Remove buttons row */}
          <div style={{ ...gridStyle, marginBottom: 6 }}>
            <div></div>
            {compareList.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 6px' }}>
                <button
                  onClick={() => onRemove(p)}
                  style={{
                    background: 'rgba(128,0,32,0.08)', border: '1px solid rgba(128,0,32,0.25)', borderRadius: '50%',
                    width: 26, height: 26, cursor: 'pointer', color: 'var(--price-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem',
                  }}
                  title="Remove"
                ><i className="bi bi-x-lg"></i></button>
              </div>
            ))}
          </div>

          {/* Images row */}
          <div style={{ ...gridStyle, marginBottom: 0 }}>
            <div></div>
            {compareList.map(p => (
              <div key={p.id} style={{
                margin: '0 4px',
                background: 'var(--bg-section)',
                border: '1px solid var(--card-border)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 96, padding: '8px',
              }}>
                <img src={p.image} alt={p.name} style={{ maxHeight: 76, maxWidth: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>

          {/* Product name row */}
          <div style={{ ...gridStyle, borderTop: '1px solid var(--card-border)', minHeight: 52 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              fontSize: '0.62rem', fontWeight: 700, color: '#800020',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              fontFamily: "'DM Sans', sans-serif", paddingRight: 8,
            }}>
              Product
            </div>
            {compareList.map(p => (
              <div key={p.id} style={{
                borderLeft: '1px solid var(--card-border)',
                padding: '8px 6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dark)',
                textAlign: 'center', fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.35,
              }}>
                {p.name.length > 55 ? p.name.slice(0, 55) + '…' : p.name}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {rows.map((row) => (
            <div key={row.key} style={{
              ...gridStyle,
              borderTop: '1px solid var(--card-border)',
              minHeight: row.isDesc ? 80 : 40,
            }}>
              <div style={{
                display: 'flex', alignItems: row.isDesc ? 'flex-start' : 'center',
                paddingTop: row.isDesc ? 8 : 0,
                fontSize: '0.62rem', fontWeight: 700, color: 'var(--price-color)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                fontFamily: "'DM Sans', sans-serif", paddingRight: 8,
              }}>
                {row.label}
              </div>
              {compareList.map(p => (
                <div key={p.id} style={{
                  borderLeft: '1px solid var(--card-border)',
                  padding: '6px 8px',
                  display: 'flex',
                  alignItems: row.isDesc ? 'flex-start' : 'center',
                  justifyContent: row.isDesc ? 'flex-start' : 'center',
                  textAlign: row.isDesc ? 'left' : 'center',
                  wordBreak: 'break-word', minWidth: 0,
                }}>
                  {row.render(p)}
                </div>
              ))}
            </div>
          ))}

        </div>

        {/* Footer */}
        <div className="compare-modal-footer">
          <button
            onClick={() => { onRemove(null); onClose(); }}
            style={{
              background: 'transparent', border: '1px solid var(--card-border)',
              borderRadius: 50, padding: '6px 16px', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif",
            }}
          >Clear All</button>
          <button
            onClick={onClose}
            style={{
              background: '#800020', border: 'none',
              borderRadius: 50, padding: '6px 20px', cursor: 'pointer',
              color: '#fff', fontSize: '0.8rem', fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
            }}
          >Done</button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

/* ── ProductList ─────────────────────────────────────────── */
const ProductList = () => {
  const [allProducts, setAllProducts]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loadingMore, setLoadingMore]   = useState(false);

  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort]         = useState('default');
  const [priceRange, setPriceRange]             = useState(60000);

  const [compareList, setCompareList]           = useState([]);
  const [showCompare, setShowCompare]           = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const location  = useLocation();
  const navigate  = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('q') || '');
    setSelectedCategory(params.get('cat') || 'all');
    setVisibleCount(ITEMS_PER_PAGE);
  }, [location.search]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(data => {
        setAllProducts(data.map(item => {
          const phpPrice    = parseFloat(toPHP(item.price, item.category));
          const oldPhpPrice = parseFloat(toPHP(item.price * 1.25, item.category));
          return {
            id:          item.id,
            name:        item.title,
            oldPrice:    oldPhpPrice.toFixed(2),
            price:       phpPrice.toFixed(2),
            discount:    20,
            rating:      Math.round(item.rating.rate),
            image:       item.image,
            category:    item.category,
            description: item.description,
          };
        }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [loading, location.hash]);

  const handleObserver = useCallback((entries) => {
    if (entries[0].isIntersecting && !loadingMore) {
      setLoadingMore(true);
      setTimeout(() => { setVisibleCount(prev => prev + ITEMS_PER_PAGE); setLoadingMore(false); }, 600);
    }
  }, [loadingMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { rootMargin: '200px' });
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const toggleCompare = (product) => {
    setCompareList(prev => {
      if (prev.find(p => p.id === product.id)) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 3) { alert("You can compare up to 3 products."); return prev; }
      return [...prev, product];
    });
  };
  const removeFromCompare = (product) => {
    if (!product) { setCompareList([]); return; }
    setCompareList(prev => prev.filter(p => p.id !== product.id));
  };

  const filtered = allProducts
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => parseFloat(p.price) <= priceRange)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (selectedSort) {
        case 'price_asc':   return parseFloat(a.price) - parseFloat(b.price);
        case 'price_desc':  return parseFloat(b.price) - parseFloat(a.price);
        case 'name_asc':    return a.name.localeCompare(b.name);
        case 'name_desc':   return b.name.localeCompare(a.name);
        case 'rating_desc': return b.rating - a.rating;
        default:            return 0;
      }
    });

  const visible   = filtered.slice(0, visibleCount);
  const hasMore   = visibleCount < filtered.length;
  const allLoaded = !hasMore && !loading && filtered.length > 0;

  const pushUrl = (q, cat) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (cat && cat !== 'all') params.set('cat', cat);
    navigate(`/products${params.toString() ? '?' + params.toString() : ''}`, { replace: true });
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val); setVisibleCount(ITEMS_PER_PAGE); pushUrl(val, selectedCategory);
  };
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat); setVisibleCount(ITEMS_PER_PAGE); pushUrl(searchQuery, cat);
    setShowMobileFilter(false);
  };

  return (
    <div className="page-enter">

      {/* Page header */}
      <header style={{
        background: 'linear-gradient(135deg, #1a0a0d 0%, #800020 60%, #5a0016 100%)',
        backgroundSize: '200% 200%', animation: 'gradientShift 8s ease infinite',
        padding: '2.5rem 0 2rem',
      }}>
        <div className="container text-center">
          <div className="d-flex align-items-center justify-content-center gap-3 mb-2">
            {/* Animated logo */}
            <div className="products-header-logo-wrap">
              <div className="products-header-logo-ring"></div>
              <div className="products-header-logo-ring2"></div>
              <img src="/icon-512x512.png" alt="Bill's Logo" className="products-header-logo-img" />
            </div>
            <h1 className="fw-bold display-4 text-white mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bill's.
            </h1>
          </div>
          <p className="lead mb-0" style={{ color: 'rgba(201,168,76,0.9)', fontFamily: "'DM Sans', sans-serif" }}>
            Bill got it all for you!
          </p>
        </div>
      </header>
      <div className="animated-gradient-divider"></div>

      <div className="container my-3 my-lg-4">

        {/* Search + filter row */}
        <div className="row mb-3">
          <div className="col-12 col-lg-9 offset-lg-3">
            <div className="d-flex gap-2 align-items-center">
              <div className="position-relative flex-grow-1">
                <input
                  type="search"
                  className="form-control rounded-pill ps-4 pe-5 py-2"
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  style={{ borderColor: 'rgba(128,0,32,0.3)', fontSize: '0.88rem', background: 'var(--card-bg)', color: 'var(--text-dark)', fontFamily: "'DM Sans', sans-serif" }}
                />
                <i className="bi bi-search position-absolute"
                  style={{ right: 14, top: '50%', transform: 'translateY(-50%)', color: '#800020', pointerEvents: 'none' }}></i>
              </div>
              <button
                className="btn d-lg-none rounded-pill px-3 py-2 flex-shrink-0 fw-bold"
                style={{ background: '#800020', color: '#fff', fontSize: '0.82rem', border: 'none', fontFamily: "'DM Sans', sans-serif" }}
                onClick={() => setShowMobileFilter(v => !v)}
              >
                <i className={`bi ${showMobileFilter ? 'bi-x-lg' : 'bi-sliders'} me-1`}></i>
                {showMobileFilter ? 'Close' : 'Filters'}
              </button>
            </div>
          </div>
        </div>

        {showMobileFilter && (
          <div className="d-lg-none mb-3 p-3 rounded-4"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-md)' }}>
            <Sidebar
              onCategoryChange={handleCategoryChange}
              onSortChange={setSelectedSort}
              onPriceChange={setPriceRange}
              selectedCategory={selectedCategory}
              selectedSort={selectedSort}
              priceRange={priceRange}
            />
          </div>
        )}

        <div className="row g-3 g-lg-4">
          <div className="col-lg-3 d-none d-lg-block">
            <div className="sticky-top" style={{ top: 80 }}>
              <Sidebar
                onCategoryChange={handleCategoryChange}
                onSortChange={setSelectedSort}
                onPriceChange={setPriceRange}
                selectedCategory={selectedCategory}
                selectedSort={selectedSort}
                priceRange={priceRange}
              />
            </div>
          </div>

          <div className="col-12 col-lg-9">
            {loading ? (
              <div className="row g-3 row-cols-2 row-cols-md-3">
                {[...Array(8)].map((_, i) => <div className="col" key={i}><SkeletonCard /></div>)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-5 rounded-4"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <i className="bi bi-search d-block mb-3" style={{ fontSize: '2.8rem', color: '#800020', opacity: 0.3 }}></i>
                <h5 className="fw-bold mb-2" style={{ color: 'var(--text-dark)', fontFamily: "'Playfair Display', serif" }}>No products found</h5>
                <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>Try adjusting your search or filters.</p>
                <button
                  className="btn rounded-pill px-4 fw-bold"
                  style={{ background: '#800020', color: '#fff', border: 'none', fontFamily: "'DM Sans', sans-serif" }}
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setPriceRange(60000); pushUrl('', 'all'); }}
                >Clear Filters</button>
              </div>
            ) : (
              <>
                <p className="small mb-3" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
                  {filtered.length} product{filtered.length !== 1 ? 's' : ''}
                  {searchQuery && <> for "<strong style={{ color: '#800020' }}>{searchQuery}</strong>"</>}
                </p>
                <div className="row g-3 row-cols-2 row-cols-md-3">
                  {visible.map((product) => (
                    <div className="col" key={product.id}>
                      <ProductCard
                        product={product}
                        onCompareToggle={toggleCompare}
                        isInCompare={!!compareList.find(p => p.id === product.id)}
                      />
                    </div>
                  ))}
                </div>
                <div ref={bottomRef} className="py-3 text-center">
                  {loadingMore && (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" style={{ color: '#800020' }}></div>
                      <small style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>Loading more…</small>
                    </>
                  )}
                </div>
                {allLoaded && filtered.length > ITEMS_PER_PAGE && (
                  <p className="text-center small py-2" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
                    <i className="bi bi-check-circle-fill me-1" style={{ color: '#800020' }}></i>
                    All {filtered.length} products displayed
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      {!loading && (
        <section className="coming-soon-section py-4">
          <div className="container text-center">
            <div className="animated-gradient-divider mb-4" style={{ maxWidth: 160, margin: '0 auto 2rem' }}></div>
            <div className="d-inline-flex align-items-center gap-2 rounded-pill px-4 py-2 mb-3"
              style={{ background: 'rgba(128,0,32,0.08)', border: '1px solid rgba(128,0,32,0.2)' }}>
              <span className="pulse-dot"></span>
              <span className="fw-bold" style={{ color: '#800020', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>
                More Coming Soon
              </span>
            </div>
            <h3 className="fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-dark)' }}>
              New Products Are On Their Way!
            </h3>
            <p className="mb-4" style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto 1.5rem', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
              Bill's is constantly expanding its catalogue. Follow us on social media for exclusive deals.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <a href="https://www.facebook.com/mamornobillc/" target="_blank" rel="noreferrer"
                className="btn fw-bold rounded-pill px-4 py-2 social-btn-fb"
                style={{ background: 'linear-gradient(135deg, #1877f2, #0d5bbf)', color: '#fff', fontSize: '0.85rem', border: 'none', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 14px rgba(24,119,242,0.35)', transition: 'all 0.22s ease' }}>
                <i className="bi bi-facebook me-2"></i>Facebook
              </a>
              <a href="https://www.instagram.com/b1llchavez" target="_blank" rel="noreferrer"
                className="btn fw-bold rounded-pill px-4 py-2 social-btn-ig"
                style={{ background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: '#fff', fontSize: '0.85rem', border: 'none', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 14px rgba(220,39,67,0.35)', transition: 'all 0.22s ease' }}>
                <i className="bi bi-instagram me-2"></i>Instagram
              </a>
              <a href="https://paraverse.feutech.edu.ph/briefcase/profile/billcmamorno" target="_blank" rel="noreferrer"
                className="btn fw-bold rounded-pill px-4 py-2 social-btn-pv"
                style={{ background: 'linear-gradient(135deg, #800020, #c9a84c)', color: '#fff', fontSize: '0.85rem', border: 'none', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 14px rgba(128,0,32,0.35)', transition: 'all 0.22s ease' }}>
                <i className="bi bi-person-badge me-2"></i>Paraverse
              </a>
            </div>
            <div className="animated-gradient-divider mt-4" style={{ maxWidth: 160, margin: '2rem auto 0' }}></div>
          </div>
        </section>
      )}

      {/* ── Compare Bar — portal, fixed viewport bottom ── */}
      {compareList.length > 0 && createPortal(
        <div className="compare-bar">
          {/* Mobile: centered title + scrollable badges + centered action buttons */}
          <div className="d-flex d-md-none flex-column align-items-center gap-1">
            {/* "Compare (N/3)" always centered */}
            <div className="compare-bar-products">
              <div className="compare-bar-label">
                <i className="bi bi-bar-chart-line me-1"></i>
                Compare ({compareList.length}/3)
              </div>
              {/* Scrollable badge strip */}
              <div className="compare-bar-badges">
                {compareList.map(p => (
                  <span
                    key={p.id}
                    className="badge rounded-pill d-inline-flex align-items-center gap-1"
                    style={{ background: 'rgba(255,255,255,0.18)', fontSize: '0.68rem', padding: '4px 8px', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}
                  >
                    {p.name.length > 14 ? p.name.slice(0, 14) + '…' : p.name}
                    <button
                      style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '0.7rem', marginLeft: 2 }}
                      onClick={() => removeFromCompare(p)}
                      aria-label="Remove"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </span>
                ))}
              </div>
            </div>
            {/* Action buttons row — always centered */}
            <div className="compare-bar-actions">
              <button
                className="btn btn-sm rounded-pill fw-bold px-4"
                style={{ background: '#fff', color: '#800020', border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem' }}
                onClick={() => setShowCompare(true)}
                disabled={compareList.length < 2}
              >
                <i className="bi bi-bar-chart-line me-1"></i>Compare Now
              </button>
              <button
                className="btn btn-sm rounded-pill"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem' }}
                onClick={() => setCompareList([])}
              >Clear</button>
            </div>
          </div>

          {/* Desktop: single row */}
          <div className="d-none d-md-flex align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="fw-bold" style={{ fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif" }}>
                <i className="bi bi-bar-chart-line me-1"></i>Compare ({compareList.length}/3)
              </span>
              {compareList.map(p => (
                <span key={p.id} className="badge rounded-pill d-flex align-items-center gap-1"
                  style={{ background: 'rgba(255,255,255,0.18)', fontSize: '0.72rem', padding: '5px 10px', fontFamily: "'DM Sans', sans-serif" }}>
                  {p.name.length > 18 ? p.name.slice(0, 18) + '…' : p.name}
                  <button
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '0.72rem', marginLeft: 2 }}
                    onClick={() => removeFromCompare(p)} aria-label="Remove">
                    <i className="bi bi-x-lg"></i>
                  </button>
                </span>
              ))}
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm rounded-pill fw-bold px-4"
                style={{ background: '#fff', color: '#800020', border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem' }}
                onClick={() => setShowCompare(true)}
                disabled={compareList.length < 2}
              >
                <i className="bi bi-bar-chart-line me-1"></i>Compare Now
              </button>
              <button
                className="btn btn-sm rounded-pill"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem' }}
                onClick={() => setCompareList([])}
              >Clear</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showCompare && (
        <CompareModal
          compareList={compareList}
          onClose={() => setShowCompare(false)}
          onRemove={(p) => {
            removeFromCompare(p);
            if (!p || compareList.length <= 1) setShowCompare(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductList;
