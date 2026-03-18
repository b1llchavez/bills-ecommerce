import { createContext, useState } from 'react';

// WishlistContext: manages saved items for the user's wishlist
export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  // `wishlist` stores product objects that the user has saved
  const [wishlist, setWishlist] = useState([]);

  // Toggle a product in the wishlist: add if missing, remove if present
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  // Helper to check if a product id is in the wishlist
  const isWishlisted = (id) => wishlist.some(p => p.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
