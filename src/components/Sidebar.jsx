import { useEffect, useState } from "react";

// Sidebar: provides category, sort, and price range filters used on
// the product listing page. Fetches categories from the fake API.
const Sidebar = ({ onCategoryChange, onSortChange, onPriceChange, selectedCategory, selectedSort, priceRange }) => {
  // State for product categories fetched from API
  const [categories, setCategories] = useState([]);

  // Fetch available product categories on component mount
  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // Helper function to return appropriate icon based on category name
  const categoryIcon = (cat) => {
    if (!cat) return 'bi-tag';
    const c = cat.toLowerCase();
    if (c.includes('electronic')) return 'bi-cpu';
    if (c.includes("men") || c.includes("women") || c.includes("clothing")) return 'bi-person';
    if (c.includes('jewel')) return 'bi-gem';
    return 'bi-tag';
  };

  // Maximum price value for price range slider (in PHP)
  const MAX_PRICE = 60000;

  // Helper function to format price values for display in price range filter
  const formatPHPLabel = (val) => {
    if (val >= 1000) return '₱' + (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'k';
    return '₱' + val;
  };

  return (
    <div className="sticky-top" style={{ top: 88, zIndex: 1 }}>

      {/* Category Filter Section */}
      <div className="mb-4">
        <h6
          className="fw-bold mb-3 section-heading-accent"
          style={{ color: '#800020', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif" }}
        >
          Browse by Category
        </h6>
        <div className="d-flex flex-column gap-1">
          {/* All Products button - shows all items regardless of category */}
          <button
            onClick={() => onCategoryChange('all')}
            className={`btn btn-sm text-start rounded-3 px-3 py-2 sidebar-link${selectedCategory === 'all' ? ' active' : ''}`}
            style={{
              color: selectedCategory === 'all' ? '#800020' : 'var(--text-dark)',
              fontWeight: selectedCategory === 'all' ? 700 : 400,
              background: selectedCategory === 'all' ? 'var(--maroon-soft)' : 'transparent',
              fontSize: '0.88rem', border: 'none',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <i className="bi bi-grid me-2" style={{ color: '#800020' }}></i>
            All Products
          </button>

          {/* Map through fetched categories to create category buttons */}
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => onCategoryChange(cat)}
              className={`btn btn-sm text-start rounded-3 px-3 py-2 sidebar-link text-capitalize${selectedCategory === cat ? ' active' : ''}`}
              style={{
                color: selectedCategory === cat ? '#800020' : 'var(--text-dark)',
                fontWeight: selectedCategory === cat ? 700 : 400,
                background: selectedCategory === cat ? 'var(--maroon-soft)' : 'transparent',
                fontSize: '0.88rem', border: 'none',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <i className={`bi ${categoryIcon(cat)} me-2`} style={{ color: '#800020' }}></i>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <hr className="gold-divider" />

      {/* Sort Options Section */}
      <div className="mb-4">
        <h6
          className="fw-bold mb-3 section-heading-accent"
          style={{ color: '#800020', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif" }}
        >
          Sort By
        </h6>
        {/* Dropdown menu with various sorting options */}
        <select
          className="form-select form-select-sm rounded-3"
          value={selectedSort}
          onChange={e => onSortChange(e.target.value)}
          style={{
            borderColor: 'rgba(128,0,32,0.25)', fontSize: '0.85rem',
            background: 'var(--input-bg)', color: 'var(--text-dark)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <option value="default">Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A–Z</option>
          <option value="name_desc">Name: Z–A</option>
          <option value="rating_desc">Top Rated</option>
        </select>
      </div>

      <hr className="gold-divider" />

      {/* Price Range Filter Section */}
      <div className="mb-4">
        <h6
          className="fw-bold mb-3 section-heading-accent"
          style={{ color: '#800020', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif" }}
        >
          Price Range
        </h6>
        {/* Min and max price labels with current selected value */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>₱0</small>
          {/* Badge displaying current selected price range */}
          <span
            className="badge rounded-pill px-3 py-1"
            style={{ background: 'rgba(128,0,32,0.1)', color: '#800020', fontSize: '0.78rem', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}
          >
            Up to {formatPHPLabel(priceRange)}
          </span>
          <small style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans', sans-serif" }}>₱60k</small>
        </div>
        {/* Range slider input for price filtering */}
        <input
          type="range"
          className="form-range w-100"
          min="500" max={MAX_PRICE} step="500"
          value={priceRange}
          onChange={e => onPriceChange(Number(e.target.value))}
        />
      </div>

    </div>
  );
};

export default Sidebar;
