<div align="center">

<img src="public/icon-512x512.png" alt="Bill's Logo" width="90" />

# Bill's E-Commerce

### *"Bill got it all for you."*

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Site-800020?style=for-the-badge)](https://billmamorno.github.io/bills-ecommerce)
[![React](https://img.shields.io/badge/React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Bootstrap](https://img.shields.io/badge/Bootstrap%205-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-c9a84c?style=for-the-badge)](LICENSE)

A full-featured, mobile-first React e-commerce web application — built as the **Final Project** for *Advanced Web Design* at **FEU Institute of Technology**, A.Y. 2025–2026, 2nd Term.

</div>

---

## 📸 Preview

| 🏠 Home | 🛍️ Products |
|:---:|:---:|
| ![Home](.github/screenshots/home.png) | ![Products](.github/screenshots/products.png) |
| **🛒 Cart** | **💳 Checkout** |
| ![Cart](.github/screenshots/cart.png) | ![Checkout](.github/screenshots/checkout.png) |

---

## ✨ What's Inside

### 🛒 Shopping Experience
- **Live Product Catalogue** — fetched in real-time from [FakeStore API](https://fakestoreapi.com), displayed in a clean responsive grid
- **Category Filtering** — Electronics, Men's & Women's Clothing, Jewelry
- **Smart Search** — full-text search with URL query params (`/products?q=...`)
- **Sort & Price Range Slider** — sort by price, name, or rating; filter by PHP price range
- **Product Quick-View Modal** — tap any card for a full detail view with features, ratings, and quick actions

### 🧺 Cart & Wishlist
- **Persistent Cart** — add, remove, and adjust quantities; live running total
- **Wishlist** — save items for later, persists via `localStorage`
- **Order Summary Panel** — subtotal, free delivery badge, sticky checkout button

### 💳 Checkout Flow
- **Delivery Form** with full field validation
- **4 Payment Methods** — Cash on Delivery, GCash, Maya, Credit/Debit Card
  - Live card number auto-formatting (groups of 4)
  - Expiry date auto-formatting (`MM/YY`)
- **Promo Code System** — apply discount codes at checkout
- **12% VAT** — automatically calculated
- **Order Confirmation Screen** — clears cart and displays a receipt

### 🎨 UI & Experience Details
- 🌙 **Animated Dark Mode** — moon/sun toggle with a glowing particle overlay transition
- 💀 **Skeleton Loaders** — shown while products are fetching
- 🔢 **Animated Stats Counter** — numbers count up on the homepage
- 📜 **Scroll Reveal Animations** — sections animate in via IntersectionObserver
- 📱 **Mobile Bottom Navigation Bar** — dedicated nav for small screens
- 🔖 **Trust Badges Row** — scrollable with bidirectional swipe hints on mobile
- ⬆️ **Auto Scroll-to-Top** — on every route change
- 📲 **PWA Ready** — service worker registered for offline/installable support

---

## 🗺️ Pages

| Route | Page | Description |
|---|---|---|
| `/` | **Home** | Hero, featured products, stats, categories, recently viewed |
| `/products` | **Products** | Full catalogue with sidebar filters + search |
| `/cart` | **Cart** | Item list, quantity controls, order summary |
| `/checkout` | **Checkout** | Delivery form, payment methods, promo codes, confirmation |
| `/wishlist` | **Wishlist** | Saved products grid |
| `/about` | **About** | Store story and founder profile |
| `/contact` | **Contact** | Contact form and store info |

---

## 🧱 Tech Stack

| | Technology | Purpose |
|---|---|---|
| ⚛️ | **React 18** | UI framework with Hooks |
| ⚡ | **Vite** | Build tool & dev server |
| 🗺️ | **React Router v6** | Client-side routing |
| 🎨 | **Bootstrap 5** | Responsive layout & components |
| 🖌️ | **Custom CSS** | CSS variables, animations, dark mode |
| 🔣 | **Bootstrap Icons + Font Awesome** | Icon libraries |
| 🔤 | **Playfair Display, DM Sans** | Google Fonts |
| 🧠 | **React Context API** | Global state (Cart, Wishlist) |
| 🌐 | **FakeStore API** | Product data source |
| 💾 | **localStorage** | Dark mode, wishlist, recently viewed |
| 📲 | **Service Worker** | PWA / offline support |

---

## 🗂️ Project Structure

```
bills-ecommerce/
│
├── public/
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker
│   ├── screenshot-desktop.png
│   ├── screenshot-mobile.png
│   └── images/
│       ├── bill picture.png
│       ├── bill1.png
│       ├── bill2.png
│       ├── bill3.png
│       ├── gcash.png
│       └── maya.png
│
├── src/
│   ├── assets/
│   │   └── images/             # Static asset images
│   │
│   ├── components/
│   │   ├── Footer.jsx          # Footer with newsletter form
│   │   ├── Header.jsx          # Simple page header
│   │   ├── Navbar.jsx          # Top nav + mobile bottom nav
│   │   ├── ProductCard.jsx     # Card + quick-view modal
│   │   ├── ScrollToTop.jsx     # Auto-scroll on route change
│   │   └── Sidebar.jsx         # Category / sort / price filters
│   │
│   ├── context/
│   │   ├── CartContext.jsx     # Global cart state & actions
│   │   └── WishlistContext.jsx # Global wishlist state
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ProductList.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Wishlist.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   │
│   ├── App.jsx                 # Routes + dark mode transition
│   ├── main.jsx                # Entry point + context providers
│   └── index.css               # Global styles, variables, animations
│
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** (comes with Node)

### Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/billmamorno/bills-ecommerce.git
cd bills-ecommerce

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) 🎉

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Build optimized production bundle to `/dist` |
| `npm run preview` | Preview the production build locally |

---

## 🎁 Promo Codes

Try these at checkout:

| Code | Reward |
|---|---|
| `BILLS10` | 10% off subtotal |
| `BILLS50` | ₱50 flat discount |
| `FEUTECH` | 15% off (FEU exclusive) |
| `FREESHIP` | ₱30 shipping bonus |

---

## 👤 Author

<div align="center">

<img src="public/images/bill picture.png" alt="Bill C. Mamorno" width="110" style="border-radius:50%;border:3px solid #800020;" />

### Bill C. Mamorno

*Sophomore Full Scholar · BS Information Technology – Business Analytics*
**FEU Institute of Technology**

[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=flat-square&logo=facebook&logoColor=white)](https://www.facebook.com/mamornobillc/)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/b1llchavez)
[![FEU Paraverse](https://img.shields.io/badge/FEU%20Paraverse-800020?style=flat-square&logoColor=white)](https://paraverse.feutech.edu.ph/briefcase/profile/billcmamorno)

</div>

---

## 📋 Academic Context

> **Course:** Advanced Web Design
> **School:** FEU Institute of Technology
> **Academic Year:** 2025–2026, 2nd Term
> **Project Type:** Final Project

### Concepts Demonstrated

- ✅ Component-based architecture with React
- ✅ Client-side routing with React Router v6
- ✅ Global state management via Context API
- ✅ REST API consumption (FakeStore API)
- ✅ Responsive & mobile-first design with Bootstrap 5
- ✅ CSS custom properties, keyframe animations, transitions
- ✅ Form validation and multi-step user flows
- ✅ Progressive Web App (PWA) with service worker
- ✅ `localStorage` for client-side data persistence
- ✅ Dark mode with animated transitions

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

*Made with ❤️ by* **Bill C. Mamorno** *· FEU Institute of Technology · 2026*

**Bill got it all for you.**

</div>
