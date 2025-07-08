import { useTheme } from "../hooks/useTheme";
import { useHydratedTranslation } from "../hooks/useHydratedTranslation";

interface NumberRangeSelectProps {
  minValue: number;
  maxValue: number;
  minDefault: number;
  maxDefault: number;
  maxRange: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  namePrefix: string; // "power", "toughness", "cmc"
}

export function NumberRangeSelect({
  minValue,
  maxValue,
  minDefault,
  maxDefault,
  maxRange,
  onMinChange,
  onMaxChange,
  namePrefix,
}: NumberRangeSelectProps) {
  const { colors } = useTheme();
  const { t } = useHydratedTranslation();
  
  const hasNonDefaultValues = minValue !== minDefault || maxValue !== maxDefault;
  
  const selectStyle = {
    flex: 1,
    padding: "0.5rem",
    border: `1px solid ${colors.border.primary}`,
    borderRadius: "6px",
    fontSize: "0.875rem",
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    cursor: "pointer",
    outline: "none",
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <select
        name={hasNonDefaultValues ? `${namePrefix}Min` : undefined}
        value={minValue}
        onChange={(e) => onMinChange(Number.parseInt(e.target.value))}
        style={selectStyle}
      >
        {Array.from({ length: maxRange + 1 }, (_, i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
      
      <span style={{ color: colors.text.secondary, fontSize: "0.875rem" }}>
        {t("to")}
      </span>
      
      <select
        name={hasNonDefaultValues ? `${namePrefix}Max` : undefined}
        value={maxValue}
        onChange={(e) => onMaxChange(Number.parseInt(e.target.value))}
        style={selectStyle}
      >
        {Array.from({ length: maxRange + 1 }, (_, i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>
    </div>
  );
}