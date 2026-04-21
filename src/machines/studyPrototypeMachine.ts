import { setup, assign } from "xstate";
import { adaptationStates, promptMap, promptOptions, scenarioMap, scenarios } from "@/lib/prototype-data";
import { createId } from "@/lib/utils";
import type { ChatMessage, ControlVariant, DetailLevel, ScenarioId } from "@/types/prototype";

const defaultScenarioId: ScenarioId = "s1";

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

function getResponseContent(promptId: string | null, level: DetailLevel) {
  if (!promptId) return null;
  const prompt = promptMap[promptId];
  if (!prompt) return null;
  return prompt.responses[level];
}

export const studyPrototypeMachine = setup({
  types: {
    context: {} as {
      scenarioId: ScenarioId;
      selectedPromptId: string | null;
      detailLevel: DetailLevel;
      controlVariant: ControlVariant;
      messages: ChatMessage[];
    },
    events: {} as
      | { type: "SCENARIO.SELECT"; scenarioId: ScenarioId }
      | { type: "PROMPT.SELECT"; promptId: string }
      | { type: "DETAIL.SET"; detailLevel: DetailLevel }
      | { type: "VARIANT.SET"; controlVariant: ControlVariant }
      | { type: "CHAT.SEND" }
      | { type: "CHAT.RESET" },
  },
  actions: {
    selectScenario: assign(({ event, context }) => {
      if (event.type !== "SCENARIO.SELECT") return context;
      return {
        scenarioId: event.scenarioId,
        selectedPromptId: null,
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
    setVariant: assign(({ event, context }) => {
      if (event.type !== "VARIANT.SET") return context;
      return {
        controlVariant: event.controlVariant,
      };
    }),
    sendChat: assign(({ context }) => {
      if (!context.selectedPromptId) return context;
      const prompt = promptMap[context.selectedPromptId];
      if (!prompt) return context;

      const assistantContent = getResponseContent(context.selectedPromptId, context.detailLevel);
      if (!assistantContent) return context;

      return {
        scenarioId: prompt.scenarioId,
        messages: [
          ...context.messages,
          {
            id: createId("user"),
            role: "user",
            content: prompt.prompt,
            meta: `${prompt.label} · ${context.controlVariant === "slider" ? "Slider" : "Profile"} variant · ${adaptationStates.detailLevels.find((item) => item.id === context.detailLevel)?.label ?? context.detailLevel}`,
          },
          {
            id: createId("assistant"),
            role: "assistant",
            content: assistantContent,
            meta: `A03 level: ${context.detailLevel}`,
          },
        ],
      };
    }),
    resetChat: assign(({ context }) => ({
      messages: createWelcomeMessages(context.scenarioId),
      selectedPromptId: null,
    })),
  },
}).createMachine({
  id: "study2Prototype",
  context: {
    scenarioId: defaultScenarioId,
    selectedPromptId: promptOptions[0]?.id ?? null,
    detailLevel: "standard",
    controlVariant: "slider",
    messages: createWelcomeMessages(defaultScenarioId),
  },
  on: {
    "SCENARIO.SELECT": { actions: "selectScenario" },
    "PROMPT.SELECT": { actions: "selectPrompt" },
    "DETAIL.SET": { actions: "setDetailLevel" },
    "VARIANT.SET": { actions: "setVariant" },
    "CHAT.SEND": { actions: "sendChat" },
    "CHAT.RESET": { actions: "resetChat" },
  },
});

export const orderedScenarios = scenarios;
