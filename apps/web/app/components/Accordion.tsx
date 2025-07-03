import { useState, ReactNode } from "react";
import { ChevronDown } from 'lucide-react';
import { useTheme } from "../hooks/useTheme";
import { Icon } from './Icon';

interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export function Accordion({ title, children, defaultExpanded = false }: AccordionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { colors } = useTheme();

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <button
        type="button"
        onClick={toggleExpanded}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.border.primary}`,
          borderRadius: isExpanded ? "8px 8px 0 0" : "8px",
          fontSize: "1rem",
          color: colors.text.primary,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          outline: "none",
        }}
        aria-expanded={isExpanded}
      >
        <span>{title}</span>
        <span
          style={{
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <Icon icon={ChevronDown} size="sm" />
        </span>
      </button>
      {isExpanded && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: colors.background.secondary,
            border: `1px solid ${colors.border.primary}`,
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}