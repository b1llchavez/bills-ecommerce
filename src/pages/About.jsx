import { useEffect } from 'react';

// About page: static content describing the store and founder.
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

const About = () => {
  useScrollReveal();

  return (
    <div style={{ background: 'var(--bg-main)' }} className="pt-0 page-enter">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #1a0a0d 0%, #800020 60%, #5a0016 100%)',
        backgroundSize: '200% 200%', animation: 'gradientShift 8s ease infinite',
        padding: '4rem 0 3.5rem',
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center">

              {/* Animated logo — centered above "ABOUT BILL'S" badge */}
              <div className="d-flex justify-content-center mb-4">
                <div className="about-logo-wrap">
                  <div className="about-logo-ring"></div>
                  <div className="about-logo-ring2"></div>
                  <img
                    src="/icon-512x512.png"
                    alt="Bill's Logo"
                    className="about-logo-img"
                  />
                </div>
              </div>

              <span className="badge rounded-pill px-4 py-2 mb-3 d-inline-block"
                style={{ background: 'rgba(201,168,76,0.2)', color: '#f0d080', fontSize: '0.73rem', letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif" }}>
                ABOUT BILL'S
              </span>

              <h1 className="about-brand-title fw-bold text-white mb-2"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 6vw, 3.5rem)', lineHeight: 1.1 }}>
                We're Bill's.
              </h1>
              <p className="lead mb-0" style={{ color: 'rgba(240,208,128,0.85)', fontWeight: 300, fontFamily: "'DM Sans', sans-serif" }}>
                Bill got it all for you.
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="animated-gradient-divider"></div>

      {/* ── Store Description ─────────────────────────────── */}
      <section className="container py-4">
        <div className="row g-4">
          <div className="col-lg-8 reveal-left">
            <div className="p-4 p-md-5 h-100 rounded-4"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
              <h2 className="fw-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-dark)', fontSize: '1.65rem' }}>
                Your Everything Store.
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.82, fontFamily: "'DM Sans', sans-serif" }}>
                Bill's is a proudly student-made online store offering a handpicked selection of electronics,
                fashion, jewelry, and everyday essentials. We started with a simple belief that great
                products should be within everyone's reach, and that shopping should feel personal,
                trustworthy, and genuinely enjoyable.
              </p>
              <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.82, fontFamily: "'DM Sans', sans-serif" }}>
                Every item in our catalogue is carefully sourced and priced fairly. From the moment you
                browse to the moment your order arrives, Bill's stands behind every purchase with full
                buyer protection and dedicated customer support; your satisfaction is the
                whole point.
              </p>
            </div>
          </div>

          <div className="col-lg-4 reveal-right">
            <div className="p-4 p-md-5 h-100 rounded-4 text-center d-flex flex-column justify-content-center"
              style={{ background: 'linear-gradient(135deg, #800020, #5a0016)', color: '#fff' }}>
              <h3 className="display-1 fw-black mb-1" style={{ color: '#f0d080', fontFamily: "'Playfair Display', serif" }}>
                100%
              </h3>
              <p className="fs-5 mb-0" style={{ color: 'rgba(255,255,255,0.72)', fontFamily: "'DM Sans', sans-serif" }}>
                Quality Guaranteed
              </p>
            </div>
          </div>

          {[
            { icon: 'bi-shield-check', color: '#800020', title: 'Buyer Protection', text: 'Every purchase is covered by our comprehensive buyer protection policy and dedicated store support.' },
            { icon: 'bi-mortarboard-fill', color: '#c9a84c', title: 'Student Discounts', text: 'Special pricing available for FEU Tech students and faculty members on selected items.' },
            { icon: 'bi-box-seam', color: '#1a9a1a', title: 'Fast Shipping', text: 'Electronics, clothing, and accessories delivered safely and securely to your doorstep.' },
          ].map((f, i) => (
            <div className="col-lg-4 reveal" key={i} style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="p-4 h-100 rounded-4"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
                <i className={`bi ${f.icon} mb-3 d-block`} style={{ fontSize: '1.8rem', color: f.color }}></i>
                <h5 className="fw-bold mb-2" style={{ color: 'var(--text-dark)', fontFamily: "'DM Sans', sans-serif" }}>{f.title}</h5>
                <p className="small mb-0" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="animated-gradient-divider"></div>

      {/* ── Meet the Founder ──────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #1a0a0d 0%, #800020 100%)', padding: '4rem 0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">

              <div className="text-center mb-4 reveal">
                <span className="badge rounded-pill px-4 py-2 mb-2 d-inline-block"
                  style={{ background: 'rgba(201,168,76,0.18)', color: '#f0d080', fontSize: '0.73rem', letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif" }}>
                  THE FOUNDER
                </span>
                <h2 className="display-5 fw-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Meet Bill
                </h2>
              </div>

              <div className="rounded-4 p-4 p-md-5 reveal"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.2)', backdropFilter: 'blur(10px)' }}>
                <div className="row align-items-center g-4 g-lg-5">

                  {/* Avatar */}
                  <div className="col-lg-4 text-center">
                    <div className="mx-auto mb-3 overflow-hidden"
                      style={{
                        width: 130, height: 130, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #800020, #c9a84c)',
                        border: '3px solid rgba(201,168,76,0.5)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                      <img
                        src="/images/bill picture.png"
                        alt="Bill C. Mamorno"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        onError={e => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML =
                            '<span style="font-size:3rem;font-family:Playfair Display,serif;color:#fff;font-weight:900;line-height:1">B</span>';
                        }}
                      />
                    </div>
                    <h4 className="fw-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                      Bill C. Mamorno
                    </h4>
                    <p style={{ color: '#f0d080', fontSize: '0.8rem', fontFamily: "'DM Sans', sans-serif" }}>
                      Founder & Owner, Bill's
                    </p>
                    <div className="d-flex gap-3 justify-content-center mt-3">
                      {[
                        { href: 'https://www.facebook.com/mamornobillc/',                        icon: 'bi-facebook',     bg: 'linear-gradient(135deg,#1877f2,#0d5bbf)' },
                        { href: 'https://www.instagram.com/b1llchavez',                             icon: 'bi-instagram',    bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' },
                        { href: 'https://paraverse.feutech.edu.ph/briefcase/profile/billcmamorno', icon: 'bi-person-badge', bg: 'linear-gradient(135deg,#800020,#c9a84c)' },
                      ].map(s => (
                        <a key={s.href} href={s.href} target="_blank" rel="noreferrer"
                          className="text-decoration-none d-flex align-items-center justify-content-center rounded-circle"
                          style={{ width: 36, height: 36, background: s.bg, color: '#fff', border: 'none', boxShadow: '0 3px 10px rgba(0,0,0,0.25)', transition: 'all 0.2s', transform: 'translateY(0)' }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.35)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.25)'; }}>
                          <i className={`bi ${s.icon}`} style={{ fontSize: '0.95rem' }}></i>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="col-lg-8">
                    <p className="mb-3" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.88, fontFamily: "'DM Sans', sans-serif" }}>
                      Hi! I'm <strong style={{ color: '#f0d080' }}>Bill C. Mamorno</strong>, a sophomore full scholar at{' '}
                      <strong style={{ color: '#f0d080' }}>FEU Institute of Technology</strong>, pursuing a
                      Bachelor of Science in Information Technology with a specialization in{' '}
                      <strong style={{ color: '#f0d080' }}>Business Analytics</strong>.
                    </p>
                    <p className="mb-4" style={{ color: 'rgba(255,255,255,0.70)', fontSize: '0.95rem', lineHeight: 1.88, fontFamily: "'DM Sans', sans-serif" }}>
                      Bill's is one of my part-time ventures alongside my academics, built to bring
                      quality products within everyone's reach. Combining my passion for technology and business,
                      I'm building something meaningful from the campus of FEU Tech.
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      {['BSIT – Business Analytics', 'FEU Institute of Technology', 'Full Scholar', 'Sophomore'].map(tag => (
                        <span key={tag} className="badge rounded-pill px-3 py-2"
                          style={{ background: 'rgba(201,168,76,0.14)', color: '#f0d080', border: '1px solid rgba(201,168,76,0.25)', fontSize: '0.73rem', fontFamily: "'DM Sans', sans-serif" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
