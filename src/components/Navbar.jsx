import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useRef } from 'react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

// Navbar: top navigation bar with logo, search, dark-mode toggle,
// wishlist and cart shortcuts. Shows desktop and mobile variations.
const Navbar = ({ darkMode, toggleDarkMode }) => {
  // Get cart and wishlist data from context
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  // Calculate total items in cart
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  // Router navigation hook
  const navigate = useNavigate();
  // State for search input and dark mode animation
  const [searchVal, setSearchVal] = useState('');
  const [iconAnimating, setIconAnimating] = useState(false);

  // Handle search form submission - navigate to products page with search query
  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchVal.trim();
    if (q) { navigate(`/products?q=${encodeURIComponent(q)}`); setSearchVal(''); }
  };

  // Handle dark mode toggle with animation effect
  const handleDarkModeToggle = () => {
    setIconAnimating(true);
    toggleDarkMode();
    setTimeout(() => setIconAnimating(false), 600);
  };

  return (
    <>
      <nav className="navbar navbar-dark fixed-top py-2 backdrop-blur shadow-sm top-navbar">
        <div className="container-fluid px-3 px-lg-5 d-flex justify-content-between align-items-center">

          {/* Logo */}
          <Link className="navbar-brand fw-bold m-0 d-flex align-items-center gap-2" to="/">
            <img src="/icon-512x512.png" alt="Bill's Logo"
              style={{ height: 34, width: 34, objectFit: 'contain', borderRadius: '8px' }} />
            <span
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1rem, 4vw, 1.22rem)', letterSpacing: '0.02em' }}>
              Bill's
            </span>
          </Link>

          {/* Desktop navigation links - only visible on large screens */}
          <ul className="navbar-nav flex-row d-none d-lg-flex mx-auto gap-4">
            {/* Map through navigation items to create NavLinks */}
            {[
              { to: '/',         label: 'Home',     end: true },
              { to: '/products', label: 'Products' },
              { to: '/wishlist', label: 'Wishlist' },
              { to: '/about',    label: 'About' },
              { to: '/contact',  label: 'Contact' },
            ].map(({ to, label, end }) => (
              <li className="nav-item" key={to}>
                <NavLink to={to} end={end}
                  className={({ isActive }) => isActive ? 'nav-link active fw-bold' : 'nav-link'}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right-side action buttons - search, dark mode, wishlist, cart */}
          <div className="d-flex align-items-center gap-2">

            {/* Search form with input and submit button */}
            <form className="d-flex align-items-center" onSubmit={handleSearch} role="search">
              <div className="position-relative">
                {/* Search input field */}
                <input
                  className="form-control form-control-sm rounded-pill ps-3 pe-5 navbar-search-input"
                  type="search" placeholder="Search…" aria-label="Search products"
                  value={searchVal} onChange={e => setSearchVal(e.target.value)}
                />
                {/* Search icon button inside input */}
                <button type="submit"
                  className="border-0 bg-transparent position-absolute"
                  style={{ right: 10, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', padding: 0 }}
                  aria-label="Submit search">
                  <i className="bi bi-search" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}></i>
                </button>
              </div>
            </form>

            {/* Contact icon — mobile only */}
            <Link
              to="/contact"
              className="d-flex d-lg-none align-items-center justify-content-center"
              title="Contact Us"
              style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '50%', width: 34, height: 34, flexShrink: 0,
                color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
                border: '1px solid transparent',
                transition: 'background 0.2s ease',
              }}
            >
              <i className="bi bi-envelope-fill" style={{ fontSize: '0.88rem' }}></i>
            </Link>

            {/* Dark mode toggle button with animated icon */}
            <button
              className="btn btn-sm border-0 p-0 text-white d-flex align-items-center justify-content-center"
              onClick={handleDarkModeToggle}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                background: darkMode ? 'rgba(240,208,128,0.18)' : 'rgba(255,255,255,0.08)',
                borderRadius: '50%', width: 34, height: 34, flexShrink: 0,
                border: darkMode ? '1px solid rgba(240,208,128,0.35)' : '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.35s cubic-bezier(0.175,0.885,0.32,1.275)',
                overflow: 'hidden', position: 'relative',
              }}>
              {/* Icon changes based on dark mode state */}
              <i
                className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'} ${iconAnimating ? 'dm-icon-animate' : ''}`}
                style={{
                  fontSize: '0.93rem',
                  color: darkMode ? '#f0d080' : 'rgba(255,255,255,0.85)',
                  transition: 'color 0.3s ease',
                  display: 'block',
                }}
              ></i>
            </button>

            {/* Wishlist button - desktop only, shows item count badge */}
            <Link className="btn btn-outline-light position-relative border-0 p-2 d-none d-lg-flex align-items-center nav-cart-btn"
              to="/wishlist" title="Wishlist">
              <i className="bi bi-heart-fill fs-5"></i>
              {/* Badge showing number of wishlisted items */}
              {wishlist.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{ background: '#800020', fontSize: '0.6rem' }}>{wishlist.length}</span>
              )}
            </Link>

            {/* Cart button - desktop only, shows item count badge */}
            <Link className="btn btn-outline-light position-relative border-0 p-2 d-none d-lg-flex align-items-center nav-cart-btn"
              to="/cart" title="Cart">
              <i className="fa fa-shopping-cart fs-5"></i>
              {/* Badge showing number of items in cart */}
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{ background: '#800020', fontSize: '0.6rem' }}>{cartItemCount}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile bottom navigation - only visible on screens smaller than large */}
      <div className="bottom-nav d-flex d-lg-none justify-content-around align-items-center position-fixed bottom-0 start-0 end-0 shadow-lg">
        {/* Mobile nav items: Home, Shop, Saved, Cart, About */}
        <NavLink to="/" end className={({ isActive }) => isActive ? 'bottom-nav-link active' : 'bottom-nav-link'}>
          <div className="nav-icon-box"><i className="bi bi-house-door-fill"></i></div>
          <span>Home</span>
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? 'bottom-nav-link active' : 'bottom-nav-link'}>
          <div className="nav-icon-box"><i className="bi bi-grid-fill"></i></div>
          <span>Shop</span>
        </NavLink>
        <NavLink to="/wishlist" className={({ isActive }) => isActive ? 'bottom-nav-link active' : 'bottom-nav-link'}>
          <div className="nav-icon-box position-relative">
            <i className="bi bi-heart-fill"></i>
            {/* Badge showing wishlist count on mobile */}
            {wishlist.length > 0 && (
              <span className="position-absolute badge rounded-pill"
                style={{ top: '-4px', right: '-12px', background: '#800020', fontSize: '0.5rem', padding: '0.22em 0.42em' }}>
                {wishlist.length}
              </span>
            )}
          </div>
          <span>Saved</span>
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => isActive ? 'bottom-nav-link active' : 'bottom-nav-link'}>
          <div className="nav-icon-box position-relative">
            <i className="fa fa-shopping-cart"></i>
            {/* Badge showing cart item count on mobile */}
            {cartItemCount > 0 && (
              <span className="position-absolute badge rounded-pill"
                style={{ top: '-4px', right: '-12px', background: '#800020', fontSize: '0.5rem', padding: '0.22em 0.42em' }}>
                {cartItemCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'bottom-nav-link active' : 'bottom-nav-link'}>
          <div className="nav-icon-box"><i className="bi bi-info-circle-fill"></i></div>
          <span>About</span>
        </NavLink>
      </div>
    </>
  );
};

export default Navbar;
