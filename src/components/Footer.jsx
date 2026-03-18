import { useState } from 'react';

// Footer: site footer with brand info, helpful links, social icons,
// and a simple newsletter subscription form (client-side only).
const Footer = () => {
  // State for newsletter subscription form
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState('');

  // Validate email and simulate subscription (client-side)
  const handleSubscribe = () => {
    // Check if email field is empty
    if (!email.trim()) { setSubError('Please enter your email.'); return; }
    // Validate email format using regex pattern
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setSubError('Please enter a valid email.'); return; }
    // Mark as subscribed and clear form
    setSubscribed(true);
    setSubError('');
    setEmail('');
  };

  return (
    <footer className="footer-root text-white pt-4 mt-auto">
      <div className="container px-3 px-lg-5 pb-4">
        <div className="row gy-4">

          {/* Brand section - displays logo, tagline, and company info */}
          <div className="col-lg-4 mb-3">
            <div className="d-flex align-items-center mb-3 gap-2">
              <img src="/icon-512x512.png" alt="Bill's Logo"
                style={{ height: 38, width: 38, objectFit: 'contain', borderRadius: 8 }} />
              <h4 className="fw-bold mb-0" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.02em' }}>
                Bill's
              </h4>
            </div>
            <p className="small pe-lg-4" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>
              Bill got it all for you. Your premier online destination for electronics, fashion, and everyday essentials.
            </p>
            <p className="small mb-0" style={{ color: 'rgba(201,168,76,0.65)', fontSize: '0.74rem', fontFamily: "'DM Sans', sans-serif" }}>
              A part-time venture by Bill C. Mamorno · FEU Institute of Technology
            </p>
          </div>

          {/* Shop Links section - links to product categories and wishlist */}
          <div className="col-6 col-md-4 col-lg-2 mb-3">
            <h6 className="fw-bold mb-3" style={{ color: '#f0d080', fontSize: '0.73rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif" }}>
              Shop
            </h6>
            {/* Iterate through shop links as list items */}
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {[
                { label: 'Electronics',   href: '/products?cat=electronics' },
                { label: "Men's Fashion",  href: "/products?cat=men's%20clothing" },
                { label: "Women's Fashion",href: "/products?cat=women's%20clothing" },
                { label: 'Jewelry',        href: '/products?cat=jewelery' },
                { label: 'Wishlist',       href: '/wishlist' },
              ].map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-decoration-none footer-link-hover small"
                    style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'DM Sans', sans-serif" }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links section - customer service and account-related links */}
          <div className="col-6 col-md-4 col-lg-2 mb-3">
            <h6 className="fw-bold mb-3" style={{ color: '#f0d080', fontSize: '0.73rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif" }}>
              Support
            </h6>
            {/* Iterate through support links as list items */}
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {[
                { label: 'Contact Us',  href: '/contact' },
                { label: 'About Us',    href: '/about' },
                { label: 'My Cart',     href: '/cart' },
                { label: 'My Wishlist', href: '/wishlist' },
              ].map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-decoration-none footer-link-hover small"
                    style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'DM Sans', sans-serif" }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter subscription section - email signup form */}
          <div className="col-md-4 col-lg-4 mb-3">
            <h6 className="fw-bold mb-2" style={{ color: '#f0d080', fontSize: '0.73rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif" }}>
              Stay Updated
            </h6>
            <p className="small mb-2" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'DM Sans', sans-serif" }}>
              Subscribe for the latest products and exclusive offers from Bill's.
            </p>

            {/* Show success message if subscribed, otherwise show subscription form */}
            {subscribed ? (
              <div className="rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                style={{ background: 'rgba(26,154,26,0.18)', border: '1px solid rgba(26,154,26,0.35)' }}>
                <i className="bi bi-check-circle-fill" style={{ color: '#4ecb71', fontSize: '0.9rem' }}></i>
                <span style={{ color: '#4ecb71', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                  You're subscribed! Thanks for joining.
                </span>
              </div>
            ) : (
              <>
                {/* Display validation error message if any */}
                {subError && (
                  <p className="small mb-1" style={{ color: '#f08080', fontFamily: "'DM Sans', sans-serif" }}>
                    <i className="bi bi-exclamation-circle me-1"></i>{subError}
                  </p>
                )}
                {/* Email input field with subscribe button */}
                <div className="input-group rounded-pill overflow-hidden shadow-sm">
                  <input
                    type="email"
                    className="form-control form-control-sm border-0 ps-3 py-2 shadow-none"
                    placeholder="Enter email address"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setSubError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      color: '#fff',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  />
                  <button
                    className="btn btn-sm fw-bold px-3"
                    style={{ background: '#800020', color: '#fff', border: 'none', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}
                    type="button"
                    onClick={handleSubscribe}
                  >
                    Subscribe
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(201,168,76,0.18)', opacity: 1, margin: '1rem 0' }} />

        {/* Bottom bar - copyright and social media links */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small"
          style={{ color: 'rgba(255,255,255,0.40)' }}>
          {/* Copyright text */}
          <div className="mb-2 mb-md-0" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.76rem' }}>
            &copy; 2026 Bill's by Bill C. Mamorno. All rights reserved.
          </div>
          {/* Social media links */}
          <div className="d-flex gap-3">
            {/* Iterate through social media links and render each as an icon */}
            {[
              { href: 'https://www.facebook.com/mamornobillc/', icon: 'bi-facebook' },
              { href: 'https://www.instagram.com/b1llchavez', icon: 'bi-instagram' },
              { href: 'https://paraverse.feutech.edu.ph/briefcase/profile/billcmamorno', icon: 'bi-person-badge' },
            ].map(s => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer"
                className="text-decoration-none footer-link-hover"
                style={{ color: 'rgba(255,255,255,0.40)' }}>
                <i className={`bi ${s.icon} fs-5`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
