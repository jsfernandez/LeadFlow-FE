/**
 * Payment Utility Functions
 * 
 * Helper functions for payment calculations, deadline tracking, and status management.
 */

import { differenceInDays, isPast, isFuture, addDays } from "date-fns";
import type { Payment, PaymentStatus } from "@/types";

/**
 * Calculate days remaining until payment due date
 * Returns negative number if overdue
 */
export function getDaysRemaining(dueDate: Date): number {
  return differenceInDays(new Date(dueDate), new Date());
}

/**
 * Check if payment is overdue
 */
export function isPaymentOverdue(payment: Payment): boolean {
  if (payment.status === "PAID") return false;
  return isPast(new Date(payment.dueDate));
}

/**
 * Check if payment is due soon (within specified days)
 */
export function isPaymentDueSoon(payment: Payment, daysThreshold: number = 3): boolean {
  if (payment.status === "PAID" || payment.status === "DISPUTED") return false;
  
  const daysRemaining = getDaysRemaining(payment.dueDate);
  return daysRemaining >= 0 && daysRemaining <= daysThreshold;
}

/**
 * Get payment urgency level
 */
export type PaymentUrgency = "overdue" | "urgent" | "upcoming" | "normal";

export function getPaymentUrgency(payment: Payment): PaymentUrgency {
  if (payment.status === "PAID") return "normal";
  if (isPaymentOverdue(payment)) return "overdue";
  if (isPaymentDueSoon(payment, 3)) return "urgent";
  if (isPaymentDueSoon(payment, 7)) return "upcoming";
  return "normal";
}

/**
 * Get badge color class based on payment status
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    PENDING: "bg-yellow-600 text-white",
    IN_GRACE_PERIOD: "bg-orange-600 text-white",
    PAID: "bg-green-600 text-white",
    REJECTED: "bg-red-600 text-white",
    DISPUTED: "bg-purple-600 text-white",
  };
  return colors[status] || "bg-gray-600 text-white";
}

/**
 * Get badge color class based on payment urgency
 */
export function getPaymentUrgencyColor(urgency: PaymentUrgency): string {
  const colors: Record<PaymentUrgency, string> = {
    overdue: "bg-red-600 text-white",
    urgent: "bg-orange-600 text-white",
    upcoming: "bg-yellow-600 text-white",
    normal: "bg-green-600 text-white",
  };
  return colors[urgency];
}

/**
 * Calculate due date from acceptance date
 */
export function calculateDueDate(acceptanceDate: Date, daysToAdd: number = 30): Date {
  return addDays(acceptanceDate, daysToAdd);
}

/**
 * Format days remaining as human-readable string
 */
export function formatDaysRemaining(daysRemaining: number): {
  text: string;
  isOverdue: boolean;
} {
  if (daysRemaining < 0) {
    return {
      text: Math.abs(daysRemaining).toString(),
      isOverdue: true,
    };
  }
  return {
    text: daysRemaining.toString(),
    isOverdue: false,
  };
}

/**
 * Check if payment can be disputed
 */
export function canDisputePayment(payment: Payment): boolean {
  return payment.status === "PENDING" || payment.status === "IN_GRACE_PERIOD";
}

/**
 * Check if payment can be marked as paid
 */
export function canMarkAsPaid(payment: Payment): boolean {
  return (
    payment.status === "PENDING" ||
    payment.status === "IN_GRACE_PERIOD" ||
    payment.status === "DISPUTED"
  );
}

/**
 * Filter payments by role view (seller vs lead manager)
 */
export function filterPaymentsByRole(
  payments: Payment[],
  userId: string,
  role: "SELLER" | "LEAD_MANAGER"
): {
  paymentsToPay: Payment[];
  paymentsToReceive: Payment[];
} {
  if (role === "SELLER") {
    return {
      paymentsToPay: payments.filter((p) => p.sellerId === userId),
      paymentsToReceive: [],
    };
  } else {
    return {
      paymentsToPay: [],
      paymentsToReceive: payments.filter((p) => p.leadManagerId === userId),
    };
  }
}

/**
 * Group payments by status
 */
export function groupPaymentsByStatus(payments: Payment[]): Record<PaymentStatus, Payment[]> {
  const grouped: Record<PaymentStatus, Payment[]> = {
    PENDING: [],
    IN_GRACE_PERIOD: [],
    PAID: [],
    REJECTED: [],
    DISPUTED: [],
  };

  payments.forEach((payment) => {
    grouped[payment.status].push(payment);
  });

  return grouped;
}

/**
 * Calculate payment summary statistics
 */
export interface PaymentSummary {
  total: number;
  pending: number;
  paid: number;
  overdue: number;
  upcoming: number;
  totalAmount: number;
  pendingAmount: number;
  paidAmount: number;
}

export function calculatePaymentSummary(payments: Payment[]): PaymentSummary {
  const summary: PaymentSummary = {
    total: payments.length,
    pending: 0,
    paid: 0,
    overdue: 0,
    upcoming: 0,
    totalAmount: 0,
    pendingAmount: 0,
    paidAmount: 0,
  };

  payments.forEach((payment) => {
    summary.totalAmount += payment.amountCLP;

    if (payment.status === "PAID") {
      summary.paid++;
      summary.paidAmount += payment.amountCLP;
    } else if (payment.status === "PENDING" || payment.status === "IN_GRACE_PERIOD") {
      summary.pending++;
      summary.pendingAmount += payment.amountCLP;

      if (isPaymentOverdue(payment)) {
        summary.overdue++;
      } else if (isPaymentDueSoon(payment, 7)) {
        summary.upcoming++;
      }
    }
  });

  return summary;
}
