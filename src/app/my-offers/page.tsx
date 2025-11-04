import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyOffersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Offers</h1>
          <p className="text-muted-foreground">Manage your created offers</p>
        </div>
        <Button>Create New Offer</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Offers</CardTitle>
          <CardDescription>Offers you have created</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">You haven&apos;t created any offers yet</p>
        </CardContent>
      </Card>
    </div>
  );
}
