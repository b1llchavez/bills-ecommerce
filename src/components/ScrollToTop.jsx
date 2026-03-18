import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ScrollToTop: utility component that ensures the window scrolls to top
// when the route (pathname) changes. Helpful for SPA navigation UX.
const ScrollToTop = () => {
  // Get current pathname from router
  const { pathname } = useLocation();

  // Scroll to top whenever pathname changes (on route change)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;