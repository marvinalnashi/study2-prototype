import { setup, assign } from "xstate";
import { adaptationStates, promptMap, promptOptions, scenarioMap, scenarios } from "@/lib/prototype-data";
import { createId } from "@/lib/utils";
import type { ChatMessage, DetailLevel, RolePersona, ScenarioId } from "@/types/prototype";

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

function getResponseContent({
  promptId,
  level,
  rolePersona,
}: {
  promptId: string | null;
  level: DetailLevel;
  rolePersona: RolePersona;
}) {
  if (!promptId) return null;
  const prompt = promptMap[promptId];
  if (!prompt) return null;

  const base = prompt.responses[level];

  if (prompt.scenarioId === "s1") {
    return applyRoleAwareFraming({ base, rolePersona, level });
  }

  return base;
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
      | { type: "CHAT.SEND" }
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
        scenarioId: prompt.scenarioId,
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
    sendChat: assign(({ context }) => {
      if (!context.selectedPromptId) return context;
      const prompt = promptMap[context.selectedPromptId];
      if (!prompt) return context;

      const appliedLevel: DetailLevel = context.detailLevel ?? "standard";
      const assistantContent = getResponseContent({
        promptId: context.selectedPromptId,
        level: appliedLevel,
        rolePersona: context.rolePersona,
      });
      if (!assistantContent) return context;

      const levelLabel = adaptationStates.detailLevels.find((item) => item.id === appliedLevel)?.label ?? appliedLevel;
      const roleLabel = adaptationStates.rolePersonas.find((item) => item.id === context.rolePersona)?.label ?? context.rolePersona;

      return {
        scenarioId: prompt.scenarioId,
        detailLevel: null,
        messages: [
          ...context.messages,
          {
            id: createId("user"),
            role: "user",
            content: prompt.prompt,
            meta: `A02: ${roleLabel} · A03: ${levelLabel}`,
          },
          {
            id: createId("assistant"),
            role: "assistant",
            content: assistantContent,
            meta: prompt.scenarioId === "s1" ? `Role framing: ${roleLabel} · Detail level: ${levelLabel}` : `A03 level: ${levelLabel}`,
          },
        ],
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
    selectedPromptId: promptOptions[0]?.id ?? null,
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
