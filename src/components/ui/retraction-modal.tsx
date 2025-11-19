"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";

interface RetractionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => Promise<void>;
  proposalId: string;
}

/**
 * Retraction Modal Component
 * Allows users to retract from a completed deal with mandatory reason
 */
export function RetractionModal({
  open,
  onOpenChange,
  onConfirm,
}: RetractionModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      return; // Require reason
    }

    setIsSubmitting(true);
    try {
      await onConfirm(reason.trim());
      // Reset form
      setReason("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to retract deal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setReason("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleConfirm}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {t("retraction.title")}
            </DialogTitle>
            <DialogDescription>
              {t("retraction.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Warning Message */}
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
              <p className="text-sm text-destructive font-medium">
                {t("retraction.warning")}
              </p>
            </div>

            {/* Reason Textarea */}
            <div className="space-y-2">
              <Label htmlFor="reason">
                {t("retraction.reasonLabel")} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder={t("retraction.reasonPlaceholder")}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
                maxLength={500}
                required
              />
              <p className="text-xs text-muted-foreground text-right">
                {reason.length}/500
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              {t("retraction.cancelButton")}
            </Button>
            <Button 
              type="submit"
              variant="destructive"
              disabled={!reason.trim() || isSubmitting}
            >
              {isSubmitting ? t("common.loading") : t("retraction.confirmButton")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
