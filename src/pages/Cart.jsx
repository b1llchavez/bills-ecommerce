
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

// Cart page: displays items in cart, allows qty changes and removal,
// and shows an order summary with total amount.
const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useContext(CartContext);
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.qty, 0);

  const fmt = (v) => '₱' + parseFloat(v).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Show a friendly empty-cart state when there are no items
  if (cart.length === 0) {
    return (
      <div className="container d-flex justify-content-center align-items-center pt-5" style={{ minHeight: '65vh' }}>
        <div className="text-center p-4 p-md-5 rounded-4"
          style={{ maxWidth: 440, width: '100%', background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
          <i className="bi bi-cart-x d-block mb-3" style={{ fontSize: '3.5rem', color: '#800020', opacity: 0.35 }}></i>
          <h4 className="fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-dark)' }}>
            Your Cart is Empty
          </h4>
          <p className="mb-4" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
            You haven't added anything to your cart yet.
          </p>
          <Link to="/products" className="btn rounded-pill px-4 py-2 fw-bold"
            style={{ background: '#800020', color: '#fff', border: 'none', fontFamily: "'DM Sans', sans-serif" }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4 my-lg-5 pt-2 page-enter" style={{ maxWidth: 1000 }}>
      <div className="d-flex justify-content-between align-items-end mb-4 pb-3"
        style={{ borderBottom: '1px solid var(--card-border)' }}>
        <h3 className="mb-0 fw-bold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-dark)' }}>
          Shopping Cart
        </h3>
        <span className="fw-semibold small" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
          {cart.length} item{cart.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="row g-4 g-lg-5">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="rounded-4 overflow-hidden"
            style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
            {cart.map((item, idx) => (
              <div key={item.id} className="row align-items-center m-0 p-3 p-md-4"
                style={{ borderBottom: idx !== cart.length - 1 ? '1px solid var(--card-border)' : 'none' }}>

                {/* Product info — clickable to find product */}
                <div className="col-12 col-md-6 mb-3 mb-md-0 p-0">
                  <div
                    className="d-flex align-items-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/products#product-${item.id}`)}
                    title="Click to find this product"
                  >
                    <div className="rounded-3 p-2 me-3 flex-shrink-0"
                      style={{ width: 72, height: 72, background: 'var(--input-bg)', border: '1px solid var(--card-border)' }}>
                      <img src={item.image} alt={item.name}
                        className="w-100 h-100" style={{ objectFit: 'contain' }} />
                    </div>
                    <div className="overflow-hidden pe-2">
                      <h6 className="mb-1 fw-bold text-truncate" title={item.name}
                        style={{ color: 'var(--text-dark)', fontSize: '0.86rem', fontFamily: "'DM Sans', sans-serif" }}>
                        {item.name}
                      </h6>
                      <span className="fw-semibold small" style={{ color: '#800020', fontFamily: "'DM Sans', sans-serif" }}>
                        {fmt(item.price)}
                      </span>
                      <small className="d-block" style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: "'DM Sans', sans-serif" }}>
                        <i className="bi bi-search me-1"></i>Click to view product
                      </small>
                    </div>
                  </div>
                </div>

                {/* Qty */}
                <div className="col-6 col-md-3 p-0 d-flex justify-content-start justify-content-md-center align-items-center">
                  <div className="input-group input-group-sm" style={{ maxWidth: 96 }}>
                    <button onClick={() => decreaseQty(item.id)}
                      className="btn btn-outline-secondary px-2 fw-bold" type="button"
                      style={{ borderColor: 'var(--card-border)', color: 'var(--text-dark)' }}>−</button>
                    <input type="text" className="form-control text-center fw-bold" value={item.qty} readOnly
                      style={{ background: 'var(--input-bg)', color: 'var(--text-dark)', borderColor: 'var(--card-border)', fontFamily: "'DM Sans', sans-serif" }} />
                    <button onClick={() => increaseQty(item.id)}
                      className="btn btn-outline-secondary px-2 fw-bold" type="button"
                      style={{ borderColor: 'var(--card-border)', color: 'var(--text-dark)' }}>+</button>
                  </div>
                </div>

                {/* Subtotal + remove */}
                <div className="col-6 col-md-3 p-0 text-end">
                  <span className="fw-bold d-block mb-1"
                    style={{ color: 'var(--text-dark)', fontFamily: "'DM Sans', sans-serif" }}>
                    {fmt(parseFloat(item.price) * item.qty)}
                  </span>
                  <button onClick={() => removeFromCart(item.id)}
                    className="btn btn-link p-0 text-decoration-none small fw-semibold"
                    style={{ color: '#800020', fontFamily: "'DM Sans', sans-serif" }}>
                    <i className="bi bi-trash3-fill me-1"></i>Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="col-lg-4">
          <div className="rounded-4 position-sticky"
            style={{ top: '5rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="py-3 px-4 rounded-top-4 text-white"
              style={{ background: 'linear-gradient(135deg, #800020, #5a0016)' }}>
              <h6 className="mb-0 fw-bold d-flex justify-content-between align-items-center"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Order Summary
                <span className="badge rounded-pill px-2" style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>
                  {cart.length} item{cart.length !== 1 ? 's' : ''}
                </span>
              </h6>
            </div>
            <div className="p-4">
              <div className="d-flex justify-content-between mb-3">
                <span style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>Subtotal</span>
                <span className="fw-bold" style={{ color: 'var(--text-dark)', fontFamily: "'DM Sans', sans-serif" }}>{fmt(total)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 pb-3" style={{ borderBottom: '1px solid var(--card-border)' }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem' }}>Delivery</span>
                <span className="fw-bold" style={{ color: '#1a9a1a', fontFamily: "'DM Sans', sans-serif" }}>Free</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold text-uppercase"
                  style={{ fontSize: '0.78rem', letterSpacing: '0.06em', color: 'var(--text-dark)', fontFamily: "'DM Sans', sans-serif" }}>
                  Total
                </span>
                <span className="fs-4 fw-bold product-price-label" style={{ color: 'var(--price-color)', fontFamily: "'Playfair Display', serif" }}>
                  {fmt(total)}
                </span>
              </div>
              <Link to="/checkout" className="btn w-100 rounded-pill py-2 fw-bold"
                style={{ background: '#800020', color: '#fff', border: 'none', fontFamily: "'DM Sans', sans-serif" }}>
                Proceed to Checkout <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
