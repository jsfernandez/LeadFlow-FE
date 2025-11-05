# LeadFlow-FE

A modern, type-safe frontend application for managing leads, offers, proposals, and payouts. Built with Next.js 15, TypeScript, TailwindCSS, shadcn/ui, and React Query.

## 🎯 Project Overview

LeadFlow is a lead management system that streamlines the workflow from offer creation to payout. The application supports role-based access control and follows this core business flow:

> **Offer creation → Proposal submission → Acceptance → Lead assignment → Qualification (WON/LOST) → Payout**

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui
- **State Management**: React Query (@tanstack/react-query)
- **Validation**: Zod
- **Code Quality**: ESLint + Prettier

## 🎨 Design System

The application uses a **dark corporate theme** with the following color palette:

- **Background**: slate-950 (`rgb(2, 6, 23)`)
- **Text**: silver-gray slate-200 (`rgb(226, 232, 240)`)
- **Accent**: amber-400 (`rgb(251, 191, 36)`)
- **Cards**: slate-900 (`rgb(15, 23, 42)`)
- **Borders**: slate-700 (`rgb(51, 65, 85)`)

## 📁 Project Structure

```
LeadFlow-FE/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout with providers
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles and theme
│   ├── components/       # React components
│   │   └── providers/    # Context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   │   └── utils.ts      # Class merge utility (cn)
│   └── types/            # TypeScript type definitions
│       └── index.ts      # Core business types
├── public/               # Static assets
├── .prettierrc           # Prettier configuration
├── eslint.config.mjs     # ESLint configuration
├── next.config.ts        # Next.js configuration
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.ts    # Tailwind configuration (auto-generated)
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

1. Clone the repository:

```bash
git clone https://github.com/VamadorF/LeadFlow-FE.git
cd LeadFlow-FE
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 👥 User Roles

The application supports three user roles:

1. **SELLER**: Creates and manages offers
2. **LEAD_MANAGER**: Submits proposals and manages leads
3. **ADMIN**: Full system access

## 🔄 Core Workflow

1. **Offer Creation**: Sellers create offers with pricing and details
2. **Proposal Submission**: Lead managers submit proposals for offers
3. **Lead Assignment**: Proposals are accepted and assigned to lead managers
4. **Qualification**: Leads are marked as WON or LOST
5. **Payout**: Successful leads trigger payouts

## 🎨 Theme Customization

The theme is configured in `src/app/globals.css` using CSS custom properties. Colors use RGB values for compatibility with Tailwind's opacity modifiers.

To customize the theme, modify the CSS variables in the `:root` selector:

```css
:root {
  --background: 2 6 23; /* slate-950 */
  --foreground: 226 232 240; /* slate-200 */
  --accent: 251 191 36; /* amber-400 */
  /* ... */
}
```

## 📦 Key Dependencies

- `next`: 16.0.1
- `react`: 19.2.0
- `@tanstack/react-query`: ^5.62.7
- `zod`: ^3.23.8
- `tailwindcss`: ^4
- `typescript`: ^5

## 🔧 Configuration Files

- **TypeScript**: Strict mode enabled, paths configured for `@/*` imports
- **ESLint**: Next.js recommended config + Prettier integration
- **Prettier**: Configured for consistent code formatting with Tailwind plugin

## 🌐 Data Providers

The application supports **dual-mode data layer** for seamless switching between local development and production:

### Mock Mode (Default)
- **Purpose**: Local development and testing without backend
- **Features**: 
  - In-memory data storage with sample data
  - Simulated API latency (300ms)
  - Full CRUD operations
  - Persists during session
- **Configuration**: Set `NEXT_PUBLIC_API_MODE=mock` in `.env.local`

### Real Mode
- **Purpose**: Integration with backend API
- **Features**:
  - HTTP client with fetch API
  - Request/response interceptors
  - Automatic auth header injection
  - Error handling and transformation
  - Date serialization/deserialization
- **Configuration**: 
  - Set `NEXT_PUBLIC_API_MODE=real` in `.env.local`
  - Set `NEXT_PUBLIC_API_URL` to your backend URL (e.g., `http://localhost:3001/api`)

### Switching Between Modes

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` to set your preferred mode:
```env
# For mock mode (local development)
NEXT_PUBLIC_API_MODE=mock

# For real mode (backend integration)
NEXT_PUBLIC_API_MODE=real
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. Restart the development server:
```bash
npm run dev
```

The application will automatically use the configured provider without any code changes.

## 🔌 API Integration

### API Client
The `apiClient` (`src/lib/apiClient.ts`) provides:
- RESTful HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Automatic authentication headers from localStorage
- Request/response interceptors
- Centralized error handling
- Query parameter serialization

### Data Provider Abstraction
The `dataProvider` (`src/lib/dataProvider.ts`) provides:
- Unified interface for both mock and real modes
- Automatic mode switching based on environment
- Type-safe DTOs matching backend contracts
- Consistent error handling across modes

### Backend API Endpoints (Real Mode)
When using real mode, the following endpoints are expected:

**Offers**
- `GET /offers` - List all offers
- `GET /offers/:id` - Get offer by ID
- `GET /offers?sellerId={id}` - Get offers by seller
- `POST /offers` - Create new offer
- `PATCH /offers/:id` - Update offer
- `DELETE /offers/:id` - Delete offer

**Lead Offers**
- `GET /lead-offers` - List all lead offers
- `GET /lead-offers/:id` - Get lead offer by ID
- `GET /lead-offers?managerId={id}` - Get by manager
- `GET /lead-offers?offerId={id}` - Get by offer
- `POST /lead-offers` - Create proposal
- `PATCH /lead-offers/:id/status` - Update status

**Payouts**
- `GET /payouts` - List all payouts
- `GET /payouts/:id` - Get payout by ID
- `GET /payouts?leadOfferId={id}` - Get by lead offer
- `GET /payouts?managerId={id}` - Get by manager
- `PATCH /payouts/:id/status` - Update payout status

**Users**
- `GET /users/:id` - Get user by ID

## 📝 Type Safety

All business entities are strictly typed in `src/types/index.ts`:

- User roles and permissions
- Offer states and transitions
- Lead proposal lifecycle
- Payout tracking

## 🤝 Contributing

1. Follow the existing code style (enforced by ESLint + Prettier)
2. Maintain the atomic component pattern
3. Document all new modules and functions
4. Ensure API contract parity with backend DTOs
5. Test in both mock and real data modes

## 📄 License

This project is private and proprietary.

## 🔗 Related Projects

- Backend API: [LeadFlow Backend Repository]
- Design System: Based on shadcn/ui components

---

Built with ❤️ using Next.js 15, TypeScript, and TailwindCSS
