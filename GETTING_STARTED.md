# Getting Started with LeadManager-FE

Welcome to the LeadManager Frontend project! This guide will help you get up and running quickly.

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Open http://localhost:3000 in your browser
```

## Available Commands

```bash
npm run dev     # Start development server with hot reload
npm run build   # Create production build
npm run start   # Start production server
npm run lint    # Run ESLint to check code quality
npm run format  # Format all code with Prettier
```

## Project Overview

LeadManager is a lead management system that follows this workflow:

**Offer Creation → Proposal Submission → Acceptance → Lead Assignment → Qualification (WON/LOST) → Payout**

## User Roles

- **SELLER**: Creates and manages offers
- **LEAD_MANAGER**: Submits proposals and manages leads  
- **ADMIN**: Full system access

## Tech Stack

- **Next.js 15+**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **React Query**: Data fetching and state management
- **shadcn/ui**: Component library (ready to use)
- **Zod**: Schema validation

## Adding shadcn/ui Components

To add components from shadcn/ui:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
# etc.
```

Components will be added to `src/components/ui/`

## Theme Customization

The dark corporate theme is defined in `src/app/globals.css`. Key colors:

- **Background**: `slate-950` - Deep dark background
- **Text**: `slate-200` - Silver-gray text
- **Accent**: `amber-400` - Warm amber for CTAs
- **Cards**: `slate-900` - Elevated surfaces
- **Borders**: `slate-700` - Subtle divisions

## Project Structure

```
src/
├── app/              # Next.js pages and routes
│   ├── layout.tsx    # Root layout (providers here)
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── components/       # Reusable React components
│   ├── ui/          # shadcn/ui components (auto-generated)
│   └── providers/   # Context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
│   └── utils.ts     # cn() helper for class merging
└── types/           # TypeScript type definitions
```

## Code Quality

This project uses ESLint and Prettier to maintain code quality:

- **ESLint**: Checks for code issues and Next.js best practices
- **Prettier**: Automatically formats code consistently
- **TypeScript**: Strict mode enabled for maximum type safety

Run before committing:
```bash
npm run lint
npm run format
```

## Type Safety

All business entities are typed in `src/types/index.ts`:

```typescript
- User (with roles)
- Offer (with status)
- LeadOffer (proposals)
- Payout (payment tracking)
```

## Data Providers (Coming Soon)

The application will support:

1. **Mock Provider**: Local development with simulated latency
2. **Real Provider**: Production API integration

Configure via environment variable:
```env
NEXT_PUBLIC_API_URL=https://api.leadmanager.example.com
```

## Development Tips

1. **Hot Reload**: Save any file to see changes instantly
2. **Type Checking**: TypeScript errors show in the terminal
3. **CSS IntelliSense**: TailwindCSS classes autocomplete in VS Code
4. **Path Aliases**: Use `@/` to import from `src/` directory

## Common Tasks

### Creating a New Page

```typescript
// src/app/offers/page.tsx
export default function OffersPage() {
  return <div>Offers Page</div>;
}
```

### Adding a Component

```typescript
// src/components/my-component.tsx
import { cn } from "@/lib/utils";

export function MyComponent({ className }: { className?: string }) {
  return <div className={cn("base-classes", className)}>Content</div>;
}
```

### Using React Query

```typescript
// src/hooks/use-data.ts
import { useQuery } from "@tanstack/react-query";

export function useData() {
  return useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const res = await fetch("/api/data");
      return res.json();
    },
  });
}
```

## Need Help?

- **Next.js Docs**: https://nextjs.org/docs
- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **shadcn/ui Docs**: https://ui.shadcn.com
- **React Query Docs**: https://tanstack.com/query/latest

## Next Steps

Ready to start building? Consider:

1. Add shadcn/ui components you need
2. Create the offers list page
3. Implement mock data providers
4. Build the dashboard layout
5. Add authentication/role guards

Happy coding! 🚀
