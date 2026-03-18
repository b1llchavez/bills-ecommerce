import { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

// Wishlist page
// - Shows products the user has saved to their wishlist.
// - If there are no saved items, display a friendly empty state
//   with a call-to-action to browse products.
const Wishlist = () => {
  // Read wishlist array from WishlistContext
  const { wishlist } = useContext(WishlistContext);

  // Empty-state: guide the user to browse products when wishlist is empty
  if (wishlist.length === 0) {
    return (
      <div className="container d-flex justify-content-center align-items-center pt-5 page-enter" style={{ minHeight: '65vh' }}>
        <div className="text-center p-4 p-md-5 rounded-4"
          style={{ maxWidth: 440, background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-sm)' }}>
          <i className="bi bi-heart d-block mb-3" style={{ fontSize: '3.5rem', color: '#800020', opacity: 0.35 }}></i>
          <h4 className="fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-dark)' }}>
            Your Wishlist is Empty
          </h4>
          <p className="mb-4" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
            Save your favourite products to revisit them later.
          </p>
          <Link to="/products" className="btn rounded-pill px-4 py-2 fw-bold"
            style={{ background: '#800020', color: '#fff', border: 'none', fontFamily: "'DM Sans', sans-serif" }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // When wishlist has items, render them in a responsive grid using ProductCard
  return (
    <div className="container my-4 my-lg-5 pt-2 page-enter" style={{ maxWidth: 1100 }}>
      <div className="d-flex justify-content-between align-items-end mb-4 pb-3"
        style={{ borderBottom: '1px solid var(--card-border)' }}>
        <h3 className="mb-0 fw-bold" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-dark)' }}>
          <i className="bi bi-heart-fill me-2" style={{ color: '#800020' }}></i>My Wishlist
        </h3>
        {/* Show count of saved items with proper pluralization */}
        <span className="fw-semibold small" style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
          {wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
        {wishlist.map(product => (
          <div className="col" key={product.id}>
            {/* Reuse ProductCard for consistent product UI and actions */}
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
