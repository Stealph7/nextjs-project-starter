# AgriConnect CI - Implementation Plan for Authenticated User Spaces and Services

## Overview
The existing codebase will be considered the **Public Space** accessible without authentication. This includes the landing page, services, about, blog, contact, login, and registration pages.

We will implement the following authenticated user spaces and services:

---

## 1. User Roles and Features

### 1.1 Producer (Producteur)
- Profile management: photo, culture, location
- Add product listings: product, price, season, quantity, region
- Manage listings: edit, delete
- Integrated messaging with buyers
- Receive personalized SMS alerts (via API)
- Track received requests (orders, offers)
- Statistics: views, clicks, sales

### 1.2 Buyer / Cooperative (Acheteur / Coopérative)
- Search products with dynamic filters (region, season, type)
- Product listings with photos, price, region, details
- Product detail page with contact button
- Integrated messaging with producers
- Send requests or negotiate
- Purchase history
- Secure payment integration (Stripe/Paydunya/MoMo)
- Track sent and received requests

### 1.3 Admin
- User management (CRUD)
- Listing validation/moderation
- Global statistics (usage, trends, sales)
- Manage public content (news, alerts)
- Full dashboard with graphs

---

## 2. Services

### 2.1 SMS Agricole
- Automatic SMS alerts:
  - Local weather
  - Region-specific seeds
  - Detected diseases or pests
- Phone number database
- Admin interface for SMS campaigns
- Multilingual support (French + local languages)

### 2.2 Drone Module
- Simulated API for now
- Store and display aerial images of plots
- Access restricted to registered producers/cooperatives

---

## 3. UI/UX Design Guidelines
- Modern, responsive design (mobile + desktop)
- Primary colors: nature green (#22c55e), white, light gray
- Rounded, shadowed buttons
- Friendly fonts (Inter or Poppins)

---

## 4. Bonus Features
- `/demo` route to test platform features
- `.env.example` file with required environment variables
- Code comments for backend and frontend

---

## 5. Implementation Phases

### Phase 1: Data Models and API Endpoints
- Define database schema for users, products, messages, alerts, orders
- Implement REST or GraphQL API endpoints with role-based access control

### Phase 2: Authentication and Authorization
- Implement role-based authentication
- Protect routes and UI components based on roles

### Phase 3: Producer Features
- Profile management UI
- Product listing CRUD UI
- Messaging UI
- SMS alert integration (simulate API)
- Statistics dashboard

### Phase 4: Buyer Features
- Product search and filters UI
- Product detail and contact UI
- Messaging UI
- Order management UI
- Payment integration (mock or real)

### Phase 5: Admin Features
- User and listing management UI
- Content management UI
- Global statistics dashboard

### Phase 6: Services Integration
- SMS campaign admin UI
- Drone image upload and display UI

### Phase 7: Demo Route and Environment Setup
- Implement `/demo` route with sample data
- Create `.env.example` file

### Phase 8: UI/UX Polish and Code Comments
- Apply design guidelines globally
- Add comments to backend and frontend code

---

Please review this plan and confirm if you would like me to proceed with Phase 1 implementation.
