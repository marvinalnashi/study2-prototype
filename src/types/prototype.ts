export type ScenarioId = "s1" | "s2" | "s3" | "s4";

export type DetailLevel = "brief" | "standard" | "guided" | "audit";

export type ControlVariant = "slider" | "profiles";

export type MessageRole = "assistant" | "user";

export type PromptOption = {
  id: string;
  scenarioId: ScenarioId;
  label: string;
  prompt: string;
  responses: Record<DetailLevel, string>;
};

export type ScenarioDefinition = {
  id: ScenarioId;
  title: string;
  subtitle: string;
  goal: string;
  adaptations: string[];
  placeholderCards: Array<{
    id: string;
    label: string;
    description: string;
    status: "implemented" | "placeholder";
  }>;
};

export type AdaptationState = {
  detailLevels: Array<{
    id: DetailLevel;
    label: string;
    hint: string;
  }>;
  profiles: Array<{
    id: DetailLevel;
    label: string;
    hint: string;
  }>;
};

export type VariantCondition = {
  scenarioId: ScenarioId;
  primaryTest: string;
  secondaryTest?: string;
  recommendedA03Variant?: ControlVariant;
};

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  meta?: string;
};
