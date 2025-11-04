import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AssignmentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">View and manage your lead assignments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Assignments</CardTitle>
          <CardDescription>Leads assigned to you for qualification</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No assignments yet</p>
        </CardContent>
      </Card>
    </div>
  );
}
