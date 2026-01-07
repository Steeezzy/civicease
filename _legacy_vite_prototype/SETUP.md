# CivicEase - Digital Governance Portal

A professional internal web portal for revenue officers to manage citizens, families, and services.

## Technology Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Charts:** Recharts
- **Routing:** React Router v6
- **Build Tool:** Vite
- **Icons:** Lucide React

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd civicease
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode

Start the development server:
```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

### Production Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── api/              # API client and backend integration preparation
├── components/       # Reusable React components
│   ├── ui/          # shadcn/ui components
│   ├── DarkModeToggle.tsx
│   ├── DataTable.tsx
│   ├── PageHeader.tsx
│   ├── ProtectedRoute.tsx
│   ├── Sidebar.tsx
│   ├── StatCard.tsx
│   └── Topbar.tsx
├── contexts/         # React Context providers
│   └── AuthContext.tsx
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── pages/           # Application pages
│   ├── Citizens.tsx
│   ├── Dashboard.tsx
│   ├── Families.tsx
│   ├── Login.tsx
│   ├── NotFound.tsx
│   ├── Reports.tsx
│   ├── Services.tsx
│   └── Settings.tsx
├── App.tsx          # Main application component
├── index.css        # Global styles and design tokens
└── main.tsx         # Application entry point
```

## Features

### Authentication
- Officer login with email and password validation
- Session persistence using localStorage
- Protected routes requiring authentication

### Dashboard
- Statistical overview with key metrics
- Data visualization with interactive charts
- Recent activity tracking

### Citizen Management
- View, add, edit, and delete citizen records
- Search and filter functionality
- Comprehensive citizen data management

### Family Management
- Family record management
- Member count tracking
- Family tree visualization (placeholder)

### Services
- Service request tracking
- Filter by type, year, and status
- Service history management

### Reports & Analytics
- Most requested services analysis
- Top families by service count
- Yearly distribution trends
- Date range filtering
- Export and print functionality

### Settings
- Officer profile information
- Dark/Light mode toggle
- Secure logout with confirmation

## Default Login

For testing purposes, use any valid email and password (minimum 6 characters):
- Email: `officer@gov.in`
- Password: `password123`

## Design System

The application uses a professional government portal theme:
- **Primary Color:** Deep Blue (#0A1F44)
- **Accent Color:** Teal (#2CA58D)
- **Background:** White/Off-White (#F7F9FC)
- **Typography:** Inter font family

All colors are defined as HSL tokens in `src/index.css` for consistent theming and dark mode support.

## Backend Integration (Future)

The application is prepared for backend integration with API endpoints for:
- Citizens management
- Families management
- Services tracking
- Reports and analytics

See `src/api/README.md` for backend setup instructions.

### Supported Backend Options:
1. **Node.js + Express**
2. **Django + Django REST Framework**

## Development Guidelines

- All colors use HSL semantic tokens from the design system
- Components follow shadcn/ui patterns
- TypeScript strict mode enabled
- Responsive design for desktop and tablet

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is developed as a Final Year B.Tech CSE Project.

---

**Note:** This is a frontend-only application with mock data. Backend integration is prepared but not yet implemented.
