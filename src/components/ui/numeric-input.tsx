import * as React from "react";
import { cn } from "@/lib/utils";

export type NumericInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> & {
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  allowNegative?: boolean;
  decimalPlaces?: number;
};

/**
 * NumericInput Component
 * 
 * A specialized input component for numeric values that:
 * - Enforces dot (.) as decimal separator (blocks commas)
 * - Prevents invalid characters
 * - Optionally allows negative numbers
 * - Optionally limits decimal places
 * 
 * This ensures consistent numeric input across all forms in the application,
 * particularly for prices, amounts, and other monetary/numeric values.
 */
const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ className, value, onChange, allowNegative = false, decimalPlaces, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter
      if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
      }

      // Block comma key (both regular and numpad)
      if (e.key === ',' || e.keyCode === 188 || e.keyCode === 110) {
        e.preventDefault();
        return;
      }

      // Allow minus sign only at the start if allowNegative is true
      if (allowNegative && e.key === '-' && (e.currentTarget.selectionStart === 0)) {
        return;
      }

      // Allow decimal point (period) only once
      if (e.key === '.' && !e.currentTarget.value.includes('.')) {
        return;
      }

      // Block any key that's not a number
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;

      // Replace comma with dot (in case of paste)
      inputValue = inputValue.replace(/,/g, '.');

      // Remove any character that's not a number, dot, or minus (if allowed)
      const allowedPattern = allowNegative ? /[^0-9.-]/g : /[^0-9.]/g;
      inputValue = inputValue.replace(allowedPattern, '');

      // Ensure only one decimal point
      const parts = inputValue.split('.');
      if (parts.length > 2) {
        inputValue = parts[0] + '.' + parts.slice(1).join('');
      }

      // Ensure minus sign only at start
      if (allowNegative && inputValue.includes('-')) {
        const minusCount = (inputValue.match(/-/g) || []).length;
        if (minusCount > 1 || inputValue.indexOf('-') !== 0) {
          inputValue = inputValue.replace(/-/g, '');
          if (inputValue.length > 0 && inputValue[0] !== '-') {
            inputValue = '-' + inputValue;
          }
        }
      }

      // Limit decimal places if specified
      if (decimalPlaces !== undefined && inputValue.includes('.')) {
        const [intPart, decPart] = inputValue.split('.');
        if (decPart && decPart.length > decimalPlaces) {
          inputValue = intPart + '.' + decPart.slice(0, decimalPlaces);
        }
      }

      // Create a new event with the cleaned value
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: inputValue,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      if (onChange) {
        onChange(newEvent);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = e.clipboardData.getData('text');
      // Check if pasted text contains comma
      if (pastedText.includes(',')) {
        e.preventDefault();
        // Replace comma with dot and trigger change
        const cleanedText = pastedText.replace(/,/g, '.');
        const input = e.currentTarget;
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const currentValue = input.value;
        const newValue = currentValue.slice(0, start) + cleanedText + currentValue.slice(end);
        
        // Create synthetic event
        const syntheticEvent = {
          target: { value: newValue },
          currentTarget: input,
        } as React.ChangeEvent<HTMLInputElement>;
        
        handleChange(syntheticEvent);
      }
    };

    return (
      <input
        type="text"
        inputMode="decimal"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        {...props}
      />
    );
  }
);
NumericInput.displayName = "NumericInput";

export { NumericInput };
