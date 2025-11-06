"use client";

import { useState } from "react";
import { Star } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, feedback?: string) => Promise<void>;
  title?: string;
  description?: string;
}

/**
 * Rating Modal Component
 * Allows users to rate with 1-5 stars and optional feedback text
 */
export function RatingModal({
  open,
  onOpenChange,
  onSubmit,
  title,
  description,
}: RatingModalProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      return; // Require at least 1 star
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, feedback.trim() || undefined);
      // Reset form
      setRating(0);
      setFeedback("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setFeedback("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title || t("ratings.title")}</DialogTitle>
            <DialogDescription>
              {description || t("ratings.selectStars")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label>{t("ratings.yourRating")}</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={cn(
                      "transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
                      "hover:scale-110"
                    )}
                  >
                    <Star
                      size={32}
                      className={cn(
                        "transition-colors",
                        (hoverRating >= star || (!hoverRating && rating >= star))
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground"
                      )}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-muted-foreground">
                  {rating} {rating === 1 ? "star" : t("ratings.stars")}
                </p>
              )}
            </div>

            {/* Feedback Textarea */}
            <div className="space-y-2">
              <Label htmlFor="feedback">{t("ratings.feedback")}</Label>
              <Textarea
                id="feedback"
                placeholder={t("ratings.feedbackPlaceholder")}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {feedback.length}/500
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
              {t("ratings.cancel")}
            </Button>
            <Button 
              type="submit" 
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? t("common.loading") : t("ratings.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
