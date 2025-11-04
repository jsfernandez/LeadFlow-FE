export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-foreground text-5xl font-bold">
          Welcome to <span className="text-accent">LeadFlow</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg">
          A streamlined lead management system for tracking offers, proposals, lead assignments, and
          payouts. Built with Next.js 15, TypeScript, TailwindCSS, and React Query.
        </p>
        <div className="mt-8 flex gap-4">
          <a
            href="/offers"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-3 font-semibold transition-colors"
          >
            View Offers
          </a>
          <a
            href="/dashboard"
            className="border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg border px-6 py-3 font-semibold transition-colors"
          >
            Dashboard
          </a>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="text-card-foreground mb-2 text-lg font-semibold">Offer Management</h3>
            <p className="text-muted-foreground text-sm">
              Create and manage offers with role-based access control
            </p>
          </div>
          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="text-card-foreground mb-2 text-lg font-semibold">Lead Tracking</h3>
            <p className="text-muted-foreground text-sm">
              Track proposals, assignments, and qualification status
            </p>
          </div>
          <div className="border-border bg-card rounded-lg border p-6">
            <h3 className="text-card-foreground mb-2 text-lg font-semibold">Payout System</h3>
            <p className="text-muted-foreground text-sm">
              Manage payouts for won leads with complete transparency
            </p>
          </div>
        </div>
      </main>
      <footer className="text-muted-foreground mt-16 text-sm">
        Powered by Next.js 15 • TypeScript • TailwindCSS • React Query
      </footer>
    </div>
  );
}
