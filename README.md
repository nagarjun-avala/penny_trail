# 💰 Personal Finance Tracker - Penny Trail

## Overview

Penny Trail is a full-stack personal finance tracking application built with a modern tech stack. The application allows users to track their income and expenses, categorize transactions, view analytics with charts, and generate reports. It features a responsive design with both desktop and mobile interfaces, providing comprehensive financial management capabilities through an intuitive dashboard.

- Create and manage spending categories
- Set budgets for specific periods
- Track spending progress visually
- Filter transactions by date (e.g., this month, custom range)

---

## User Preferences

Preferred communication style: Simple, everyday language.

## 🧭 App Routes & Pages

### `/`

**Dashboard (optional landing)**

- Summarizes budget status, total spent vs budgeted, recent transactions.
- Provides quick access to core features.

> _Not implemented yet in this version._

---

### `/categories`

**Manage Categories**

- Create, edit, or delete categories for organizing expenses and income.
- Categories include name, color, icon, and type (income or expenses).
- Transactions are grouped under these categories.

🔍 Features:

- Date filtering (This Month, Last 6 Months, etc.)
- Transaction counts & amount stats per category
- Progress bars for visual insights
- Uses `shadcn/ui` components and icons

---

### `/budgets`

**Budgets Page**

- Set a budget for a specific category over a period (monthly, yearly, etc.)
- View amount spent, remaining, and percent used
- Visual progress bars with warning indicators

📊 Features:

- Budget creation dialog using `BudgetForm`
- Edit and delete budgets
- Visual budget status: Good, Warning, Exceeded
- Fully uses local dummy data for display

---

### `* (404)`

**Not Found Page**

- Simple and modern page for non-existent routes.
- Uses `AlertTriangle` icon and consistent styling.
- Link to return to homepage.

---

## 📁 Folder Structure

```
/components
  └── ui/              → shadcn-based UI components
  └── forms/           → Form components like BudgetForm
  └── CategoryForm.tsx
  └── Calendar.tsx     → Calendar picker (shadcn)

/app
  └── page.tsx   → DashboardPage
  └── layout.tsx   → Site Layout
  └── not-found.tsx    → 404 page
  └── Transactions
  |   └── page.tsx   → TransactionsPage
  └── Categories
  |   └── page.tsx   → CategoriesPage
  └── Analytics
      └── page.tsx   → AnalyticsPage

/lib
  └── utils.ts         → Utility functions (e.g. formatCurrency)
  └── constants.ts     → Static data like defaultCategories
  └── types.ts         → Type definitions
```

---

## 🧪 Data & Logic

- All data is frontend only (`dummyTransactions`, `defaultCategories`, etc.)
- State managed with `useState`, `useEffect`, and `useMemo`
- TypeScript enforced via `Budget`, `Category`, and `BudgetWithCategory` types
- Includes logic to calculate spent, remaining, and percent used

---

## 🛠 Technologies Used

- React + TypeScript
- Next.js (App or Pages router)
- TailwindCSS
- shadcn/ui for component styling
- Lucide for modern icons

---

## 📌 Coming Soon (Ideas)

- Add persistent backend (e.g., MongoDB, PostgreSQL)
- User login & authentication
- Export/Import budgets & data
- Dashboard analytics with charts

---

## 📃 License

MIT License — free to use, hack, and expand as you like.

---

> Made with ☕, 💻, and a sprinkle of shadcn/ui goodness.

## System Architecture

### Frontend Architecture

The client-side is built using React with TypeScript, implementing a single-page application (SPA) architecture. The application uses Wouter for lightweight client-side routing and TanStack Query for server state management and caching. The UI is built with shadcn/ui components based on Radix UI primitives, styled with Tailwind CSS for consistent design and responsive layouts.

Key architectural decisions:

- **Component-based architecture**: Modular React components with clear separation of concerns
- **State management**: TanStack Query handles server state, while local component state manages UI interactions
- **Routing**: Wouter provides minimal client-side routing without the overhead of React Router
- **Styling approach**: Tailwind CSS with CSS custom properties for theming and design consistency

### Backend Architecture

The server-side follows a RESTful API design using Express.js with TypeScript. The application implements a layered architecture with clear separation between routes, business logic, and data access. Currently uses in-memory storage with interfaces designed for easy migration to persistent storage.

Key architectural decisions:

- **MVC pattern**: Routes handle HTTP concerns, storage layer manages data operations
- **Type safety**: Shared TypeScript schemas between client and server using Zod validation
- **Middleware approach**: Express middleware for request logging, error handling, and JSON parsing
- **Development setup**: Vite integration for hot module replacement in development

### Data Storage Solutions

The application uses a flexible storage architecture with an interface-based approach. Currently implements in-memory storage with predefined categories and transaction data. The database schema is defined using Drizzle ORM with PostgreSQL as the target database for production deployment.

Key architectural decisions:

- **Interface abstraction**: IStorage interface allows switching between storage implementations
- **Schema validation**: Drizzle-Zod integration provides runtime validation and type safety
- **Migration ready**: Drizzle configuration prepared for PostgreSQL deployment
- **Default data**: Pre-populated categories for immediate application usability

### Authentication and Authorization

Currently, the application does not implement authentication mechanisms, operating as a single-user application. The architecture is prepared for future authentication integration through the existing middleware structure.

### Component Design System

The UI implements a comprehensive design system using shadcn/ui components, providing consistent styling and behavior across the application. The system includes form components, data visualization elements, navigation components, and feedback mechanisms.

Key architectural decisions:

- **Design tokens**: CSS custom properties for consistent theming
- **Component variants**: Class Variance Authority for systematic component variations
- **Icon system**: FontAwesome integration for consistent iconography
- **Responsive design**: Mobile-first approach with desktop enhancements

## External Dependencies

### Frontend Dependencies

- **React ecosystem**: React 18 with TypeScript for component development
- **State management**: TanStack React Query for server state and caching
- **Routing**: Wouter for lightweight client-side navigation
- **Form handling**: React Hook Form with Hookform Resolvers for form validation
- **UI components**: Radix UI primitives providing accessible component foundations
- **Styling**: Tailwind CSS for utility-first styling approach
- **Charts**: Recharts for data visualization and analytics displays
- **Date handling**: date-fns for date manipulation and formatting

### Backend Dependencies

- **Runtime**: Node.js with Express.js web framework
- **Database**: Drizzle ORM with PostgreSQL driver (@neondatabase/serverless)
- **Validation**: Zod for schema validation and type safety
- **Development**: tsx for TypeScript execution, esbuild for production builds
- **Session management**: connect-pg-simple for PostgreSQL session storage (prepared for future use)

### Development Tools

- **Build system**: Vite for frontend bundling and development server
- **TypeScript**: Comprehensive type checking across the entire application
- **Database migrations**: Drizzle Kit for schema management and migrations
- **Development environment**: Replit-specific plugins for enhanced development experience

### Third-party Services

- **Database hosting**: Configured for Neon PostgreSQL hosting
- **Asset delivery**: FontAwesome CDN for icon resources
- **Development platform**: Replit integration for development and deployment environment
