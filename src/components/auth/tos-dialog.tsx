"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TOS_CONTENT } from "@/lib/tos-content";
import { useLanguage } from "@/contexts/language-context";

interface TosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * TOS Dialog Component
 * Displays the full Terms of Service content in a scrollable dialog
 * The TOS text is in Spanish as required by Chilean law
 */
export function TosDialog({ open, onOpenChange }: TosDialogProps) {
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {t("auth.register.tosDialogTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-4 mt-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
              {TOS_CONTENT}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
