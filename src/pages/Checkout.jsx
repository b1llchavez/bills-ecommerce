import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

// Checkout page: collects delivery and payment details, applies promo
// codes, validates input, and clears the cart on successful submission.
/* Valid promo codes */
const PROMO_CODES = {
  'BILLS10':  { label: '10% off',       type: 'percent', value: 10 },
  'BILLS50':  { label: '₱50 off',       type: 'fixed',   value: 50 },
  'FEUTECH':  { label: '15% off (FEU)', type: 'percent', value: 15 },
  'FREESHIP': { label: 'Free shipping bonus ₱30', type: 'fixed', value: 30 },
};

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', address: '', phone: '', payment: 'cod',
    gcashNumber: '', mayaNumber: '',
    cardName: '', cardNumber: '', cardExpiry: '', cardCvv: '',
  });
  const [submitted, setSubmitted]   = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [errorMsg, setErrorMsg]     = useState('');

  /* Promo code state */
  const [promoInput, setPromoInput]     = useState('');
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError]     = useState('');

  const subtotal  = cart.reduce((s, i) => s + parseFloat(i.price) * i.qty, 0);
  const tax       = subtotal * 0.12;
  const discount  = promoApplied
    ? promoApplied.type === 'percent'
      ? subtotal * (promoApplied.value / 100)
      : promoApplied.value
    : 0;
  const total     = subtotal + tax - discount;

  const fmt = (v) => '₱' + parseFloat(v).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  useEffect(() => {
    if (submitted) setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }, [submitted]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };
  const handlePhone = (e) => {
    setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) });
    if (errorMsg) setErrorMsg('');
  };
  const handleGcashNumber = (e) => setForm({ ...form, gcashNumber: e.target.value.replace(/\D/g, '').slice(0, 11) });
  const handleMayaNumber  = (e) => setForm({ ...form, mayaNumber:  e.target.value.replace(/\D/g, '').slice(0, 11) });
  const handleCardNumber  = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setForm({ ...form, cardNumber: formatted });
  };
  const handleCardExpiry = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    const formatted = raw.length > 2 ? raw.slice(0,2) + '/' + raw.slice(2) : raw;
    setForm({ ...form, cardExpiry: formatted });
  };

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) { setPromoError('Please enter a promo code.'); return; }
    if (PROMO_CODES[code]) {
      setPromoApplied({ code, ...PROMO_CODES[code] });
      setPromoError('');
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code. Try BILLS10, BILLS50, FEUTECH, or FREESHIP.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); setErrorMsg('');
    if (!form.name || !form.email || !form.address || !form.phone) { setErrorMsg("Please complete all required fields."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErrorMsg("Please enter a valid email address."); return; }
    if (form.phone.length !== 10) { setErrorMsg("Please enter a valid 10-digit mobile number (without +63)."); return; }
    if (form.payment === 'gcash' && form.gcashNumber.length < 10) { setErrorMsg("Please enter your GCash number."); return; }
    if (form.payment === 'maya' && form.mayaNumber.length < 10) { setErrorMsg("Please enter your Maya number."); return; }
    if (form.payment === 'card') {
      if (!form.cardName || form.cardNumber.replace(/\s/g,'').length < 16 || form.cardExpiry.length < 5 || form.cardCvv.length < 3) {
        setErrorMsg("Please complete all card details."); return;
      }
    }
    setFinalTotal(total); clearCart(); setSubmitted(true);
  };

  const fieldStyle = {
    background: 'var(--input-bg)',
    color: 'var(--text-dark)',
    borderColor: 'var(--card-border)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '0.88rem',
  };
  const labelStyle = {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  // GCash: blue theme; Maya: green theme
  const gcashColor = '#0050c8';
  const mayaColor  = '#007a4d';

  if (submitted) {
    return (
      <div className="container d-flex justify-content-center align-items-center my-5 py-3" style={{ minHeight: '60vh' }}>
        <div className="text-center rounded-4 p-4 p-md-5"
          style={{ maxWidth: 420, width: '100%', background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-md)' }}>
          <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{ width: 76, height: 76, background: '#800020' }}>
            <i className="bi bi-check-lg text-white" style={{ fontSize: '2.4rem' }}></i>
          </div>
          <h3 className="fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-dark)' }}>
            Order Confirmed!
          </h3>
          <p className="mb-4" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
            Thank you, <strong style={{ color: 'var(--text-dark)' }}>{form.name}</strong>.<br />
            Your order has been successfully placed.
          </p>
          {promoApplied && (
            <div className="rounded-3 mb-3 px-3 py-2 d-flex align-items-center gap-2"
              style={{ background: 'rgba(26,154,26,0.08)', border: '1px solid rgba(26,154,26,0.2)' }}>
              <i className="bi bi-tag-fill" style={{ color: '#1a9a1a' }}></i>
              <span style={{ fontSize: '0.8rem', color: '#1a9a1a', fontFamily: "'DM Sans', sans-serif" }}>
                Promo <strong>{promoApplied.code}</strong> applied — saved {fmt(discount)}
              </span>
            </div>
          )}
          <div className="rounded-3 p-3 mb-4"
            style={{ background: 'rgba(128,0,32,0.06)', border: '1px solid rgba(128,0,32,0.15)' }}>
            <p className="fw-bold mb-1" style={{ textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.08em', color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
              Total Paid
            </p>
            <h4 className="mb-0 fw-bold product-price-label" style={{ color: 'var(--price-color)', fontFamily: "'Playfair Display', serif" }}>
              {fmt(finalTotal)}
            </h4>
          </div>
          <Link to="/" className="btn rounded-pill fw-bold py-2 w-100 mb-2"
            style={{ background: '#800020', color: '#fff', border: 'none', fontFamily: "'DM Sans', sans-serif" }}>
            Return to Home
          </Link>
          <Link to="/products" className="btn rounded-pill fw-bold py-2 w-100"
            style={{ background: 'var(--input-bg)', color: 'var(--text-dark)', border: '1px solid var(--card-border)', fontFamily: "'DM Sans', sans-serif" }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="text-center p-5 rounded-4"
          style={{ maxWidth: 480, width: '100%', background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
          <i className="bi bi-cart-x d-block mb-3" style={{ fontSize: '3.5rem', color: '#800020', opacity: 0.35 }}></i>
          <h4 className="fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-dark)' }}>Your Cart is Empty</h4>
          <p className="mb-4" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>Nothing to checkout yet.</p>
          <Link to="/products" className="btn rounded-pill px-4 py-2 fw-bold"
            style={{ background: '#800020', color: '#fff', border: 'none', fontFamily: "'DM Sans', sans-serif" }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4 my-lg-5 pt-3 page-enter" style={{ maxWidth: 1060 }}>

      <div className="d-block d-md-none mb-3">
        <Link to="/cart" className="btn btn-sm fw-bold py-2 rounded-pill w-100 d-flex justify-content-center align-items-center"
          style={{ background: 'var(--card-bg)', color: 'var(--text-dark)', border: '1px solid var(--card-border)', fontFamily: "'DM Sans', sans-serif" }}>
          <i className="bi bi-arrow-left me-2"></i>Back to Cart
        </Link>
      </div>

      <h3 className="mb-4 fw-bold text-center text-lg-start"
        style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-dark)', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
        Secure Checkout
      </h3>

      <div className="row g-4 g-lg-5">
        {/* ── Form ── */}
        <div className="col-lg-7">
          <div className="rounded-4" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="p-4 p-md-4">

              {errorMsg && (
                <div className="rounded-3 mb-4 d-flex align-items-center p-3"
                  style={{ background: 'rgba(128,0,32,0.08)', border: '1px solid rgba(128,0,32,0.25)', color: '#800020', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem' }}>
                  <i className="bi bi-exclamation-circle-fill me-2"></i>{errorMsg}
                </div>
              )}

              <form id="checkoutForm" onSubmit={handleSubmit} noValidate>

                {/* ── Delivery Information ── */}
                <h6 className="mb-3 fw-bold d-flex align-items-center checkout-section-heading"
                  style={{ color: 'var(--price-color)', fontFamily: "'DM Sans', sans-serif" }}>
                  <i className="bi bi-person-fill me-2"></i>Delivery Information
                </h6>

                {[
                  { name: 'name',  label: 'Full Name *',     type: 'text',  placeholder: 'Bill C. Mamorno' },
                  { name: 'email', label: 'Email Address *', type: 'email', placeholder: 'bill@example.com' },
                ].map(f => (
                  <div className="mb-3" key={f.name}>
                    <label className="form-label mb-1" style={labelStyle}>{f.label}</label>
                    <input name={f.name} type={f.type} value={form[f.name]}
                      onChange={handleChange} className="form-control py-2 rounded-3"
                      placeholder={f.placeholder} style={fieldStyle} />
                  </div>
                ))}

                <div className="mb-3">
                  <label className="form-label mb-1" style={labelStyle}>Mobile Number *</label>
                  <div className="input-group">
                    <span className="input-group-text fw-bold" style={{ ...fieldStyle, borderRadius: '8px 0 0 8px', fontSize: '0.88rem' }}>
                      +63
                    </span>
                    <input
                      name="phone" type="tel" value={form.phone} onChange={handlePhone}
                      className="form-control py-2"
                      placeholder="9XX XXX XXXX"
                      style={{
                        ...fieldStyle,
                        '--placeholder-color': 'var(--text-muted)',
                      }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label mb-1" style={labelStyle}>Delivery Address *</label>
                  <textarea name="address" value={form.address} onChange={handleChange}
                    className="form-control py-2 rounded-3" rows="3"
                    placeholder="Complete building, street, barangay, city and province" style={fieldStyle}></textarea>
                </div>

                <hr style={{ borderColor: 'var(--card-border)', margin: '1rem 0' }} />

                {/* ── Payment Method ── */}
                <h6 className="mb-3 fw-bold d-flex align-items-center checkout-section-heading"
                  style={{ color: 'var(--price-color)', fontFamily: "'DM Sans', sans-serif" }}>
                  <i className="bi bi-wallet2 me-2"></i>Payment Method
                </h6>

                <div className="row g-2 mb-3">
                  {[
                    { id: 'gcash', label: 'GCash',           img: '/images/gcash.png', icon: null },
                    { id: 'maya',  label: 'Maya',            img: '/images/maya.png',  icon: null },
                    { id: 'card',  label: 'Debit / Credit',  img: null, icon: 'bi-credit-card-fill' },
                    { id: 'cod',   label: 'Cash on Delivery', img: null, icon: 'bi-box-seam-fill' },
                  ].map(p => (
                    <div className="col-6" key={p.id}>
                      <input type="radio" className="btn-check" name="payment" id={`pay-${p.id}`}
                        value={p.id} checked={form.payment === p.id} onChange={handleChange} />
                      <label
                        className="btn btn-sm w-100 d-flex flex-column align-items-center justify-content-center p-3 rounded-3"
                        htmlFor={`pay-${p.id}`}
                        style={{
                          height: 74,
                          border: form.payment === p.id ? '2px solid #800020' : '1px solid var(--card-border)',
                          background: form.payment === p.id ? 'rgba(128,0,32,0.07)' : 'var(--input-bg)',
                          color: form.payment === p.id ? '#800020' : 'var(--text-dark)',
                          transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
                          cursor: 'pointer',
                        }}
                      >
                        {p.img
                          ? <img src={p.img} alt={p.label} style={{ height: 22, objectFit: 'contain' }} className="mb-1" />
                          : <i className={`bi ${p.icon} mb-1`} style={{ fontSize: '1.2rem' }}></i>
                        }
                        <span className="fw-bold" style={{ fontSize: '0.67rem' }}>{p.label}</span>
                      </label>
                    </div>
                  ))}
                </div>

                {/* ── GCash number field — BLUE theme ── */}
                {form.payment === 'gcash' && (
                  <div className="mb-3 rounded-3 p-3" style={{ background: `rgba(0,80,200,0.05)`, border: `1px solid rgba(0,80,200,0.2)` }}>
                    <label className="form-label mb-2 d-flex align-items-center gap-1" style={{ ...labelStyle, color: gcashColor }}>
                      <i className="bi bi-phone-fill"></i> GCash Registered Number *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text fw-bold" style={{ ...fieldStyle, borderRadius: '8px 0 0 8px', fontSize: '0.85rem', borderColor: `rgba(0,80,200,0.3)`, color: gcashColor, background: `rgba(0,80,200,0.06)` }}>+63</span>
                      <input
                        type="tel" value={form.gcashNumber} onChange={handleGcashNumber}
                        className="form-control py-2"
                        placeholder="9XX XXX XXXX"
                        style={{ ...fieldStyle, borderColor: `rgba(0,80,200,0.3)` }}
                      />
                    </div>
                    <small className="d-block mt-1" style={{ color: gcashColor, fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', opacity: 0.85 }}>
                      <i className="bi bi-info-circle me-1"></i>You will receive a payment request on this number.
                    </small>
                  </div>
                )}

                {/* ── Maya number field — GREEN theme ── */}
                {form.payment === 'maya' && (
                  <div className="mb-3 rounded-3 p-3" style={{ background: `rgba(0,122,77,0.05)`, border: `1px solid rgba(0,122,77,0.2)` }}>
                    <label className="form-label mb-2 d-flex align-items-center gap-1" style={{ ...labelStyle, color: mayaColor }}>
                      <i className="bi bi-phone-fill"></i> Maya Registered Number *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text fw-bold" style={{ ...fieldStyle, borderRadius: '8px 0 0 8px', fontSize: '0.85rem', borderColor: `rgba(0,122,77,0.3)`, color: mayaColor, background: `rgba(0,122,77,0.06)` }}>+63</span>
                      <input
                        type="tel" value={form.mayaNumber} onChange={handleMayaNumber}
                        className="form-control py-2"
                        placeholder="9XX XXX XXXX"
                        style={{ ...fieldStyle, borderColor: `rgba(0,122,77,0.3)` }}
                      />
                    </div>
                    <small className="d-block mt-1" style={{ color: mayaColor, fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', opacity: 0.85 }}>
                      <i className="bi bi-info-circle me-1"></i>You will receive a payment request on this number.
                    </small>
                  </div>
                )}

                {/* ── Card details — no inline warnings, clean layout ── */}
                {form.payment === 'card' && (
                  <div className="mb-3 rounded-3 p-3" style={{ background: 'rgba(128,0,32,0.04)', border: '1px solid rgba(128,0,32,0.18)' }}>
                    <h6 className="fw-bold mb-3 d-flex align-items-center checkout-section-heading"
                      style={{ color: 'var(--price-color)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem' }}>
                      <i className="bi bi-credit-card-2-front-fill me-2"></i>Card Details
                    </h6>
                    <div className="mb-2">
                      <label className="form-label mb-1" style={labelStyle}>Name on Card *</label>
                      <input type="text" name="cardName" value={form.cardName} onChange={handleChange}
                        className="form-control form-control-sm rounded-3"
                        placeholder="BILL C MAMORNO"
                        style={fieldStyle} />
                    </div>
                    <div className="mb-2">
                      <label className="form-label mb-1" style={labelStyle}>Card Number *</label>
                      <input type="text" value={form.cardNumber} onChange={handleCardNumber}
                        className="form-control form-control-sm rounded-3"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19} style={{ ...fieldStyle, letterSpacing: '0.08em' }} />
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label mb-1" style={labelStyle}>Expiry *</label>
                        <input type="text" value={form.cardExpiry} onChange={handleCardExpiry}
                          className="form-control form-control-sm rounded-3"
                          placeholder="MM/YY"
                          maxLength={5} style={fieldStyle} />
                      </div>
                      <div className="col-6">
                        <label className="form-label mb-1" style={labelStyle}>CVV *</label>
                        <input type="password" name="cardCvv" value={form.cardCvv}
                          onChange={e => setForm({ ...form, cardCvv: e.target.value.replace(/\D/g,'').slice(0,4) })}
                          className="form-control form-control-sm rounded-3"
                          placeholder="•••"
                          maxLength={4} style={fieldStyle} />
                      </div>
                    </div>
                    <small style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', marginTop: 6, display: 'block' }}>
                      <i className="bi bi-lock-fill me-1"></i>Your card details are encrypted and secure.
                    </small>
                  </div>
                )}

                <hr style={{ borderColor: 'var(--card-border)', margin: '1rem 0' }} />

                {/* ── Promo / Voucher Code ── */}
                <h6 className="mb-2 fw-bold d-flex align-items-center checkout-section-heading"
                  style={{ color: 'var(--price-color)', fontFamily: "'DM Sans', sans-serif" }}>
                  <i className="bi bi-tag-fill me-2"></i>Promo / Voucher Code
                </h6>

                {promoApplied ? (
                  <div className="d-flex align-items-center justify-content-between rounded-3 p-2 mb-4"
                    style={{ background: 'rgba(26,154,26,0.08)', border: '1px solid rgba(26,154,26,0.25)' }}>
                    <span style={{ color: '#1a7a1a', fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 600 }}>
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <strong>{promoApplied.code}</strong> — {promoApplied.label}
                    </span>
                    <button type="button" onClick={() => setPromoApplied(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif" }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="input-group">
                      <input
                        type="text" value={promoInput}
                        onChange={e => { setPromoInput(e.target.value.toUpperCase()); setPromoError(''); }}
                        className="form-control form-control-sm rounded-start-pill"
                        placeholder="Enter code (e.g. BILLS10)"
                        style={{ ...fieldStyle, textTransform: 'uppercase', letterSpacing: '0.06em' }}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyPromo())}
                      />
                      <button type="button" onClick={applyPromo}
                        className="btn btn-sm rounded-end-pill fw-bold px-3"
                        style={{ background: '#800020', color: '#fff', border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem' }}>
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <small style={{ color: '#800020', fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', marginTop: 4, display: 'block' }}>
                        <i className="bi bi-exclamation-circle me-1"></i>{promoError}
                      </small>
                    )}
                    <small style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', marginTop: 3, display: 'block' }}>
                      Available codes: BILLS10, BILLS50, FEUTECH, FREESHIP
                    </small>
                  </div>
                )}

                {/* Desktop submit */}
                <div className="d-none d-lg-flex gap-3 mt-2">
                  <Link to="/cart" className="btn btn-sm fw-bold py-2 rounded-pill flex-grow-1"
                    style={{ background: 'var(--input-bg)', color: 'var(--text-dark)', border: '1px solid var(--card-border)', fontFamily: "'DM Sans', sans-serif" }}>
                    <i className="bi bi-arrow-left me-2"></i>Back
                  </Link>
                  <button type="submit" className="btn fw-bold py-2 px-4 rounded-pill flex-grow-1"
                    style={{ background: '#800020', color: '#fff', border: 'none', fontFamily: "'DM Sans', sans-serif" }}>
                    Confirm Order <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ── Order Summary — no scrollbar, shows all items ── */}
        <div className="col-lg-5">
          <div className="rounded-4 position-sticky"
            style={{ top: '5rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="py-3 px-4 rounded-top-4 text-white"
              style={{ background: 'linear-gradient(135deg, #800020, #5a0016)' }}>
              <h6 className="mb-0 fw-bold d-flex justify-content-between align-items-center"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Order Summary
                <span className="badge rounded-pill px-2"
                  style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.68rem' }}>
                  {cart.length} item{cart.length !== 1 ? 's' : ''}
                </span>
              </h6>
            </div>

            <div className="p-4">
              {/* Cart items — NO scrollbar, show all */}
              <div className="mb-4">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="d-flex justify-content-between align-items-center mb-3 pb-3"
                    style={{ borderBottom: '1px solid var(--card-border)', cursor: 'pointer' }}
                    onClick={() => navigate(`/products#product-${item.id}`)}
                    title="Click to find this product"
                  >
                    <div className="d-flex align-items-center pe-2 flex-grow-1 overflow-hidden">
                      <div className="rounded-2 p-1 me-3 flex-shrink-0"
                        style={{ width: 44, height: 44, background: 'var(--input-bg)', border: '1px solid var(--card-border)' }}>
                        <img src={item.image} alt={item.name} className="w-100 h-100" style={{ objectFit: 'contain' }} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="mb-1 fw-bold text-truncate lh-sm"
                          style={{ fontSize: '0.78rem', color: 'var(--text-dark)', fontFamily: "'DM Sans', sans-serif" }} title={item.name}>
                          {item.name}
                        </p>
                        <span className="badge rounded-pill px-2 py-1 product-price-label"
                          style={{ background: 'rgba(128,0,32,0.08)', color: 'var(--price-color)', fontSize: '0.64rem', fontFamily: "'DM Sans', sans-serif" }}>
                          Qty: {item.qty}
                        </span>
                      </div>
                    </div>
                    <span className="fw-bold flex-shrink-0"
                      style={{ fontSize: '0.78rem', color: 'var(--text-dark)', fontFamily: "'DM Sans', sans-serif" }}>
                      {fmt(parseFloat(item.price) * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="rounded-3 p-3"
                style={{ background: 'rgba(128,0,32,0.04)', border: '1px solid rgba(128,0,32,0.1)' }}>
                {[
                  { label: 'Subtotal',  value: fmt(subtotal) },
                  { label: 'Tax (12%)', value: fmt(tax) },
                ].map((row, i) => (
                  <div key={i} className="d-flex justify-content-between mb-2" style={{ fontSize: '0.84rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>{row.label}</span>
                    <span className="fw-bold" style={{ color: 'var(--text-dark)', fontFamily: "'DM Sans', sans-serif" }}>{row.value}</span>
                  </div>
                ))}
                {promoApplied && (
                  <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.84rem' }}>
                    <span style={{ color: '#1a7a1a', fontFamily: "'DM Sans', sans-serif" }}>
                      <i className="bi bi-tag-fill me-1"></i>Promo ({promoApplied.code})
                    </span>
                    <span className="fw-bold" style={{ color: '#1a7a1a', fontFamily: "'DM Sans', sans-serif" }}>-{fmt(discount)}</span>
                  </div>
                )}
                <hr style={{ borderColor: 'var(--card-border)', margin: '8px 0' }} />
                <div className="d-flex justify-content-between align-items-center pt-1">
                  <span className="fw-bold text-uppercase"
                    style={{ fontSize: '0.75rem', letterSpacing: '0.06em', color: 'var(--text-dark)', fontFamily: "'DM Sans', sans-serif" }}>
                    Total
                  </span>
                  <span className="fs-5 fw-bold product-price-label" style={{ color: 'var(--price-color)', fontFamily: "'Playfair Display', serif" }}>
                    {fmt(total)}
                  </span>
                </div>
              </div>

              {/* Mobile submit */}
              <div className="d-block d-lg-none mt-4">
                <button type="submit" form="checkoutForm"
                  className="btn w-100 fw-bold py-3 rounded-pill"
                  style={{ background: '#800020', color: '#fff', border: 'none', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif" }}>
                  Confirm Order <i className="bi bi-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
