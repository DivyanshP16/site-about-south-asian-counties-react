import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const isJsdom = /jsdom/i.test(window.navigator.userAgent);

    if (!isJsdom && typeof window.scrollTo === 'function') {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
}

export default ScrollToTop;