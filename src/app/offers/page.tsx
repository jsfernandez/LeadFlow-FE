import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OffersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Offers</h1>
          <p className="text-muted-foreground">Browse and manage available offers</p>
        </div>
        <Button>Create Offer</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Offers</CardTitle>
          <CardDescription>List of all available offers in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No offers available yet</p>
        </CardContent>
      </Card>
    </div>
  );
}
