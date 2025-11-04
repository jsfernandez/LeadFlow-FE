import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProposalsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p className="text-muted-foreground">Manage your lead proposals</p>
        </div>
        <Button>Submit Proposal</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Proposals</CardTitle>
          <CardDescription>All proposals you&apos;ve submitted</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">You haven&apos;t submitted any proposals yet</p>
        </CardContent>
      </Card>
    </div>
  );
}
