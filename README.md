# Personal Finance Tracker - Penny Trail

## Overview

Penny Trail is a full-stack personal finance tracking application built with a modern tech stack. The application allows users to track their income and expenses, categorize transactions, view analytics with charts, and generate reports. It features a responsive design with both desktop and mobile interfaces, providing comprehensive financial management capabilities through an intuitive dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

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
