import { useTheme } from "../hooks/useTheme";
import { useHydratedTranslation } from "../hooks/useHydratedTranslation";

interface ColorOption {
  value: string;
  label: string;
  symbol: string;
}

interface ColorCheckboxGroupProps {
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
}

export function ColorCheckboxGroup({ selectedColors, onColorChange }: ColorCheckboxGroupProps) {
  const { colors } = useTheme();
  const { t } = useHydratedTranslation();

  const colorOptions: ColorOption[] = [
    { value: "w", label: t("colorWhite"), symbol: "W" },
    { value: "u", label: t("colorBlue"), symbol: "U" },
    { value: "b", label: t("colorBlack"), symbol: "B" },
    { value: "r", label: t("colorRed"), symbol: "R" },
    { value: "g", label: t("colorGreen"), symbol: "G" },
  ];

  const handleColorToggle = (colorValue: string, checked: boolean) => {
    if (checked) {
      onColorChange([...selectedColors, colorValue]);
    } else {
      onColorChange(selectedColors.filter(c => c !== colorValue));
    }
  };

  return (
    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
      {colorOptions.map((color) => (
        <label
          key={color.value}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
            fontSize: "0.875rem",
            color: colors.text.primary,
          }}
        >
          <input
            type="checkbox"
            name="colors"
            value={color.value}
            checked={selectedColors.includes(color.value)}
            onChange={(e) => handleColorToggle(color.value, e.target.checked)}
            style={{
              width: "1rem",
              height: "1rem",
              cursor: "pointer",
            }}
          />
          <span>{color.label}</span>
        </label>
      ))}
    </div>
  );
}