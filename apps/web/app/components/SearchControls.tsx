import { Form, useNavigation } from "@remix-run/react";
import { Search, RotateCcw } from 'lucide-react';
import { useHydratedTranslation } from "../hooks/useHydratedTranslation";
import { useSearchFormState } from "../hooks/useSearchFormState";
import { useThemedStyles } from "../hooks/useTheme";
import { Accordion } from "./Accordion";
import { FormField } from "./FormField";
import { NumberRangeSelect } from "./NumberRangeSelect";
import { ColorCheckboxGroup } from "./ColorCheckboxGroup";
import { StyledButton } from "./StyledButton";
import { StyledInput } from "./StyledInput";
import { StyledSelect } from "./StyledSelect";
import { StyledContainer } from "./StyledContainer";
import { Icon } from "./Icon";

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
  const { colors, flexRow, flexColumn, topBorder } = useThemedStyles();
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

  return (
    <StyledContainer variant="section">
      <h2>{t("searchCards")}</h2>
      <p dangerouslySetInnerHTML={{ __html: t("description") }} />

      <Form method="get">
        {/* Main search input */}
        <div style={{ ...flexRow, flexWrap: "wrap", marginBottom: "1rem" }}>
          <StyledInput
            type="text"
            name="query"
            defaultValue={query}
            placeholder={t("searchPlaceholder")}
            onChange={(e) => actions.setQuery(e.target.value)}
            variant="search"
            icon={Search}
          />
          <StyledButton
            type="submit"
            disabled={isSearching || isSearchDisabled}
            size="lg"
            icon={Search}
          >
            {isSearching ? t("searching") : t("search")}
          </StyledButton>
        </div>

        {/* Advanced search accordion */}
        <Accordion title={t("advancedSearch")} defaultExpanded={hasAdvancedFilters}>
          <div style={flexColumn}>
            
            {/* Card Type */}
            <FormField label={t("cardType")}>
              <StyledSelect
                name={state.cardType !== "" ? "cardType" : undefined}
                value={state.cardType}
                onChange={(e) => actions.setCardType(e.target.value)}
              >
                {cardTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </StyledSelect>
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
              ...flexRow,
              gap: "0.75rem",
              marginTop: "1.5rem",
              ...topBorder,
            }}>
              <StyledButton
                type="button"
                onClick={actions.resetToDefaults}
                variant="secondary"
                fullWidth
                icon={RotateCcw}
              >
                {t("resetToDefaults")}
              </StyledButton>
              
              <StyledButton
                type="submit"
                disabled={isSearching || isSearchDisabled}
                variant="primary"
                fullWidth
                icon={Search}
              >
                {isSearching ? t("searching") : t("search")}
              </StyledButton>
            </div>
          </div>
        </Accordion>
      </Form>
    </StyledContainer>
  );
}