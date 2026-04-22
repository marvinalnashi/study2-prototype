export type ScenarioId = "s1" | "s2" | "s3" | "s4";

export type DetailLevel = "brief" | "standard" | "guided" | "audit";

export type RolePersona = "new_hire" | "manager" | "specialist";

export type GovernanceBannerVariant = "passive" | "action";

export type EvidenceRegisterVariant = "inline" | "ledger";

export type MessageRole = "assistant" | "user";

export type WorkArtefactKind = "presentation" | "document";

export type PromptOption = {
  id: string;
  scenarioId: ScenarioId;
  label: string;
  prompt: string;
  responses?: Partial<Record<DetailLevel, string>>;
  artefactKind?: WorkArtefactKind;
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
  rolePersonas: Array<{
    id: RolePersona;
    label: string;
    hint: string;
  }>;
};

export type VariantCondition = {
  scenarioId: ScenarioId;
  primaryTest: string;
  secondaryTest?: string;
};

export type IntentOption = {
  id: string;
  label: string;
};

export type IntentFramingSelection = {
  goal: string;
  audience: string;
  constraints: string;
  allowedSources: string;
  requestedOutput: string;
};

export type VisualOption = {
  id: string;
  label: string;
  src: string;
  category: "image" | "figure";
};

export type SelectOption = {
  id: string;
  label: string;
};

export type PresentationSlideTemplate = {
  id: string;
  titleOptionId: string;
  bodyOptionId: string;
  visuals: string[];
};

export type PresentationArtefactPayload = {
  type: "presentation";
  fileName: string;
  artefactLabel: string;
  slides: PresentationSlideTemplate[];
};

export type DocumentBlockTemplate = {
  id: string;
  type: "text" | "image";
  titleOptionId?: string;
  bodyOptionId?: string;
  visualId?: string;
};

export type DocumentPageTemplate = {
  id: string;
  blocks: DocumentBlockTemplate[];
};

export type DocumentArtefactPayload = {
  type: "document";
  fileName: string;
  artefactLabel: string;
  pages: DocumentPageTemplate[];
};

export type ArtefactPayload = PresentationArtefactPayload | DocumentArtefactPayload;

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  meta?: string;
  artefact?: ArtefactPayload;
};
