import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

// Home page: hero, featured products, stats, recently viewed and category
// sections. Uses small helpers and a reveal hook for scroll animations.
/* ── Scroll reveal hook ── */
const useScrollReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
};

/* ── Skeleton card ── */
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

/* ── Animated counter stat ── */
const AnimatedStat = ({ end, suffix, label }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = Math.ceil(end / 55);
    const timer = setInterval(() => {
      cur += step;
      if (cur >= end) { setCount(end); clearInterval(timer); }
      else setCount(cur);
    }, 26);
    return () => clearInterval(timer);
  }, [end]);
  return (
    <div className="text-center">
      <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f0d080', fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', marginTop: 3, fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </div>
    </div>
  );
};

const toPHP = (usdPrice, category) => {
  const c = (category || '').toLowerCase();
  let rate = 58;
  if (c.includes('electronic')) rate = 60;
  if (c.includes('jewel')) rate = 62;
  if (c.includes('clothing') || c.includes('men') || c.includes('women')) rate = 55;
  return (parseFloat(usdPrice) * rate).toFixed(2);
};

/* ── Trust Badges — bidirectional scroll hints ── */
const TrustBadges = () => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft]   = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  return (
    <section className="trust-badge-row py-3" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative' }}>
        {/* Left fade + bouncing arrow */}
        <div className="trust-fade-left d-sm-none" style={{ opacity: showLeft ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: 'none' }}>
          <i className="bi bi-chevron-double-left trust-arrow-icon"></i>
        </div>
        {/* Right fade + bouncing arrow */}
        <div className="trust-fade-right d-sm-none" style={{ opacity: showRight ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: 'none' }}>
          <i className="bi bi-chevron-double-right trust-arrow-icon"></i>
        </div>

        <div className="trust-badge-inner" ref={scrollRef} onScroll={handleScroll}>
          {[
            { icon: 'bi-truck',                  label: 'Free Shipping',    sub: 'On orders over ₱500' },
            { icon: 'bi-arrow-counterclockwise', label: 'Easy Returns',     sub: '30-day return policy' },
            { icon: 'bi-shield-check',           label: 'Buyer Protection', sub: '100% secure checkout' },
            { icon: 'bi-headset',                label: '24/7 Support',     sub: 'Always here to help' },
          ].map((b, i) => (
            <div className="trust-badge-item" key={i}>
              <i className={`bi ${b.icon} d-block mb-1`} style={{ fontSize: '1.3rem', color: '#f0d080' }}></i>
              <div style={{ fontWeight: 700, fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>{b.label}</div>
              <div style={{ fontSize: '0.67rem', opacity: 0.72, fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>{b.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Promo animated logo — same as About/Products ── */
const PromoLogo = () => (
  <div className="promo-logo-wrap mx-auto mb-3">
    <div className="promo-logo-ring1"></div>
    <div className="promo-logo-ring2"></div>
    <div className="promo-logo-ring3"></div>
    <img src="/icon-512x512.png" alt="Bill's" className="promo-logo-img" />
  </div>
);

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed]     = useState([]);

  useScrollReveal();

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(data => {
        setFeaturedProducts(data.slice(0, 8).map(item => {
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
      });
    try {
      const rv = JSON.parse(localStorage.getItem('bills_recently_viewed') || '[]');
      setRecentlyViewed(rv);
    } catch (_) {}
  }, []);

  return (
    <div className="page-enter">

      {/* ══ HERO CAROUSEL ══════════════════════════════════ */}
      <div id="heroCarousel" className="carousel slide carousel-fade"
        data-bs-ride="carousel" style={{ position: 'relative', overflow: 'hidden' }}>

        {/* Deep maroon gradient overlay */}
        <div className="hero-gradient-overlay"></div>

        {/* Custom pill indicators */}
        <div className="carousel-indicators carousel-custom-indicators" style={{ zIndex: 3, marginBottom: '0.75rem' }}>
          {[0,1,2].map(i => (
            <button key={i} type="button" data-bs-target="#heroCarousel"
              data-bs-slide-to={i} className={i === 0 ? 'active' : ''}
              aria-label={`Slide ${i+1}`}></button>
          ))}
        </div>

        <div className="carousel-inner">
          {[
            { img: '/images/bill1.png',  alt: "Bill's Banner 1", title: "Bill got it all for you.", sub: 'Electronics · Fashion · Essentials',             cta: 'Shop Now' },
            { img: '/images/bill2.png',  alt: "Bill's Banner 2", title: 'New Arrivals',             sub: 'Discover the latest trends in tech and fashion.', cta: 'Explore'  },
            { img: '/images/bill3.png', alt: "Bill's Banner 3", title: 'Everyday Essentials',      sub: 'Quality gear, delivered straight to you.',        cta: 'See More'  },
          ].map((slide, i) => (
            <div className={`carousel-item${i === 0 ? ' active' : ''}`} data-bs-interval="4500" key={i}>
              <img src={slide.img} alt={slide.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
              <div className="carousel-caption">
                
                <h1 className="carousel-title">{slide.title}</h1>
                <p className="carousel-sub">{slide.sub}</p>
                <Link to="/products" className="carousel-cta-btn">
                  {slide.cta} <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Custom prev/next — same fade+arrow style as trust badges */}
        <button
          className="carousel-control-prev carousel-edge-btn carousel-edge-btn--prev"
          type="button" data-bs-target="#heroCarousel" data-bs-slide="prev"
          style={{ zIndex: 3 }}
        >
          <div className="carousel-edge-fade carousel-edge-fade--left">
            <div className="carousel-edge-arrow">
              <i className="bi bi-chevron-double-left carousel-edge-icon"></i>
            </div>
          </div>
        </button>
        <button
          className="carousel-control-next carousel-edge-btn carousel-edge-btn--next"
          type="button" data-bs-target="#heroCarousel" data-bs-slide="next"
          style={{ zIndex: 3 }}
        >
          <div className="carousel-edge-fade carousel-edge-fade--right">
            <div className="carousel-edge-arrow">
              <i className="bi bi-chevron-double-right carousel-edge-icon"></i>
            </div>
          </div>
        </button>
      </div>

      <div className="animated-gradient-divider"></div>

      {/* ══ TRUST BADGES ═══════════════════════════════════ */}
      <TrustBadges />

      <div className="animated-gradient-divider"></div>

      {/* ══ FEATURED PRODUCTS ═══════════════════════════════ */}
      <section className="container my-3 my-lg-4">
        <div className="d-flex justify-content-between align-items-center mb-3 reveal">
          <h2 className="fs-2 fw-bold mb-0 section-heading-accent" style={{ fontFamily: "'Playfair Display', serif" }}>
            Featured Products
          </h2>
          <Link to="/products" style={{
            background: '#800020', color: '#fff', borderRadius: 50,
            padding: '7px 18px', fontWeight: 600, fontSize: '0.82rem',
            textDecoration: 'none', fontFamily: "'DM Sans', sans-serif",
            transition: 'background 0.2s ease', whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#a0002a'}
            onMouseLeave={e => e.currentTarget.style.background = '#800020'}
          >
            View All <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
        <div className="row g-3 flex-nowrap flex-lg-wrap mobile-carousel-scroll pb-1">
          {featuredProducts.length === 0
            ? [...Array(4)].map((_, i) => (
              <div className="col-6 col-sm-5 col-lg-3 flex-shrink-0 flex-lg-shrink-1" key={i} style={{ scrollSnapAlign: 'start' }}>
                <SkeletonCard />
              </div>
            ))
            : featuredProducts.map(product => (
              <div className="col-6 col-sm-5 col-lg-3 flex-shrink-0 flex-lg-shrink-1" key={product.id}
                style={{ scrollSnapAlign: 'start' }}>
                <ProductCard product={product} />
              </div>
            ))
          }
        </div>
      </section>

      {/* ══ STATS STRIP ═════════════════════════════════════ */}
      <div className="animated-gradient-divider"></div>
      <section style={{
        background: 'linear-gradient(135deg, #1a0a0d 0%, #800020 55%, #5a0016 100%)',
        backgroundSize: '200% 200%', animation: 'gradientShift 8s ease infinite',
        padding: '2rem 0',
      }}>
        <div className="container">
          <div className="row g-3 justify-content-center">
            <div className="col-6 col-md-3"><AnimatedStat end={1200} suffix="+" label="Happy Customers" /></div>
            <div className="col-6 col-md-3"><AnimatedStat end={20}   suffix="+" label="Curated Products" /></div>
            <div className="col-6 col-md-3"><AnimatedStat end={98}   suffix="%" label="Satisfaction Rate" /></div>
            <div className="col-6 col-md-3"><AnimatedStat end={24}   suffix="/7" label="Customer Support" /></div>
          </div>
        </div>
      </section>
      <div className="animated-gradient-divider"></div>

      {/* ══ RECENTLY VIEWED ══════════════════════════════════ */}
      {recentlyViewed.length > 0 && (
        <section className="container my-3">
          <hr className="gold-divider mb-3" />
          <div className="d-flex justify-content-between align-items-center mb-3 reveal">
            <h2 className="fs-3 fw-bold mb-0 section-heading-accent" style={{ fontFamily: "'Playfair Display', serif" }}>
              Recently Viewed
            </h2>
          </div>
          <div className="row g-3 flex-nowrap recently-viewed-scroll pb-1">
            {recentlyViewed.map(product => (
              <div className="col-6 col-sm-4 col-md-3 flex-shrink-0" key={product.id}
                style={{ scrollSnapAlign: 'start' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ SHOP BY CATEGORY ════════════════════════════════ */}
      <section className="container my-3">
        <div className="d-flex justify-content-between align-items-center mb-3 reveal">
          <h2 className="fs-2 fw-bold mb-0 section-heading-accent" style={{ fontFamily: "'Playfair Display', serif" }}>
            Shop by Category
          </h2>
        </div>
        <div className="category-grid">
          {[
            {
              icon: 'bi-cpu-fill',
              label: 'Electronics',
              cat: 'electronics',
              bg: 'linear-gradient(135deg, #2d0010 0%, #5a0016 45%, #800020 100%)',
              border: 'rgba(201,168,76,0.22)',
            },
            {
              icon: 'bi-person-fill',
              label: "Men's Clothing",
              cat: "men's clothing",
              bg: 'linear-gradient(135deg, #1a0008 0%, #600018 50%, #800020 100%)',
              border: 'rgba(201,168,76,0.18)',
            },
            {
              icon: 'bi-star-fill',
              label: "Women's Clothing",
              cat: "women's clothing",
              bg: 'linear-gradient(135deg, #3d0010 0%, #700018 50%, #800020 100%)',
              border: 'rgba(201,168,76,0.22)',
            },
            {
              icon: 'bi-gem',
              label: 'Jewelry',
              cat: 'jewelery',
              bg: 'linear-gradient(135deg, #1a0005 0%, #5a0016 40%, #800020 80%, #9a1030 100%)',
              border: 'rgba(201,168,76,0.28)',
            },
          ].map((cat, i) => (
            <Link key={i} to={`/products?cat=${encodeURIComponent(cat.cat)}`} className="text-decoration-none">
              <div className="category-tile" style={{
                background: cat.bg,
                borderRadius: 14,
                padding: '1.35rem 1rem',
                textAlign: 'center',
                color: '#fff',
                minHeight: 96,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${cat.border}`,
              }}>
                <i
                  className={`bi ${cat.icon} d-block mb-2`}
                  style={{
                    fontSize: '1.7rem',
                    color: '#f0d080',
                    filter: 'drop-shadow(0 2px 8px rgba(240,208,128,0.55))',
                  }}
                ></i>
                <div style={{
                  fontWeight: 700, fontSize: '0.82rem',
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: '0.03em',
                  color: '#fff',
                  textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                }}>
                  {cat.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ PROMO BANNER — animated logo + elegant call-to-action ══ */}
      <section className="container my-3" style={{ paddingBottom: 0, marginBottom: '0 !important' }}>
        <div className="rounded-5 text-center text-white promo-banner" style={{
          background: 'linear-gradient(135deg, #1a0a0d 0%, #800020 55%, #5a0016 100%)',
          backgroundSize: '200% 200%', animation: 'gradientShift 8s ease infinite',
          boxShadow: '0 18px 55px rgba(128,0,32,0.32)',
          padding: '2.75rem 1.5rem',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Subtle shimmer overlay */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            background: 'linear-gradient(135deg, transparent 30%, rgba(201,168,76,0.06) 60%, transparent 100%)',
            backgroundSize: '200% 200%', animation: 'gradientShift 5s ease infinite',
            pointerEvents: 'none',
          }} />

          {/* Animated logo — same as About/Products pages */}
          <PromoLogo />

          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 700,
            marginBottom: '0.5rem', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
          }}>
            Bill got it all for you!
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.80)', fontWeight: 300,
            fontSize: 'clamp(0.78rem, 1.8vw, 0.92rem)', fontFamily: "'DM Sans', sans-serif",
            marginBottom: '1.4rem', maxWidth: 440, margin: '0 auto 1.4rem',
          }}>
            Handpicked electronics, fashion, jewelry, and everyday essentials; all in one place, just for you.
          </p>
          <Link to="/products" style={{
            display: 'inline-block', position: 'relative', zIndex: 1,
            background: '#fff', color: '#800020', borderRadius: 50,
            padding: '11px 34px', fontWeight: 700, fontSize: '0.9rem',
            textDecoration: 'none', fontFamily: "'DM Sans', sans-serif",
            boxShadow: '0 4px 18px rgba(0,0,0,0.22)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.22)'; }}
          >
            Start Shopping <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
