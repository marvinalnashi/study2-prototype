import { assign, setup } from "xstate";
import {
  adaptationStates,
  promptMap,
  scenarioMap,
  scenarios,
  workArtefactOptions,
} from "@/lib/prototype-data";
import { createId } from "@/lib/utils";
import type {
  ArtefactPayload,
  ChatMessage,
  DetailLevel,
  DocumentArtefactPayload,
  GovernanceBannerVariant,
  IntentFramingSelection,
  PresentationArtefactPayload,
  RolePersona,
  ScenarioId,
} from "@/types/prototype";

const defaultScenarioId: ScenarioId = "s1";
const defaultRolePersona: RolePersona = "new_hire";

function createWelcomeMessages(scenarioId: ScenarioId): ChatMessage[] {
  const scenario = scenarioMap[scenarioId];

  return [
    {
      id: createId("assistant"),
      role: "assistant",
      content: `You are viewing ${scenario.title}. Select a hardcoded prompt below to simulate the walkthrough path for this scenario.`,
      meta: scenario.goal,
    },
  ];
}

function applyRoleAwareFraming({
  base,
  rolePersona,
  level,
}: {
  base: string;
  rolePersona: RolePersona;
  level: DetailLevel;
}) {
  if (rolePersona === "manager") {
    return `Manager framing:\n${base}\n\nFocus: highlight implications, risk, and next-step decisions rather than deep technical explanation.`;
  }

  if (rolePersona === "specialist") {
    return `Specialist framing:\n${base}\n\nAssume domain familiarity and keep the explanation efficient, precise, and terminology-heavy where useful.`;
  }

  if (level === "brief") {
    return `New-hire framing:\n${base}\n\nInclude only the most necessary orientation.`;
  }

  return `New-hire framing:\n${base}\n\nAdd small definitions and orient the user before moving into the main answer.`;
}

function labelFromList(list: Array<{ id: string; label: string }>, id: string) {
  return list.find((item) => item.id === id)?.label ?? id;
}

function buildSensitiveResponse(
  promptId: string,
  framing: IntentFramingSelection | null,
  bannerVariant: GovernanceBannerVariant | null,
) {
  const defaults = {
    goal: workArtefactOptions.intentFraming.goals[0]?.id ?? "reply-manager",
    audience: workArtefactOptions.intentFraming.audiences[0]?.id ?? "internal-manager",
    constraints: workArtefactOptions.intentFraming.constraints[0]?.id ?? "aggregate-only",
    allowedSources: workArtefactOptions.intentFraming.allowedSources[0]?.id ?? "internal-policy",
    requestedOutput: workArtefactOptions.intentFraming.requestedOutputs[0]?.id ?? "email-draft",
  };

  const selected = { ...defaults, ...(framing ?? {}) };

  const goal = labelFromList(workArtefactOptions.intentFraming.goals, selected.goal);
  const audience = labelFromList(workArtefactOptions.intentFraming.audiences, selected.audience);
  const constraints = labelFromList(workArtefactOptions.intentFraming.constraints, selected.constraints);
  const allowedSources = labelFromList(workArtefactOptions.intentFraming.allowedSources, selected.allowedSources);
  const requestedOutput = labelFromList(workArtefactOptions.intentFraming.requestedOutputs, selected.requestedOutput);

  const promptSpecific =
    promptId === "p-s2-1"
      ? {
          title: "Sensitive salary-data summary",
          riskTrigger: "internal salary differences and role-based HR data",
          recommendation:
            "Keep the answer aggregated, avoid identifiable details, and route final use through the relevant HR or compliance owner.",
        }
      : {
          title: "External sharing policy summary",
          riskTrigger: "conditions for sharing internal documentation with an external vendor",
          recommendation:
            "Use approved policy wording, make caveats visible, and flag the answer for policy review before external use.",
        };

  const variantLabel = bannerVariant === "action" ? "banner + action prompt" : "passive banner";

  const content = [
    `${promptSpecific.title}`,
    "",
    "Preflight framing applied before answering:",
    `• Goal: ${goal}`,
    `• Audience: ${audience}`,
    `• Constraint: ${constraints}`,
    `• Allowed sources: ${allowedSources}`,
    `• Requested output: ${requestedOutput}`,
    "",
    "Recommended assistant response:",
    `I can support this request, but only within the framing above. I will treat ${promptSpecific.riskTrigger} as sensitive, stay within ${constraints.toLowerCase()}, rely on ${allowedSources.toLowerCase()}, and produce a ${requestedOutput.toLowerCase()} for ${audience.toLowerCase()}. ${promptSpecific.recommendation}`,
  ].join("\n");

  const meta = `A06 framing active · A09 ${variantLabel} · Uncertainty cue: medium · Freshness cue: verify against current policy version.`;

  return { content, meta };
}

function buildPresentationArtefact(): PresentationArtefactPayload {
  return {
    type: "presentation",
    fileName: "executive-presentation-draft.pptx",
    artefactLabel: "Executive presentation draft",
    slides: structuredClone(workArtefactOptions.presentation.defaultSlides),
  };
}

function buildDocumentArtefact(): DocumentArtefactPayload {
  return {
    type: "document",
    fileName: "workshop-outline-draft.docx",
    artefactLabel: "Workshop outline draft",
    pages: structuredClone(workArtefactOptions.document.defaultPages),
  };
}

function buildArtefactPayload(kind: "presentation" | "document"): ArtefactPayload {
  return kind === "presentation" ? buildPresentationArtefact() : buildDocumentArtefact();
}

function getResponseContent({
  promptId,
  level,
  rolePersona,
  framing,
  bannerVariant,
}: {
  promptId: string | null;
  level: DetailLevel;
  rolePersona: RolePersona;
  framing?: IntentFramingSelection | null;
  bannerVariant?: GovernanceBannerVariant | null;
}) {
  if (!promptId) return null;
  const prompt = promptMap[promptId];
  if (!prompt) return null;

  if (prompt.scenarioId === "s2") {
    return buildSensitiveResponse(promptId, framing ?? null, bannerVariant ?? "passive");
  }

  if (prompt.scenarioId === "s4") {
    return { content: "", meta: undefined };
  }

  const base = prompt.responses?.[level] ?? prompt.responses?.standard;
  if (!base) return null;

  if (prompt.scenarioId === "s1") {
    return {
      content: applyRoleAwareFraming({ base, rolePersona, level }),
      meta: undefined,
    };
  }

  return { content: base, meta: undefined };
}

export const studyPrototypeMachine = setup({
  types: {
    context: {} as {
      scenarioId: ScenarioId;
      selectedPromptId: string | null;
      detailLevel: DetailLevel | null;
      rolePersona: RolePersona;
      messages: ChatMessage[];
    },
    events: {} as
      | { type: "SCENARIO.SELECT"; scenarioId: ScenarioId }
      | { type: "PROMPT.SELECT"; promptId: string }
      | { type: "DETAIL.SET"; detailLevel: DetailLevel }
      | { type: "ROLE.SET"; rolePersona: RolePersona }
      | { type: "CHAT.SEND"; framing?: IntentFramingSelection | null; bannerVariant?: GovernanceBannerVariant | null }
      | { type: "CHAT.RESET" },
  },
  actions: {
    selectScenario: assign(({ event, context }) => {
      if (event.type !== "SCENARIO.SELECT") return context;
      return {
        scenarioId: event.scenarioId,
        selectedPromptId: null,
        detailLevel: null,
        messages: createWelcomeMessages(event.scenarioId),
      };
    }),
    selectPrompt: assign(({ event, context }) => {
      if (event.type !== "PROMPT.SELECT") return context;
      const prompt = promptMap[event.promptId];
      if (!prompt) return context;
      return {
        selectedPromptId: prompt.id,
      };
    }),
    setDetailLevel: assign(({ event, context }) => {
      if (event.type !== "DETAIL.SET") return context;
      return {
        detailLevel: event.detailLevel,
      };
    }),
    setRolePersona: assign(({ event, context }) => {
      if (event.type !== "ROLE.SET") return context;
      return {
        rolePersona: event.rolePersona,
      };
    }),
    sendChat: assign(({ context, event }) => {
      if (event.type !== "CHAT.SEND") return context;
      if (!context.selectedPromptId) return context;
      const prompt = promptMap[context.selectedPromptId];
      if (!prompt) return context;

      const appliedLevel: DetailLevel = context.detailLevel ?? "standard";
      const response = getResponseContent({
        promptId: context.selectedPromptId,
        level: appliedLevel,
        rolePersona: context.rolePersona,
        framing: event.framing ?? null,
        bannerVariant: event.bannerVariant ?? null,
      });
      if (!response) return context;

      const levelLabel = adaptationStates.detailLevels.find((item) => item.id === appliedLevel)?.label ?? appliedLevel;
      const roleLabel = adaptationStates.rolePersonas.find((item) => item.id === context.rolePersona)?.label ?? context.rolePersona;
      const messages: ChatMessage[] = [
        ...context.messages,
        {
          id: createId("user"),
          role: "user",
          content: prompt.prompt,
          meta: prompt.scenarioId === "s1" ? `A02: ${roleLabel} · A03: ${levelLabel}` : undefined,
        },
      ];

      const assistantMessage: ChatMessage = {
        id: createId("assistant"),
        role: "assistant",
        content:
          prompt.scenarioId === "s4"
            ? prompt.artefactKind === "presentation"
              ? "I prepared a draft presentation artefact below. You can revise slide structure, choose hardcoded content blocks, add or remove visuals, and export the deck as PPTX."
              : "I prepared a draft document artefact below. You can revise the A4 pages with predefined text and image blocks, reorder sections, and export the result as DOCX."
            : response.content,
        meta:
          prompt.scenarioId === "s1"
            ? `Role framing: ${roleLabel} · Detail level: ${levelLabel}`
            : prompt.scenarioId === "s4"
              ? "A05 work artefact composer active"
              : response.meta,
      };

      if (prompt.scenarioId === "s4" && prompt.artefactKind) {
        assistantMessage.artefact = buildArtefactPayload(prompt.artefactKind);
      }

      messages.push(assistantMessage);

      return {
        detailLevel: prompt.scenarioId === "s1" ? null : context.detailLevel,
        messages,
      };
    }),
    resetChat: assign(({ context }) => ({
      messages: createWelcomeMessages(context.scenarioId),
      selectedPromptId: null,
      detailLevel: null,
    })),
  },
}).createMachine({
  id: "study2Prototype",
  context: {
    scenarioId: defaultScenarioId,
    selectedPromptId: null,
    detailLevel: null,
    rolePersona: defaultRolePersona,
    messages: createWelcomeMessages(defaultScenarioId),
  },
  on: {
    "SCENARIO.SELECT": { actions: "selectScenario" },
    "PROMPT.SELECT": { actions: "selectPrompt" },
    "DETAIL.SET": { actions: "setDetailLevel" },
    "ROLE.SET": { actions: "setRolePersona" },
    "CHAT.SEND": { actions: "sendChat" },
    "CHAT.RESET": { actions: "resetChat" },
  },
});

export const orderedScenarios = scenarios;
