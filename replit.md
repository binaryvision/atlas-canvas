# World Explorer

## Overview

An interactive world map explorer application built with React and Vite. Users can browse global locations displayed on an interactive map, select markers to view detailed information in a slide-out drawer panel. The app features elegant animations, a dark "Midnight Museum" theme, and responsive design.

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

### Project Structure
```
├── src/             # React source
│   ├── components/  # UI components including MapControl, InfoDrawer, Pin
│   ├── hooks/       # Custom hooks for locations data fetching
│   ├── pages/       # Page components (Home, not-found)
│   └── lib/         # Utilities
├── shared/          # Shared data/types for the demo
├── public/          # Static assets
└── index.html       # Vite entry HTML
```

### Key Design Patterns
- **Shared Types**: Demo data and types shared via the `@shared` path alias
- **Component Composition**: UI built from atomic shadcn/ui components with Radix primitives

## External Dependencies

### Frontend Libraries
- **react-simple-maps**: SVG map rendering wrapper for d3-geo
- **framer-motion**: Animation library for drawer and interactive elements
- **@tanstack/react-query**: Data fetching and caching
- **Radix UI**: Accessible component primitives (dialog, tooltip, tabs, etc.)

### Build & Development
- **Vite**: Frontend development server with HMR
- **Replit plugins**: Development banner and cartographer for Replit environment

### External Data
- **World Atlas TopoJSON**: Map geometry loaded from CDN (`cdn.jsdelivr.net/npm/world-atlas`)
- **Google Fonts**: Cormorant Garamond and Manrope typefaces
- **Unsplash**: Location images (referenced by URL in seed data)