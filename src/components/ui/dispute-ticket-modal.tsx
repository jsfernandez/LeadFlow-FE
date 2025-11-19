"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";
import type { TicketCategory } from "@/types";

interface DisputeTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (category: TicketCategory, description: string, attachmentUrl?: string) => Promise<void>;
  proposalId: string;
  reportedUserId?: string;
  relatedOfferId?: string;
}

/**
 * Dispute Ticket Modal Component
 * Allows users to report issues and create support tickets
 */
export function DisputeTicketModal({
  open,
  onOpenChange,
  onSubmit,
}: DisputeTicketModalProps) {
  const { t } = useTranslation();
  const [category, setCategory] = useState<TicketCategory | "">("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !description.trim()) {
      return; // Require category and description
    }

    setIsSubmitting(true);
    try {
      await onSubmit(category as TicketCategory, description.trim());
      // Reset form
      setCategory("");
      setDescription("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCategory("");
      setDescription("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              {t("ticket.title")}
            </DialogTitle>
            <DialogDescription>
              {t("ticket.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category">{t("ticket.category")}</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as TicketCategory)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder={t("ticket.categoryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAYMENT_NON_COMPLIANCE">
                    {t("ticket.categoryPaymentNonCompliance")}
                  </SelectItem>
                  <SelectItem value="DATA_MISUSE">
                    {t("ticket.categoryDataMisuse")}
                  </SelectItem>
                  <SelectItem value="INAPPROPRIATE_CONDUCT">
                    {t("ticket.categoryInappropriateConduct")}
                  </SelectItem>
                  <SelectItem value="OTHER">
                    {t("ticket.categoryOther")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <Label htmlFor="description">
                {t("ticket.descriptionLabel")} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder={t("ticket.descriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                maxLength={1000}
                required
              />
              <p className="text-xs text-muted-foreground text-right">
                {description.length}/1000
              </p>
            </div>

            {/* Note about attachment */}
            <div className="rounded-md bg-muted p-3">
              <p className="text-xs text-muted-foreground">
                <strong>{t("ticket.attachmentLabel")}</strong>
                <br />
                File attachments will be supported in a future update.
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
              {t("common.cancel")}
            </Button>
            <Button 
              type="submit" 
              disabled={!category || !description.trim() || isSubmitting}
            >
              {isSubmitting ? t("common.loading") : t("ticket.submitButton")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
