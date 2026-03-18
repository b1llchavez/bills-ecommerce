import { createContext, useState } from 'react';

// CartContext: provides cart state and helper actions to manage shopping cart
export const CartContext = createContext();

const CartProvider = ({ children }) => {
    // `cart` holds an array of product objects with a `qty` property
    const [cart, setCart] = useState([]);

    // Add a product to cart or increase qty if it already exists
    const addToCart = (product) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, qty: 1 }];
        });
    };

    // Remove a product from the cart by id
    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    // Increase quantity for a cart item
    const increaseQty = (id) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id
                    ? { ...item, qty: item.qty + 1 }
                    : item
            )
        );
    };

    // Decrease quantity for a cart item but never below 1
    const decreaseQty = (id) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id && item.qty > 1
                    ? { ...item, qty: item.qty - 1 }
                    : item
            )
        );
    };

    // Clear the entire cart (used after successful checkout)
    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;