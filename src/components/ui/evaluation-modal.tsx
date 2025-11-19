"use client";

import { useState } from "react";
import { Star, AlertTriangle } from "lucide-react";
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

interface EvaluationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, review?: string) => Promise<void>;
  onDenounce: () => void;
  title?: string;
  description?: string;
}

/**
 * Evaluation Modal Component
 * Allows users to rate with 1-5 stars, optional review text, and report issues
 */
export function EvaluationModal({
  open,
  onOpenChange,
  onSubmit,
  onDenounce,
  title,
  description,
}: EvaluationModalProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      return; // Require at least 1 star
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, review.trim() || undefined);
      // Reset form
      setRating(0);
      setReview("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit evaluation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setReview("");
      onOpenChange(false);
    }
  };

  const handleDenounce = () => {
    handleClose();
    onDenounce();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title || t("evaluation.title")}</DialogTitle>
            <DialogDescription>
              {description || t("evaluation.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label>{t("evaluation.ratingLabel")}</Label>
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
                  {rating} {rating === 1 ? t("ratings.star") : t("ratings.stars")}
                </p>
              )}
            </div>

            {/* Review Textarea */}
            <div className="space-y-2">
              <Label htmlFor="review">{t("evaluation.reviewLabel")}</Label>
              <Textarea
                id="review"
                placeholder={t("evaluation.reviewPlaceholder")}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {review.length}/500
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDenounce}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              {t("evaluation.denounceButton")}
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {t("common.cancel")}
              </Button>
              <Button 
                type="submit" 
                disabled={rating === 0 || isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {isSubmitting ? t("common.loading") : t("evaluation.submitButton")}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
