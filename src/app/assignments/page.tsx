"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLeadOffersByManager, useUpdateLeadOfferStatus } from "@/hooks/use-lead-offers";
import { useAuth } from "@/components/providers/auth-provider";
import type { LeadStatus, LeadOffer } from "@/types";

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { data: assignments, isLoading } = useLeadOffersByManager(user?.id || "");
  const updateStatus = useUpdateLeadOfferStatus();
  const [selectedAssignment, setSelectedAssignment] = useState<LeadOffer | null>(null);
  const [isQualifyDialogOpen, setIsQualifyDialogOpen] = useState(false);

  const handleQualify = async (status: "WON" | "LOST") => {
    if (!selectedAssignment) return;

    try {
      await updateStatus.mutateAsync({
        id: selectedAssignment.id,
        status,
      });
      setIsQualifyDialogOpen(false);
      setSelectedAssignment(null);
    } catch (error) {
      console.error("Failed to qualify lead:", error);
    }
  };

  const openQualifyDialog = (assignment: LeadOffer) => {
    setSelectedAssignment(assignment);
    setIsQualifyDialogOpen(true);
  };

  const getStatusBadge = (status: LeadStatus) => {
    const variants: Record<LeadStatus, string> = {
      PENDING: "bg-yellow-600 text-white",
      WON: "bg-green-600 text-white",
      LOST: "bg-red-600 text-white",
    };

    return <Badge className={variants[status]}>{status}</Badge>;
  };

  // Filter only PENDING assignments (leads that need qualification)
  const pendingAssignments = assignments?.filter((a) => a.status === "PENDING") || [];
  const qualifiedAssignments = assignments?.filter((a) => a.status !== "PENDING") || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">View and manage your lead assignments</p>
      </div>

      {/* Pending Assignments - Need Action */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle>Pending Qualification</CardTitle>
          <CardDescription>Leads assigned to you that need to be qualified</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading assignments...</p>
          ) : pendingAssignments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.customerName}</TableCell>
                    <TableCell>{assignment.customerEmail}</TableCell>
                    <TableCell>{assignment.customerPhone}</TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => openQualifyDialog(assignment)}
                      >
                        Qualify Lead
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No pending assignments</p>
          )}
        </CardContent>
      </Card>

      {/* Qualified Assignments - History */}
      <Card>
        <CardHeader>
          <CardTitle>Qualification History</CardTitle>
          <CardDescription>Previously qualified leads</CardDescription>
        </CardHeader>
        <CardContent>
          {qualifiedAssignments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Qualified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qualifiedAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.customerName}</TableCell>
                    <TableCell>{assignment.customerEmail}</TableCell>
                    <TableCell>{assignment.customerPhone}</TableCell>
                    <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(assignment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {assignment.qualifiedAt
                        ? new Date(assignment.qualifiedAt).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No qualified leads yet</p>
          )}
        </CardContent>
      </Card>

      {/* Qualify Lead Dialog */}
      <Dialog open={isQualifyDialogOpen} onOpenChange={setIsQualifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Qualify Lead</DialogTitle>
            <DialogDescription>
              Mark this lead as WON or LOST based on the outcome
            </DialogDescription>
          </DialogHeader>

          {selectedAssignment && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div>
                  <p className="text-sm font-medium">Customer</p>
                  <p className="text-sm text-muted-foreground">{selectedAssignment.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{selectedAssignment.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{selectedAssignment.customerPhone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Select Outcome</p>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleQualify("WON")}
                    disabled={updateStatus.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Mark as WON
                  </Button>
                  <Button
                    onClick={() => handleQualify("LOST")}
                    disabled={updateStatus.isPending}
                    variant="destructive"
                  >
                    Mark as LOST
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsQualifyDialogOpen(false);
                setSelectedAssignment(null);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
