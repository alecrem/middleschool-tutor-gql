import { ExternalLink as ExternalLinkIcon } from "lucide-react";
import { useThemedStyles } from "../hooks/useTheme";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function ExternalLink({
  href,
  children,
  style,
  className,
}: ExternalLinkProps) {
  const { colors } = useThemedStyles();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      className={className}
      aria-label={`${typeof children === "string" ? children : "Link"} (external link)`}
    >
      {children}
      <ExternalLinkIcon
        size={14}
        style={{
          marginLeft: "0.25rem",
          color: colors.text.secondary,
          display: "inline",
          verticalAlign: "baseline",
        }}
      />
    </a>
  );
}
