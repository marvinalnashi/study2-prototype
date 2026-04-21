"use client";

import { useMachine } from "@xstate/react";
import { studyPrototypeMachine } from "@/machines/studyPrototypeMachine";
import { scenarioMap } from "@/lib/prototype-data";
import { ScenarioSidebar } from "@/components/layout/scenario-sidebar";
import { PrototypeHeader } from "@/components/layout/prototype-header";
import { AdaptationRail } from "@/components/layout/adaptation-rail";
import { MessageBubble } from "@/components/chat/message-bubble";
import { AdaptiveInteractionControl } from "@/components/adaptations/adaptive-interaction-control";
import { ChatComposer } from "@/components/chat/chat-composer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ShieldAlert, FileOutput, SearchCheck } from "lucide-react";

const scenarioIcons = {
  s1: Lightbulb,
  s2: ShieldAlert,
  s3: SearchCheck,
  s4: FileOutput,
};

export function Study2Prototype() {
  const [state, send] = useMachine(studyPrototypeMachine);

  const scenario = scenarioMap[state.context.scenarioId];
  const ActiveIcon = scenarioIcons[state.context.scenarioId];

  return (
    <main className="h-dvh w-full overflow-hidden">
      <div className="grid h-full grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <ScenarioSidebar
          currentScenarioId={state.context.scenarioId}
          onSelectScenario={(scenarioId) => send({ type: "SCENARIO.SELECT", scenarioId })}
        />

        <section className="flex h-full min-w-0 flex-col">
          <PrototypeHeader
            scenario={scenario}
            controlVariant={state.context.controlVariant}
            onVariantChange={(controlVariant) => send({ type: "VARIANT.SET", controlVariant })}
          />

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
              <Card className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/12 text-violet-200">
                        <ActiveIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>{scenario.title}</CardTitle>
                        <CardDescription>{scenario.subtitle}</CardDescription>
                      </div>
                    </div>
                    <Badge className="border-white/10 bg-white/5 text-slate-300">{scenario.goal}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <AdaptiveInteractionControl
                    controlVariant={state.context.controlVariant}
                    detailLevel={state.context.detailLevel}
                    onChange={(detailLevel) => send({ type: "DETAIL.SET", detailLevel })}
                  />
                </CardContent>
              </Card>

              <Card className="min-h-[380px]">
                <CardHeader>
                  <CardTitle>Conversation area</CardTitle>
                  <CardDescription>
                    This area simulates enterprise assistant interaction. For now, only A03 changes response depth live.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.context.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <ChatComposer
            scenarioId={state.context.scenarioId}
            selectedPromptId={state.context.selectedPromptId}
            onPromptChange={(promptId) => send({ type: "PROMPT.SELECT", promptId })}
            onSend={() => send({ type: "CHAT.SEND" })}
            onReset={() => send({ type: "CHAT.RESET" })}
          />
        </section>

        <AdaptationRail scenario={scenario} scenarioId={state.context.scenarioId} />
      </div>
    </main>
  );
}
