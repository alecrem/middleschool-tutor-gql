import type { ReactNode } from "react";
import { useTheme } from "../hooks/useTheme";

interface FormFieldProps {
  label: string;
  children: ReactNode;
  htmlFor?: string;
}

export function FormField({ label, children, htmlFor }: FormFieldProps) {
  const { colors } = useTheme();

  return (
    <div>
      <label
        htmlFor={htmlFor}
        style={{
          display: "block",
          marginBottom: "0.5rem",
          fontSize: "0.875rem",
          fontWeight: "600",
          color: colors.text.primary,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
