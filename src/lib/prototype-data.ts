import scenariosData from "@/data/scenarios.json";
import promptOptionsData from "@/data/prompt-options.json";
import adaptationStatesData from "@/data/adaptation-states.json";
import variantConditionsData from "@/data/variant-conditions.json";
import type {
  AdaptationState,
  PromptOption,
  ScenarioDefinition,
  VariantCondition,
} from "@/types/prototype";

export const scenarios = scenariosData as ScenarioDefinition[];
export const promptOptions = promptOptionsData as PromptOption[];
export const adaptationStates = adaptationStatesData as AdaptationState;
export const variantConditions = variantConditionsData as VariantCondition[];

export const scenarioMap = Object.fromEntries(scenarios.map((scenario) => [scenario.id, scenario]));
export const promptMap = Object.fromEntries(promptOptions.map((prompt) => [prompt.id, prompt]));
