<div align="center">

# 📱 GadgetHub

**Modern Tech & Electronics E-Commerce Platform — Storefront & Admin Portal Template**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

</div>

---

## 📌 Overview

**GadgetHub** is a high-performance, full-featured e-commerce storefront and admin dashboard template tailored for consumer electronics, smartphones, wearables, and tech accessories. 

Designed as a modern portfolio piece and production-ready design system template, it demonstrates advanced Next.js App Router patterns, responsive micro-animations, structured state management with Zustand, and comprehensive form handling.

---

## ✨ Key Features

### 🛒 Customer Storefront
- **Product Discovery & Catalog**: Filter tech products by category, price range, and specs with animated transitions.
- **Interactive Product Detail Pages**: Image carousels, detailed spec sheets, customer reviews, and stock availability indicators.
- **Wishlist & Cart**: Persistent client-side cart and wishlist management powered by Zustand.
- **Seamless Checkout Flow**: Step-by-step checkout interface with Zod-validated customer address and payment forms.
- **User Authentication UI**: Pre-designed Sign In and Registration pages with real-time validation.

### 🛡️ Admin Portal (`/admin`)
- **Dashboard Overview**: Key operational metrics, total revenue counters, and recent order activity logs.
- **Product Management**: Full CRUD interface for managing inventory, pricing, images, and product categories.
- **Banner & Promotional Management**: Manage homepage heroes, promotional carousels, and discount banners.
- **Order Tracking**: Order lifecycle status management (Pending, Processing, Shipped, Delivered).
- **User Management**: View registered user profiles and access roles.

---

## 🛠 Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), `@tailwindcss/postcss`, `tw-animate-css` |
| **Component Primitives** | [Base UI](https://base-ui.com/), [shadcn/ui](https://ui.shadcn.com/), Lucide Icons |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/), Embla Carousel |
| **Data Fetching & Forms** | [TanStack Query v5](https://tanstack.com/query), React Hook Form, Zod |

---

## 📂 Project Structure

```text
GadgetHub/
├── src/
│   ├── app/
│   │   ├── (store)/          # Customer storefront routes (catalog, product, checkout, wishlist)
│   │   ├── admin/            # Admin portal routes (products, categories, banners, orders, users)
│   │   ├── globals.css       # Global styles and Tailwind v4 directives
│   │   └── layout.tsx        # Root layout with providers
│   ├── components/
│   │   ├── admin/            # Admin-specific components & tables
│   │   ├── product/          # Product cards, grids, and filters
│   │   ├── store/            # Storefront navigation, cart drawer, and hero sections
│   │   └── ui/               # Reusable UI primitives (buttons, dialogs, inputs)
│   ├── data/                 # Product mock datasets and catalog definitions
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions (clsx, tailwind-merge)
│   └── store/                # Zustand stores for cart, wishlist, and admin state
├── public/                   # Static assets & product images
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `≥ 18.0.0`
- **Package Manager**: `npm`, `pnpm`, or `bun`

### Installation

1. **Clone repository**:
   ```bash
   git clone https://github.com/your-username/GadgetHub.git
   cd GadgetHub
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
