import { useEffect, useState } from 'react';

// Contact page: contact info, animated icons, and a simple contact form
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

/* ─── Animated Contact Icon ─── */
const ContactIcon = ({ icon, index }) => {
  const gradients = [
    { id: 'grad-location', stops: ['#c9a84c', '#800020', '#5a0016'] },
    { id: 'grad-email',    stops: ['#800020', '#c9284c', '#800020'] },
    { id: 'grad-phone',    stops: ['#5a0016', '#800020', '#c9a84c'] },
  ];
  const g = gradients[index] ?? gradients[0];

  return (
    <>
      <style>{`
        @keyframes iconRingPulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          60%  { transform: scale(1.9); opacity: 0;   }
          100% { transform: scale(1.9); opacity: 0;   }
        }
        @keyframes iconRingPulse2 {
          0%   { transform: scale(1);   opacity: 0.45; }
          60%  { transform: scale(2.3); opacity: 0;    }
          100% { transform: scale(2.3); opacity: 0;    }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-3px) rotate(-4deg); }
          66%       { transform: translateY(2px)  rotate(3deg); }
        }
        @keyframes gradientRotate {
          0%   { filter: hue-rotate(0deg)   brightness(1); }
          50%  { filter: hue-rotate(18deg)  brightness(1.15); }
          100% { filter: hue-rotate(0deg)   brightness(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes orbitDot {
          0%   { transform: rotate(0deg)   translateX(22px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(22px) rotate(-360deg); }
        }
        @keyframes orbitDot2 {
          0%   { transform: rotate(180deg) translateX(26px) rotate(-180deg); }
          100% { transform: rotate(540deg) translateX(26px) rotate(-540deg); }
        }

        .contact-icon-wrap {
          position: relative;
          width: 52px;
          height: 52px;
          flex-shrink: 0;
        }

        /* Outer pulse rings */
        .contact-icon-wrap::before,
        .contact-icon-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
        }
        .contact-icon-wrap::before {
          background: radial-gradient(circle, rgba(201,168,76,0.55) 0%, rgba(128,0,32,0.3) 60%, transparent 70%);
          animation: iconRingPulse 2.6s ease-out infinite;
          animation-delay: var(--pulse-delay, 0s);
        }
        .contact-icon-wrap::after {
          background: radial-gradient(circle, rgba(128,0,32,0.4) 0%, rgba(201,168,76,0.2) 50%, transparent 65%);
          animation: iconRingPulse2 2.6s ease-out infinite;
          animation-delay: calc(var(--pulse-delay, 0s) + 0.4s);
        }

        /* Main icon circle */
        .contact-icon-circle {
          position: relative;
          z-index: 2;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.15rem;
          color: #fff;
          animation: iconFloat 4s ease-in-out infinite, gradientRotate 5s ease-in-out infinite;
          box-shadow:
            0 0 0 2px rgba(201,168,76,0.35),
            0 0 16px rgba(128,0,32,0.6),
            0 4px 20px rgba(0,0,0,0.35);
          overflow: hidden;
        }

        /* Shimmer sweep */
        .contact-icon-circle::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.22) 50%, transparent 70%);
          background-size: 200% 100%;
          animation: shimmer 2.8s linear infinite;
          animation-delay: var(--pulse-delay, 0s);
          pointer-events: none;
          z-index: 1;
        }

        /* Orbiting dots */
        .orbit-dot {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #c9a84c;
          top: 50%;
          left: 50%;
          margin: -2.5px 0 0 -2.5px;
          z-index: 3;
          opacity: 0.85;
          animation: orbitDot 3s linear infinite;
          animation-delay: var(--orbit-delay, 0s);
        }
        .orbit-dot-2 {
          position: absolute;
          width: 3.5px;
          height: 3.5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.7);
          top: 50%;
          left: 50%;
          margin: -1.75px 0 0 -1.75px;
          z-index: 3;
          animation: orbitDot2 4.5s linear infinite;
          animation-delay: var(--orbit-delay2, 0s);
        }

        /* Stagger each icon's float animation */
        .contact-icon-wrap:nth-child(1) .contact-icon-circle { animation-delay: 0s,    0s; }
        .contact-icon-wrap:nth-child(2) .contact-icon-circle { animation-delay: 0.8s,  0.5s; }
        .contact-icon-wrap:nth-child(3) .contact-icon-circle { animation-delay: 1.6s,  1s; }

        /* Hover: boost glow */
        .contact-info-row:hover .contact-icon-circle {
          box-shadow:
            0 0 0 2.5px rgba(201,168,76,0.65),
            0 0 28px rgba(128,0,32,0.9),
            0 6px 28px rgba(0,0,0,0.45);
          transition: box-shadow 0.3s ease;
        }
        .contact-info-row:hover .orbit-dot  { background: #f0d080; }
        .contact-info-row:hover .orbit-dot-2 { background: rgba(255,255,255,0.95); }
      `}</style>

      <div
        className="contact-icon-wrap"
        style={{ '--pulse-delay': `${index * 0.55}s`, '--orbit-delay': `${index * 0.4}s`, '--orbit-delay2': `${index * 0.6}s` }}
      >
        {/* Orbiting particles */}
        <div className="orbit-dot" />
        <div className="orbit-dot-2" />

        {/* Main circle with SVG gradient */}
        <div
          className="contact-icon-circle"
          style={{
            background: `linear-gradient(135deg, ${g.stops[0]} 0%, ${g.stops[1]} 55%, ${g.stops[2]} 100%)`,
            animationDelay: `${index * 0.8}s, ${index * 0.5}s`,
          }}
        >
          <i className={`bi ${icon}`} style={{ position: 'relative', zIndex: 2 }} aria-hidden="true"></i>
        </div>
      </div>
    </>
  );
};

const Contact = () => {
  useScrollReveal();

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.message) {
      setError('Please fill in your name, email, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSubmitted(true);
  };

  const inputStyle = {
    background: 'var(--input-bg)',
    color: 'var(--text-dark)',
    border: '1px solid var(--card-border)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.85rem',
  };

  const labelStyle = {
    fontSize: '0.68rem',
    color: 'var(--text-muted)',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const contactItems = [
    {
      icon: 'bi-geo-alt-fill',
      title: 'Visit Store',
      lines: ['FEU Institute of Technology', 'P. Paredes St, Sampaloc, Manila 1015'],
    },
    {
      icon: 'bi-envelope-fill',
      title: 'Email Us',
      lines: ['support@bills.ph', 'sales@bills.ph'],
    },
    {
      icon: 'bi-telephone-fill',
      title: 'Call Us',
      lines: ['(02) 8281 8888', 'Mon–Sat, 8:00 AM – 6:00 PM'],
    },
  ];

  return (
    <div style={{ background: 'var(--bg-main)' }} className="pt-0 page-enter contact-page-wrap">

      {/* ── Header ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1a0a0d 0%, #800020 60%, #5a0016 100%)',
        backgroundSize: '200% 200%', animation: 'gradientShift 8s ease infinite',
        padding: 'clamp(1.5rem, 4vw, 2.5rem) 0 clamp(1rem, 3vw, 2rem)',
      }}>
        <div className="container text-center text-white">
          <span className="badge rounded-pill px-3 py-2 mb-2 d-inline-block"
            style={{ background: 'rgba(201,168,76,0.2)', color: '#f0d080', fontSize: '0.68rem', letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif" }}>
            CONTACT US
          </span>
          <h1 className="fw-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 4vw, 2.4rem)' }}>
            Get in touch.
          </h1>
          <p className="mb-0" style={{ color: 'rgba(240,208,128,0.82)', fontWeight: 300, fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>
            Questions about a product or just want to say hi?
          </p>
        </div>
      </section>
      <div className="animated-gradient-divider"></div>

      <div className="container py-3 py-md-4 px-3 px-md-2">
        <div className="row g-3 g-lg-4 align-items-start">

          {/* Left: Info */}
          <div className="col-lg-5 reveal-left">

            {/* Owner Identity Card */}
            <div className="rounded-4 p-3 p-md-4 mb-3"
              style={{ background: 'linear-gradient(135deg, #800020, #5a0016)', color: '#fff', boxShadow: '0 10px 30px rgba(128,0,32,0.3)' }}>
              <div className="d-flex align-items-center gap-3 mb-2">
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'rgba(201,168,76,0.2)',
                  border: '2px solid rgba(201,168,76,0.5)',
                  overflow: 'hidden', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <img
                    src="/images/bill picture.png"
                    alt="Bill C. Mamorno"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML =
                        '<span style="font-size:1.3rem;font-family:Playfair Display,serif;color:#f0d080;font-weight:900">B</span>';
                    }}
                  />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-white" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem' }}>
                    Bill C. Mamorno
                  </h6>
                  <small style={{ color: 'rgba(240,208,128,0.82)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem' }}>
                    Founder & Owner · Bill's
                  </small>
                </div>
              </div>

              <p className="mb-2" style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem' }}>
                Sophomore Full Scholar · FEU Institute of Technology<br />
                BS Information Technology – Business Analytics
              </p>

              <div className="d-flex gap-2 flex-wrap">
                {[
                  { href: 'https://www.facebook.com/mamornobillc/', icon: 'bi-facebook', label: 'Facebook',
                      bg: 'linear-gradient(135deg, #1877f2, #0d5bbf)' },
                  { href: 'https://www.instagram.com/b1llchavez', icon: 'bi-instagram', label: '@b1llchavez',
                      bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' },
                  { href: 'https://paraverse.feutech.edu.ph/briefcase/profile/billcmamorno', icon: 'bi-person-badge', label: 'Paraverse',
                      bg: 'linear-gradient(135deg, #800020, #c9a84c)' },
                ].map(s => (
                  <a key={s.href} href={s.href} target="_blank" rel="noreferrer"
                    className="btn btn-sm rounded-pill px-2 fw-bold text-decoration-none"
                    style={{ background: 'rgba(255,255,255,0.1)', color: '#f0d080', border: '1px solid rgba(201,168,76,0.28)', fontSize: '0.68rem', fontFamily: "'DM Sans', sans-serif" }}>
                    <i className={`bi ${s.icon} me-1`}></i>{s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Animated Contact Detail Items ── */}
            {contactItems.map((item, i) => (
              <div className="d-flex align-items-start mb-3 contact-info-row" key={i}>
                <div className="me-3">
                  <ContactIcon icon={item.icon} index={i} />
                </div>
                <div style={{ paddingTop: '6px' }}>
                  <h6 className="fw-bold mb-1" style={{ color: 'var(--text-dark)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem' }}>
                    {item.title}
                  </h6>
                  {item.lines.map((l, j) => (
                    <p className="small mb-0" key={j} style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem' }}>
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Form */}
          <div className="col-lg-7 reveal-right">
            <div className="rounded-4 p-3 p-md-4"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-md)' }}>

              {/* Success state */}
              {submitted ? (
                <div className="text-center py-4">
                  <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: 64, height: 64, background: '#800020' }}>
                    <i className="bi bi-check-lg text-white" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h5 className="fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-dark)' }}>
                    Message Sent!
                  </h5>
                  <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem' }}>
                    Thanks for reaching out, <strong style={{ color: 'var(--text-dark)' }}>{form.firstName}</strong>!<br />
                    Bill will get back to you soon at <strong className="product-price-label" style={{ color: 'var(--price-color)' }}>{form.email}</strong>.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' }); }}
                    className="btn rounded-pill px-4 py-2 fw-bold mt-2"
                    style={{ background: '#800020', color: '#fff', border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem' }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <>
                  <h5 className="fw-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: '#800020', fontSize: '1.1rem' }}>
                    Send Us a Message
                  </h5>

                  {error && (
                    <div className="rounded-3 mb-3 d-flex align-items-center p-2"
                      style={{ background: 'rgba(128,0,32,0.08)', border: '1px solid rgba(128,0,32,0.25)', color: '#800020', fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem' }}>
                      <i className="bi bi-exclamation-circle-fill me-2"></i>{error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label mb-1" style={labelStyle}>First Name *</label>
                        <input
                          type="text" name="firstName" value={form.firstName}
                          onChange={handleChange}
                          className="form-control form-control-sm rounded-3"
                          placeholder="Bill"
                          style={inputStyle}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label mb-1" style={labelStyle}>Last Name</label>
                        <input
                          type="text" name="lastName" value={form.lastName}
                          onChange={handleChange}
                          className="form-control form-control-sm rounded-3"
                          placeholder="Mamorno"
                          style={inputStyle}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label mb-1" style={labelStyle}>Email Address *</label>
                        <input
                          type="email" name="email" value={form.email}
                          onChange={handleChange}
                          className="form-control form-control-sm rounded-3"
                          placeholder="bill@example.com"
                          style={inputStyle}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label mb-1" style={labelStyle}>Subject</label>
                        <input
                          type="text" name="subject" value={form.subject}
                          onChange={handleChange}
                          className="form-control form-control-sm rounded-3"
                          placeholder="Order inquiry, product question…"
                          style={inputStyle}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label mb-1" style={labelStyle}>Message *</label>
                        <textarea
                          name="message" value={form.message}
                          onChange={handleChange}
                          className="form-control form-control-sm rounded-3"
                          rows="6"
                          placeholder="How can we help you?"
                          style={{ ...inputStyle, resize: 'none' }}
                        ></textarea>
                      </div>
                      <div className="col-12 mt-3">
                        <button
                          type="submit"
                          className="btn w-100 py-2 rounded-pill fw-bold"
                          style={{ background: '#800020', color: '#fff', border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', boxShadow: '0 5px 18px rgba(128,0,32,0.28)' }}>
                          Send Message <i className="bi bi-send-fill ms-2"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;