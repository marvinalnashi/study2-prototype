import scenariosData from "@/data/scenarios.json";
import promptOptionsData from "@/data/prompt-options.json";
import adaptationStatesData from "@/data/adaptation-states.json";
import variantConditionsData from "@/data/variant-conditions.json";
import workArtefactOptionsData from "@/data/work-artefact-options.json";
import type {
  AdaptationState,
  IntentOption,
  PromptOption,
  ScenarioDefinition,
  SelectOption,
  VariantCondition,
  VisualOption,
  PresentationSlideTemplate,
  DocumentPageTemplate,
} from "@/types/prototype";

export const scenarios = scenariosData as ScenarioDefinition[];
export const promptOptions = promptOptionsData as PromptOption[];
export const adaptationStates = adaptationStatesData as AdaptationState;
export const variantConditions = variantConditionsData as VariantCondition[];

export const workArtefactOptions = workArtefactOptionsData as {
  intentFraming: {
    goals: IntentOption[];
    audiences: IntentOption[];
    constraints: IntentOption[];
    allowedSources: IntentOption[];
    requestedOutputs: IntentOption[];
  };
  visualOptions: VisualOption[];
  presentation: {
    titleOptions: SelectOption[];
    bodyOptions: SelectOption[];
    defaultSlides: PresentationSlideTemplate[];
  };
  document: {
    titleOptions: SelectOption[];
    bodyOptions: SelectOption[];
    defaultPages: DocumentPageTemplate[];
  };
};

export const scenarioMap = Object.fromEntries(scenarios.map((scenario) => [scenario.id, scenario])) as Record<string, ScenarioDefinition>;
export const promptMap = Object.fromEntries(promptOptions.map((prompt) => [prompt.id, prompt])) as Record<string, PromptOption>;

export const visualMap = Object.fromEntries(
  workArtefactOptions.visualOptions.map((visual) => [visual.id, visual]),
) as Record<string, VisualOption>;
