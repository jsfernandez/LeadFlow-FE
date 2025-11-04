import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Welcome to <span className="text-primary">LeadFlow</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Streamline your lead management from offer creation to payout
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Offer Management</CardTitle>
            <CardDescription>Create and manage offers with role-based access control</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Sellers can create offers that lead managers can submit proposals for.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lead Tracking</CardTitle>
            <CardDescription>Track proposals, assignments, and qualification status</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Monitor the complete journey from proposal submission to lead qualification.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payout System</CardTitle>
            <CardDescription>Manage payouts for won leads with complete transparency</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automated payout tracking ensures fair compensation for successful leads.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle>Core Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-lg bg-primary/10 px-3 py-2 font-medium">Offer Creation</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-lg bg-primary/10 px-3 py-2 font-medium">Proposal Submission</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-lg bg-primary/10 px-3 py-2 font-medium">Acceptance</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-lg bg-primary/10 px-3 py-2 font-medium">Lead Assignment</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-lg bg-primary/10 px-3 py-2 font-medium">Qualification</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-lg bg-primary/10 px-3 py-2 font-medium">Payout</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
