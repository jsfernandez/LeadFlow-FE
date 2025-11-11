import * as React from "react";
import { cn, formatThousands, parseThousands, isValidMoneyInput } from "@/lib/utils";

export type MoneyInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> & {
  value?: string | number;
  onChange?: (value: number) => void;
};

/**
 * MoneyInput Component
 * 
 * Specialized input component for Chilean Peso (CLP) monetary values that:
 * - Automatically formats with dot (.) as thousands separator
 * - Prevents invalid characters (letters, commas, symbols)
 * - Does not allow negative numbers or spaces
 * - Visual format: "1.234.567"
 * - Internal value: clean number (1234567)
 * 
 * This ensures consistent CLP currency input across all forms in the application.
 */
const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>("");

    // Update display value when prop value changes
    React.useEffect(() => {
      if (value === undefined || value === null || value === "") {
        setDisplayValue("");
      } else {
        const numValue = typeof value === "string" ? parseThousands(value) : value;
        setDisplayValue(formatThousands(numValue));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;

      // If empty, clear everything
      if (inputValue === "") {
        setDisplayValue("");
        if (onChange) {
          onChange(0);
        }
        return;
      }

      // Remove all non-numeric characters except dots
      inputValue = inputValue.replace(/[^0-9.]/g, "");

      // Remove dots temporarily to get the raw number
      const cleanValue = inputValue.replace(/\./g, "");

      // Validate it's a valid number
      if (cleanValue && !isNaN(Number(cleanValue))) {
        const numericValue = Number(cleanValue);
        
        // Format for display
        const formatted = formatThousands(numericValue);
        setDisplayValue(formatted);

        // Call onChange with the clean numeric value
        if (onChange) {
          onChange(numericValue);
        }
      } else if (cleanValue === "") {
        // Allow clearing the input
        setDisplayValue("");
        if (onChange) {
          onChange(0);
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter, arrows, home, end
      if ([8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
        return;
      }

      // Block comma key (both regular and numpad)
      if (e.key === ',' || e.keyCode === 188 || e.keyCode === 110) {
        e.preventDefault();
        return;
      }

      // Block minus/negative sign
      if (e.key === '-' || e.keyCode === 189 || e.keyCode === 109) {
        e.preventDefault();
        return;
      }

      // Block decimal point (we only want integers for CLP)
      if (e.key === '.' && !e.currentTarget.value.includes('.')) {
        // Allow dot for now, will be handled in onChange
        return;
      }

      // Block any key that's not a number
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = e.clipboardData.getData('text');
      
      // Clean the pasted text - remove everything except numbers
      const cleanedText = pastedText.replace(/[^0-9]/g, "");
      
      if (cleanedText && !isNaN(Number(cleanedText))) {
        e.preventDefault();
        
        const numericValue = Number(cleanedText);
        const formatted = formatThousands(numericValue);
        
        setDisplayValue(formatted);
        if (onChange) {
          onChange(numericValue);
        }
      } else {
        e.preventDefault();
      }
    };

    return (
      <input
        type="text"
        inputMode="numeric"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        {...props}
      />
    );
  }
);
MoneyInput.displayName = "MoneyInput";

export { MoneyInput };
