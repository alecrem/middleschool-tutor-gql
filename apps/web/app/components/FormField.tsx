import { ReactNode } from "react";
import { useTheme } from "../hooks/useTheme";

interface FormFieldProps {
  label: string;
  children: ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  const { colors } = useTheme();

  return (
    <div>
      <label
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