# Personal Finance Manager

## Overview
The Personal Finance Manager is a full-stack application that helps users track their financial transactions, organize spending by categories and payment methods, and securely manage their financial data through a centralized dashboard.

## Scope
The system allows users to:
- Securely create accounts and log in (JWT Authentication).
- Add, view, edit, and delete personal transactions.
- Classify transactions by pre-defined categories and specify payment methods.
- View financial summaries and monthly dashboards to understand their spending habits.
- Securely store all data continuously in a backend relational MySQL database.

## Key Features
1. **User Authentication**: Secure signup and login for data privacy.
2. **Transaction Management**: Full CRUD operations for daily finances.
3. **Advanced Categorization**: Built-in support for both categories (Food, Rent) and payment methods (Card, Cash).
4. **Dashboard & Analytics**: Aggregated viewing of total expenses and income vs. expenses tracking.
5. **Persistent Storage**: Data is seamlessly saved and managed by a dedicated Node/Express/MySQL backend.

## Tech Stack
- **Frontend:** React, TypeScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL

## Getting Started

### Prerequisites
- Node.js and npm installed
- MySQL Server installed and running

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and configure your database connection and JSON Web Token secret.
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend/finance-manager
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
