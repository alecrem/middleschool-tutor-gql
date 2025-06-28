import { Form, useNavigation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Accordion } from "./Accordion";
import { useTheme } from "../hooks/useTheme";

interface SearchControlsProps {
  query: string;
  cardType: string;
  colors: string[];
  powerMin?: number;
  powerMax?: number;
  toughnessMin?: number;
  toughnessMax?: number;
  cmcMin?: number;
  cmcMax?: number;
}

export function SearchControls({ 
  query, 
  cardType, 
  colors: selectedColors, 
  powerMin = 0, 
  powerMax = 13, 
  toughnessMin = 0, 
  toughnessMax = 13,
  cmcMin = 0,
  cmcMax = 16
}: SearchControlsProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  
  // Track form state for button disabling
  const [currentQuery, setCurrentQuery] = useState(query);
  const [currentCardType, setCurrentCardType] = useState(cardType);
  const [currentColors, setCurrentColors] = useState(selectedColors);
  const [currentPowerMin, setCurrentPowerMin] = useState(powerMin);
  const [currentPowerMax, setCurrentPowerMax] = useState(powerMax);
  const [currentToughnessMin, setCurrentToughnessMin] = useState(toughnessMin);
  const [currentToughnessMax, setCurrentToughnessMax] = useState(toughnessMax);
  const [currentCmcMin, setCurrentCmcMin] = useState(cmcMin);
  const [currentCmcMax, setCurrentCmcMax] = useState(cmcMax);
  
  const isSearching =
    navigation.state === "loading" &&
    navigation.location?.search.includes("query=");

  // Check if search should be disabled (no query and all defaults)
  const isSearchDisabled = !currentQuery.trim() && 
    currentCardType === "" && 
    currentColors.length === 0 && 
    currentPowerMin === 0 && 
    currentPowerMax === 13 && 
    currentToughnessMin === 0 && 
    currentToughnessMax === 13 && 
    currentCmcMin === 0 && 
    currentCmcMax === 16;

  const cardTypes = [
    { value: "", label: t("allCardTypes") },
    { value: "artifact", label: t("artifact") },
    { value: "creature", label: t("creature") },
    { value: "enchantment", label: t("enchantment") },
    { value: "instant", label: t("instant") },
    { value: "land", label: t("land") },
    { value: "sorcery", label: t("sorcery") },
  ];

  const colorOptions = [
    { value: "w", label: t("colorWhite"), symbol: "W" },
    { value: "u", label: t("colorBlue"), symbol: "U" },
    { value: "b", label: t("colorBlack"), symbol: "B" },
    { value: "r", label: t("colorRed"), symbol: "R" },
    { value: "g", label: t("colorGreen"), symbol: "G" },
  ];

  return (
    <div
      style={{
        backgroundColor: colors.background.secondary,
        padding: "1.5rem",
        borderRadius: "8px",
        marginBottom: "2rem",
      }}
    >
      <h2>{t("searchCards")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("description") }} />

      <Form method="get">
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder={t("searchPlaceholder")}
            onChange={(e) => setCurrentQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "0.75rem",
              border: `1px solid ${colors.border.primary}`,
              borderRadius: "6px",
              fontSize: "1rem",
              backgroundColor: colors.background.primary,
              color: colors.text.primary,
            }}
          />
          <button
            type="submit"
            disabled={isSearching || isSearchDisabled}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: (isSearching || isSearchDisabled) ? colors.button.disabled : colors.button.primary,
              color: colors.button.text,
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              cursor: (isSearching || isSearchDisabled) ? "not-allowed" : "pointer",
            }}
          >
            {isSearching ? t("searching") : t("search")}
          </button>
        </div>

        <Accordion title={t("advancedSearch")} defaultExpanded={
          cardType !== "" || 
          selectedColors.length > 0 || 
          powerMin !== 0 || 
          powerMax !== 13 || 
          toughnessMin !== 0 || 
          toughnessMax !== 13 || 
          cmcMin !== 0 || 
          cmcMax !== 16
        }>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label
                htmlFor="cardType"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: colors.text.primary,
                }}
              >
                {t("cardType")}
              </label>
              <select
                id="cardType"
                name={currentCardType !== "" ? "cardType" : undefined}
                defaultValue={cardType}
                onChange={(e) => setCurrentCardType(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: `1px solid ${colors.border.primary}`,
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  backgroundColor: colors.background.primary,
                  color: colors.text.primary,
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {cardTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

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
                {t("colors")}
              </label>
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
                      defaultChecked={selectedColors.includes(color.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCurrentColors([...currentColors, color.value]);
                        } else {
                          setCurrentColors(currentColors.filter(c => c !== color.value));
                        }
                      }}
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
            </div>

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
                {t("cmc")}
              </label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <select
                  name={currentCmcMin !== 0 || currentCmcMax !== 16 ? "cmcMin" : undefined}
                  defaultValue={cmcMin}
                  onChange={(e) => setCurrentCmcMin(parseInt(e.target.value))}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: `1px solid ${colors.border.primary}`,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {Array.from({ length: 17 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
                <span style={{ color: colors.text.secondary, fontSize: "0.875rem" }}>{t("to")}</span>
                <select
                  name={currentCmcMin !== 0 || currentCmcMax !== 16 ? "cmcMax" : undefined}
                  defaultValue={cmcMax}
                  onChange={(e) => setCurrentCmcMax(parseInt(e.target.value))}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: `1px solid ${colors.border.primary}`,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {Array.from({ length: 17 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
                {t("power")}
              </label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <select
                  name={currentPowerMin !== 0 || currentPowerMax !== 13 ? "powerMin" : undefined}
                  defaultValue={powerMin}
                  onChange={(e) => setCurrentPowerMin(parseInt(e.target.value))}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: `1px solid ${colors.border.primary}`,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {Array.from({ length: 14 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
                <span style={{ color: colors.text.secondary, fontSize: "0.875rem" }}>{t("to")}</span>
                <select
                  name={currentPowerMin !== 0 || currentPowerMax !== 13 ? "powerMax" : undefined}
                  defaultValue={powerMax}
                  onChange={(e) => setCurrentPowerMax(parseInt(e.target.value))}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: `1px solid ${colors.border.primary}`,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {Array.from({ length: 14 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
                {t("toughness")}
              </label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <select
                  name={currentToughnessMin !== 0 || currentToughnessMax !== 13 ? "toughnessMin" : undefined}
                  defaultValue={toughnessMin}
                  onChange={(e) => setCurrentToughnessMin(parseInt(e.target.value))}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: `1px solid ${colors.border.primary}`,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {Array.from({ length: 14 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
                <span style={{ color: colors.text.secondary, fontSize: "0.875rem" }}>{t("to")}</span>
                <select
                  name={currentToughnessMin !== 0 || currentToughnessMax !== 13 ? "toughnessMax" : undefined}
                  defaultValue={toughnessMax}
                  onChange={(e) => setCurrentToughnessMax(parseInt(e.target.value))}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: `1px solid ${colors.border.primary}`,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    backgroundColor: colors.background.primary,
                    color: colors.text.primary,
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {Array.from({ length: 14 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "1.5rem",
              paddingTop: "1rem",
              borderTop: `1px solid ${colors.border.primary}`,
            }}>
              <button
                type="button"
                onClick={() => {
                  // Reset all form state to defaults
                  setCurrentCardType("");
                  setCurrentColors([]);
                  setCurrentCmcMin(0);
                  setCurrentCmcMax(16);
                  setCurrentPowerMin(0);
                  setCurrentPowerMax(13);
                  setCurrentToughnessMin(0);
                  setCurrentToughnessMax(13);
                  
                  // Navigate to clean URL (no query params)
                  const form = document.querySelector('form') as HTMLFormElement;
                  if (form) {
                    // Reset form inputs
                    const inputs = form.querySelectorAll('input, select') as NodeListOf<HTMLInputElement | HTMLSelectElement>;
                    inputs.forEach(input => {
                      if (input.type === 'checkbox') {
                        (input as HTMLInputElement).checked = false;
                      } else if (input.type === 'text') {
                        input.value = '';
                      } else if (input.tagName === 'SELECT') {
                        const select = input as HTMLSelectElement;
                        if (select.name === 'cardType') {
                          select.value = '';
                        } else if (select.name?.includes('cmc')) {
                          select.value = select.name.includes('Min') ? '0' : '16';
                        } else if (select.name?.includes('power') || select.name?.includes('toughness')) {
                          select.value = select.name.includes('Min') ? '0' : '13';
                        }
                      }
                    });
                  }
                }}
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  border: `1px solid ${colors.border.primary}`,
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  backgroundColor: colors.background.primary,
                  color: colors.text.primary,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.background.primary;
                }}
              >
                {t("resetToDefaults")}
              </button>
              
              <button
                type="submit"
                disabled={isSearching || isSearchDisabled}
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  backgroundColor: (isSearching || isSearchDisabled) ? colors.background.secondary : colors.button.primary,
                  color: (isSearching || isSearchDisabled) ? colors.text.disabled : colors.button.text,
                  cursor: (isSearching || isSearchDisabled) ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  opacity: (isSearching || isSearchDisabled) ? 0.6 : 1,
                }}
              >
                {isSearching ? t("searching") : t("search")}
              </button>
            </div>
          </div>
        </Accordion>
      </Form>
    </div>
  );
}