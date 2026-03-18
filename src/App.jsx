import { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';

/*
  DarkModeTransition
  - Small overlay component used when toggling dark mode.
  - Shows a central icon and decorative particles during the transition.
*/
const DarkModeTransition = ({ type }) => {
  const isDark = type === 'to-dark';
  return (
    <div
      className={`darkmode-transition-overlay ${type}`}
      aria-hidden="true"
    >
      {/* Central glowing icon */}
      <div className="dm-center-icon-wrap">
        {/* Glow rings */}
        <div className="dm-glow-ring dm-glow-ring-1"></div>
        <div className="dm-glow-ring dm-glow-ring-2"></div>
        <div className="dm-glow-ring dm-glow-ring-3"></div>
        {/* Icon */}
        <div className="dm-center-icon">
          {isDark ? '🌙' : '☀️'}
        </div>
        {/* Orbiting particles */}
        <div className="dm-particle dm-p1"></div>
        <div className="dm-particle dm-p2"></div>
        <div className="dm-particle dm-p3"></div>
        <div className="dm-particle dm-p4"></div>
        <div className="dm-particle dm-p5"></div>
        <div className="dm-particle dm-p6"></div>
      </div>
    </div>
  );
};

// App: top-level application component with routing and global UI
function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('bills_dark_mode') === 'true';
  });
  const [dmTransition, setDmTransition] = useState(null);
  const transitionKey = useRef(0);

  useEffect(() => {
    // Toggle `dark-mode` class on <body> and persist preference
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('bills_dark_mode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    const goingDark = !darkMode;
    transitionKey.current += 1;
    // Trigger a short visual transition and flip the mode
    setDmTransition({ type: goingDark ? 'to-dark' : 'to-light', key: transitionKey.current });
    setDarkMode(goingDark);
    setTimeout(() => setDmTransition(null), 900);
  }, [darkMode]);

  return (
    <Router>
      <div className="page-orbs" aria-hidden="true">
        <div className="page-orb-mid"></div>
      </div>

      {/* Elegant dark mode transition with glowing center icon */}
      {dmTransition && (
        <DarkModeTransition key={dmTransition.key} type={dmTransition.type} />
      )}

      <ScrollToTop />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main style={{ paddingTop: '66px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart"     element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about"    element={<About />} />
          <Route path="/contact"  element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
