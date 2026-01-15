# World Explorer

## Overview

An interactive world map explorer application built with React and Express. Users can browse global locations displayed on an interactive map, select markers to view detailed information in a slide-out drawer panel. The app features elegant animations, a dark "Midnight Museum" theme, and responsive design.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming (dark "Midnight Museum" theme)
- **Animations**: Framer Motion for complex drawer and map interactions
- **Map Rendering**: react-simple-maps with d3-geo for interactive world map visualization

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints defined in shared routes module with Zod validation
- **Build Process**: Custom build script using esbuild for server bundling, Vite for client

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: Single `locations` table with fields for id, name, description, coordinates, category, and image URL
- **Migrations**: Drizzle Kit for schema management (`db:push` command)

### Project Structure
```
├── client/          # React frontend
│   └── src/
│       ├── components/   # UI components including MapControl, InfoDrawer, Pin
│       ├── hooks/        # Custom hooks for locations data fetching
│       ├── pages/        # Page components (Home, not-found)
│       └── lib/          # Utilities and query client
├── server/          # Express backend
│   ├── routes.ts    # API route handlers
│   ├── storage.ts   # Database access layer
│   └── db.ts        # Database connection
├── shared/          # Shared code between client/server
│   ├── schema.ts    # Drizzle database schema
│   └── routes.ts    # API route definitions with Zod schemas
└── migrations/      # Database migrations
```

### Key Design Patterns
- **Shared Types**: Database schema and API contracts shared between frontend and backend via `@shared` path alias
- **Storage Interface**: Abstract `IStorage` interface in server for database operations, enabling testability
- **Type-safe API**: Zod schemas define response types, parsed on both client and server
- **Component Composition**: UI built from atomic shadcn/ui components with Radix primitives

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Frontend Libraries
- **react-simple-maps**: SVG map rendering wrapper for d3-geo
- **framer-motion**: Animation library for drawer and interactive elements
- **@tanstack/react-query**: Data fetching and caching
- **Radix UI**: Accessible component primitives (dialog, tooltip, tabs, etc.)

### Build & Development
- **Vite**: Frontend development server with HMR
- **esbuild**: Server-side bundling for production
- **Replit plugins**: Development banner and cartographer for Replit environment

### External Data
- **World Atlas TopoJSON**: Map geometry loaded from CDN (`cdn.jsdelivr.net/npm/world-atlas`)
- **Google Fonts**: Cormorant Garamond and Manrope typefaces
- **Unsplash**: Location images (referenced by URL in seed data)