import { assign, setup } from "xstate";
import {
  adaptationStates,
  promptMap,
  promptOptions,
  scenarioMap,
  scenarios,
  workArtefactOptions,
} from "@/lib/prototype-data";
import { evidenceLedgerMap } from "@/lib/evidence-data";
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
      content: `You are viewing ${scenario.title}. Choose one of the prepared prompts below to walk through this part of the prototype.`,
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
    return `Audience: Manager\n\n${base}\n\nFocus on business impact, risk, and next action rather than deep technical detail.`;
  }

  if (rolePersona === "specialist") {
    return `Audience: Specialist\n\n${base}\n\nAssume domain familiarity and keep the wording efficient and precise.`;
  }

  if (level === "brief") {
    return `Audience: New hire\n\n${base}\n\nKeep the explanation short and easy to scan.`;
  }

  return `Audience: New hire\n\n${base}\n\nAdd a little orientation so the user does not have to infer missing background knowledge.`;
}

function labelFromList(list: Array<{ id: string; label: string }>, id: string) {
  return list.find((item) => item.id === id)?.label ?? id;
}

function buildSalaryOutput(selected: IntentFramingSelection) {
  const output = selected.requestedOutput;

  if (output === "email-draft") {
    return [
      "Example answer",
      "",
      "Subject: Safe summary of salary differences",
      "",
      "Hi,",
      "I can provide a high-level summary of salary differences by role, but I should not share person-level or directly identifiable salary data in a quick reply.",
      "",
      "A safe summary would describe broad patterns only, for example whether one role family trends higher than another or whether pay differences are linked to seniority bands rather than individuals.",
      "",
      "If you need a report for action, the next step should be a reviewed HR or compliance output based on approved access and the latest HR policy.",
      "",
      "Best,",
      "Enterprise assistant draft",
    ].join("\n");
  }

  if (output === "review-note") {
    return [
      "Example answer",
      "",
      "Review note:",
      "• This request touches salary-related HR data.",
      "• A safe response should stay at aggregate level only.",
      "• Do not include names, exact salaries, or small-group data that could reveal identities.",
      "• Route the final answer through HR or compliance before it is used.",
    ].join("\n");
  }

  return [
    "Example answer",
    "",
    "Safe summary:",
    "• Share only broad patterns, ranges, or trends.",
    "• Avoid names, exact salaries, and small-group breakdowns.",
    "• Treat the result as a draft that still needs HR or compliance review before wider use.",
  ].join("\n");
}

function buildExternalSharingOutput(selected: IntentFramingSelection) {
  const output = selected.requestedOutput;

  if (output === "email-draft") {
    return [
      "Example answer",
      "",
      "Subject: Conditions for sharing internal documents externally",
      "",
      "Hi,",
      "Internal documentation may be shared with an external vendor only when the sharing purpose is legitimate, the vendor relationship is approved, and the material is checked against the current policy before it is sent.",
      "",
      "Please share only the minimum set of documents needed for the task, remove or mask sensitive internal details where possible, and record the reason for disclosure.",
      "",
      "If the material is sensitive or the policy wording is unclear, send it for policy or compliance review before external use.",
      "",
      "Best,",
      "Enterprise assistant draft",
    ].join("\n");
  }

  if (output === "review-note") {
    return [
      "Example answer",
      "",
      "Review note:",
      "• External sharing is allowed only after the right approval and documentation steps are complete.",
      "• Share the minimum necessary information.",
      "• Re-check whether the document is current and approved for external use.",
      "• Ask for policy review if the document contains sensitive or unclear content.",
    ].join("\n");
  }

  return [
    "Example answer",
    "",
    "Policy summary:",
    "• Internal documents may be shared externally only for an approved purpose.",
    "• The relevant approval step must be completed and recorded.",
    "• Only the minimum needed information should be shared.",
    "• Sensitive or unclear material should be reviewed before it is sent outside the organisation.",
  ].join("\n");
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
          title: "Salary-data request",
          riskTrigger: "salary-related HR data",
          answer: buildSalaryOutput(selected),
        }
      : {
          title: "External-sharing policy request",
          riskTrigger: "conditions for sharing internal documents with an external vendor",
          answer: buildExternalSharingOutput(selected),
        };

  const variantLabel = bannerVariant === "action" ? "warning + review step" : "warning only";

  const content = [
    `${promptSpecific.title}`,
    "",
    "Request setup used before answering:",
    `• Goal: ${goal}`,
    `• Audience: ${audience}`,
    `• Limit: ${constraints}`,
    `• Sources: ${allowedSources}`,
    `• Output: ${requestedOutput}`,
    "",
    `Why the assistant slowed down: this request touches ${promptSpecific.riskTrigger}.`,
    "",
    promptSpecific.answer,
  ].join("\n");

  const meta = `A06 setup applied · A09 ${variantLabel} · Confidence: medium · Freshness cue: check the latest policy version before real use.`;

  return { content, meta };
}

function buildEvidenceHeavyResponse(promptId: string) {
  if (promptId === "p-s3-1") {
    return {
      content: [
        "Current answer",
        "",
        "The latest accessibility obligation is likely relevant for this organisation, but the final decision still depends on the organisation’s exact scope.",
        "",
        "Why I say that:",
        "• The internal accessibility policy says customer-facing journeys in scope must be reviewed before release approval.",
        "• The public regulation summary says the obligation applies to organisations in the covered market segment, subject to sector and size conditions.",
        "• The implementation checklist adds the expected follow-up actions such as logging unresolved findings and assigning remediation owners.",
        "",
        "Why this should still be checked:",
        "• One older source was left out because it uses outdated wording.",
        "• One blog-style source was left out because it overstates the rule.",
        "• One legal memo could not be opened in this walkthrough path.",
        "",
        "Open Sources to inspect the exact fragments behind this answer.",
      ].join("\n"),
      meta: "Evidence-heavy reply · Confidence and freshness are shown inside the Sources view.",
    };
  }

  return {
    content: [
      "Current answer",
      "",
      "The two policy summaries are broadly aligned, but they emphasise different parts of the approval process.",
      "",
      "Main differences reported:",
      "• Policy summary A makes team-lead approval explicit before external sharing.",
      "• Policy summary B focuses more on documenting the disclosure condition in the record.",
      "• Both still point to the same core rule: sharing is allowed only after approval and documentation are complete.",
      "",
      "Why this comparison is limited:",
      "• An archived slide deck was left out because it exaggerated the difference.",
      "• A working draft was left out because it was not approved for use.",
      "• A department exception log could not be accessed in this walkthrough path.",
      "",
      "Open Sources to inspect the exact fragments behind each point.",
    ].join("\n"),
    meta: "Evidence-heavy reply · Confidence and freshness are shown inside the Sources view.",
  };
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

  if (prompt.scenarioId === "s3") {
    return buildEvidenceHeavyResponse(promptId);
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
      completedPromptIds: string[];
    },
    events: {} as
      | { type: "SCENARIO.SELECT"; scenarioId: ScenarioId }
      | { type: "PROMPT.SELECT"; promptId: string }
      | { type: "DETAIL.SET"; detailLevel: DetailLevel }
      | { type: "ROLE.SET"; rolePersona: RolePersona }
      | { type: "CHAT.SEND"; framing?: IntentFramingSelection | null; bannerVariant?: GovernanceBannerVariant | null }
      | { type: "CHAT.NEXT_STEP" }
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
        completedPromptIds: [],
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
    selectNextStep: assign(({ context }) => {
      const scenarioPrompts = promptOptions.filter((item) => item.scenarioId === context.scenarioId);
      const nextPrompt = scenarioPrompts.find((item) => !context.completedPromptIds.includes(item.id)) ?? null;
      if (!nextPrompt || nextPrompt.id === context.selectedPromptId) {
        return context;
      }
      return {
        selectedPromptId: nextPrompt.id,
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
          meta: prompt.scenarioId === "s1" ? `Audience: ${roleLabel} · Detail: ${levelLabel}` : undefined,
        },
      ];

      const assistantMessage: ChatMessage = {
        id: createId("assistant"),
        role: "assistant",
        content:
          prompt.scenarioId === "s4"
            ? prompt.artefactKind === "presentation"
              ? "I prepared a draft presentation below. You can change the content, visuals, and slide order before exporting it."
              : "I prepared a draft document below. You can change the content blocks, images, and page structure before exporting it."
            : response.content,
        meta:
          prompt.scenarioId === "s1"
            ? `Audience used: ${roleLabel} · Detail level: ${levelLabel}`
            : prompt.scenarioId === "s4"
              ? "A05 work output editor active"
              : response.meta,
      };

      if (prompt.scenarioId === "s3") {
        assistantMessage.evidence = evidenceLedgerMap[prompt.id] ?? undefined;
      }

      if (prompt.scenarioId === "s4" && prompt.artefactKind) {
        assistantMessage.artefact = buildArtefactPayload(prompt.artefactKind);
      }

      messages.push(assistantMessage);

      return {
        detailLevel: prompt.scenarioId === "s1" ? null : context.detailLevel,
        messages,
        completedPromptIds: context.completedPromptIds.includes(prompt.id)
          ? context.completedPromptIds
          : [...context.completedPromptIds, prompt.id],
      };
    }),
    resetChat: assign(({ context }) => ({
      messages: createWelcomeMessages(context.scenarioId),
      selectedPromptId: null,
      detailLevel: null,
      completedPromptIds: [],
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
    completedPromptIds: [],
  },
  on: {
    "SCENARIO.SELECT": { actions: "selectScenario" },
    "PROMPT.SELECT": { actions: "selectPrompt" },
    "CHAT.NEXT_STEP": { actions: "selectNextStep" },
    "DETAIL.SET": { actions: "setDetailLevel" },
    "ROLE.SET": { actions: "setRolePersona" },
    "CHAT.SEND": { actions: "sendChat" },
    "CHAT.RESET": { actions: "resetChat" },
  },
});

export const orderedScenarios = scenarios;
