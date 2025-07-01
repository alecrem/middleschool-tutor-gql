import { Form, useNavigation } from "@remix-run/react";
import { useHydratedTranslation } from "../hooks/useHydratedTranslation";
import { useSearchFormState } from "../hooks/useSearchFormState";
import { useTheme } from "../hooks/useTheme";
import { Accordion } from "./Accordion";
import { FormField } from "./FormField";
import { NumberRangeSelect } from "./NumberRangeSelect";
import { ColorCheckboxGroup } from "./ColorCheckboxGroup";

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
  const { t } = useHydratedTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  
  // Initialize form state with current URL parameters
  const { state, actions, isSearchDisabled, defaults } = useSearchFormState({
    query,
    cardType,
    colors: selectedColors,
    powerMin,
    powerMax,
    toughnessMin,
    toughnessMax,
    cmcMin,
    cmcMax,
  });

  const isSearching = navigation.state === "loading" && 
    navigation.location?.search.includes("query=");

  // Card type options
  const cardTypes = [
    { value: "", label: t("allCardTypes") },
    { value: "artifact", label: t("artifact") },
    { value: "creature", label: t("creature") },
    { value: "enchantment", label: t("enchantment") },
    { value: "instant", label: t("instant") },
    { value: "land", label: t("land") },
    { value: "sorcery", label: t("sorcery") },
  ];

  // Check if advanced search should be expanded by default
  const hasAdvancedFilters = 
    cardType !== "" || 
    selectedColors.length > 0 || 
    powerMin !== defaults.powerMin || 
    powerMax !== defaults.powerMax || 
    toughnessMin !== defaults.toughnessMin || 
    toughnessMax !== defaults.toughnessMax || 
    cmcMin !== defaults.cmcMin || 
    cmcMax !== defaults.cmcMax;

  const containerStyle = {
    backgroundColor: colors.background.secondary,
    padding: "1.5rem",
    borderRadius: "8px",
    marginBottom: "2rem",
  };

  const inputStyle = {
    flex: 1,
    minWidth: "200px",
    padding: "0.75rem",
    border: `1px solid ${colors.border.primary}`,
    borderRadius: "6px",
    fontSize: "1rem",
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
  };

  const buttonStyle = (disabled: boolean) => ({
    padding: "0.75rem 1.5rem",
    backgroundColor: disabled ? colors.button.disabled : colors.button.primary,
    color: colors.button.text,
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    cursor: disabled ? "not-allowed" : "pointer",
  });

  const selectStyle = {
    width: "100%",
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
    <div style={containerStyle}>
      <h2>{t("searchCards")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("description") }} />

      <Form method="get">
        {/* Main search input */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder={t("searchPlaceholder")}
            onChange={(e) => actions.setQuery(e.target.value)}
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={isSearching || isSearchDisabled}
            style={buttonStyle(isSearching || isSearchDisabled)}
          >
            {isSearching ? t("searching") : t("search")}
          </button>
        </div>

        {/* Advanced search accordion */}
        <Accordion title={t("advancedSearch")} defaultExpanded={hasAdvancedFilters}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            {/* Card Type */}
            <FormField label={t("cardType")}>
              <select
                name={state.cardType !== "" ? "cardType" : undefined}
                value={state.cardType}
                onChange={(e) => actions.setCardType(e.target.value)}
                style={selectStyle}
              >
                {cardTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Colors */}
            <FormField label={t("colors")}>
              <ColorCheckboxGroup
                selectedColors={state.colors}
                onColorChange={actions.setColors}
              />
            </FormField>

            {/* Mana Value (CMC) */}
            <FormField label={t("cmc")}>
              <NumberRangeSelect
                minValue={state.cmcMin}
                maxValue={state.cmcMax}
                minDefault={defaults.cmcMin}
                maxDefault={defaults.cmcMax}
                maxRange={16}
                onMinChange={(min) => actions.setCmcRange(min, state.cmcMax)}
                onMaxChange={(max) => actions.setCmcRange(state.cmcMin, max)}
                namePrefix="cmc"
              />
            </FormField>

            {/* Power */}
            <FormField label={t("power")}>
              <NumberRangeSelect
                minValue={state.powerMin}
                maxValue={state.powerMax}
                minDefault={defaults.powerMin}
                maxDefault={defaults.powerMax}
                maxRange={13}
                onMinChange={(min) => actions.setPowerRange(min, state.powerMax)}
                onMaxChange={(max) => actions.setPowerRange(state.powerMin, max)}
                namePrefix="power"
              />
            </FormField>

            {/* Toughness */}
            <FormField label={t("toughness")}>
              <NumberRangeSelect
                minValue={state.toughnessMin}
                maxValue={state.toughnessMax}
                minDefault={defaults.toughnessMin}
                maxDefault={defaults.toughnessMax}
                maxRange={13}
                onMinChange={(min) => actions.setToughnessRange(min, state.toughnessMax)}
                onMaxChange={(max) => actions.setToughnessRange(state.toughnessMin, max)}
                namePrefix="toughness"
              />
            </FormField>

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
                onClick={actions.resetToDefaults}
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
                  color: (isSearching || isSearchDisabled) ? colors.text.secondary : colors.button.text,
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