<div align="center">
  <h1>📚 Bibliotheca — Bookstore Management System</h1>
  <p>A full-stack MERN Bookstore Management System with role-based authentication, book browsing, order placement, and admin inventory & order controls.</p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Default Credentials](#default-credentials)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [License](#license)

---

## Overview

**Bibliotheca** is a modern, full-stack bookstore management application designed for both customers and administrators. Customers can browse a curated catalog, manage a shopping cart, and place orders. Administrators have access to an admin panel for managing inventory (books) and overseeing orders.

The application features a sophisticated dark-themed UI, responsive design, and AI-powered PDF metadata extraction using the Gemini API.

---

## Features

### Customer Features
- **Browse Books**: View a curated catalog with search, genre filtering, and pagination.
- **Book Details**: View detailed information for each book, including summaries and metadata.
- **Shopping Cart**: Add books to cart, update quantities, and remove items.
- **Checkout**: Place orders with shipping address and view order history.
- **Authentication**: Secure login and registration with JWT-based sessions.

### Admin Features
- **Inventory Management**: Add, edit, and delete books from the catalog.
- **Order Management**: View all customer orders and update order statuses (Pending, Processing, Shipped, Delivered, Cancelled).
- **AI-Powered PDF Extraction**: Upload PDF book covers or introductory pages to automatically extract metadata (title, author, genre, summary, etc.) using Gemini AI.

### General Features
- **Responsive Design**: Fully responsive UI built with Tailwind CSS.
- **Dark Theme**: Elegant dark-themed interface with gold accents.
- **Toast Notifications**: Real-time feedback for user actions.
- **Persistent Cart**: Shopping cart persists across sessions using localStorage.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, React Router DOM, Tailwind CSS, Lucide React, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | JSON-based file storage (`data/books.json`, `data/users.json`, `data/orders.json`) |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **AI Integration** | Google GenAI (Gemini 2.5 Flash) for PDF metadata extraction |
| **Build Tool** | Vite |
| **Bundler** | esbuild |

---

## Project Structure

```
bookstore-management-system/
├── data/                       # JSON data files (books, users, orders)
├── src/
│   ├── components/             # Reusable UI components (BookCard, Header, Modal, Toast)
│   ├── context/                # React context for global state management (AppContext)
│   ├── pages/                  # Application pages (Home, Books, Cart, Login, etc.)
│   ├── utils/                  # Utility functions (PDF metadata extractor)
│   ├── App.jsx                 # Main application component with routing
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles and Tailwind configuration
├── server.js                   # Express server with API routes and Vite dev middleware
├── server-db.js                # Database helper functions for JSON file operations
├── package.json                # Project dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A Gemini API key (for PDF metadata extraction feature)

### Installation

1. **Clone the repository** (or extract the project files):
   ```bash
   cd bookstore-management-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** The `GEMINI_API_KEY` is required for the AI-powered PDF metadata extraction feature. The app will still run without it, but PDF extraction will fail.

### Running the App

Start the development server:

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

---

## Default Credentials

The application comes pre-seeded with two user accounts for testing:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@bookstore.com` | `admin123` |
| **Customer** | `user@bookstore.com` | `user123` |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Register a new user |
| `POST` | `/api/login` | Login and receive JWT token |

### Books
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/books` | Get all books (with search, genre, year filters, pagination) | No |
| `GET` | `/api/books/:id` | Get a single book by ID | No |
| `POST` | `/api/books` | Add a new book | Admin |
| `PUT` | `/api/books/:id` | Update a book | Admin |
| `DELETE` | `/api/books/:id` | Delete a book | Admin |

### Orders
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/orders` | Place a new order | Yes |
| `GET` | `/api/orders` | Get orders (admin sees all, customer sees own) | Yes |
| `GET` | `/api/orders/:id` | Get order details by ID | Yes |
| `PUT` | `/api/orders/:id/status` | Update order status | Admin |

### AI / PDF
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/pdf-extract` | Extract book metadata from PDF using Gemini AI | No |

## License

This project is open-source and available Everyone.
