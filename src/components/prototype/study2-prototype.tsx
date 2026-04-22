"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMachine } from "@xstate/react";
import { studyPrototypeMachine } from "@/machines/studyPrototypeMachine";
import { scenarioMap, workArtefactOptions } from "@/lib/prototype-data";
import { ScenarioSidebar } from "@/components/layout/scenario-sidebar";
import { PrototypeHeader } from "@/components/layout/prototype-header";
import { AdaptationRail } from "@/components/layout/adaptation-rail";
import { MessageBubble } from "@/components/chat/message-bubble";
import { AdaptiveInteractionControl } from "@/components/adaptations/adaptive-interaction-control";
import { RoleAwareResponseDetail } from "@/components/adaptations/role-aware-response-detail";
import { PreflightTaskFraming } from "@/components/adaptations/preflight-task-framing";
import { GovernanceBanner } from "@/components/adaptations/governance-banner";
import { ChatComposer } from "@/components/chat/chat-composer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ShieldAlert, FileOutput, SearchCheck } from "lucide-react";
import type {
  GovernanceBannerVariant,
  IntentFramingSelection,
} from "@/types/prototype";

const scenarioIcons = {
  s1: Lightbulb,
  s2: ShieldAlert,
  s3: SearchCheck,
  s4: FileOutput,
};

const defaultFraming: IntentFramingSelection = {
  goal: workArtefactOptions.intentFraming.goals[0]?.id ?? "reply-manager",
  audience: workArtefactOptions.intentFraming.audiences[0]?.id ?? "internal-manager",
  constraints: workArtefactOptions.intentFraming.constraints[0]?.id ?? "aggregate-only",
  allowedSources: workArtefactOptions.intentFraming.allowedSources[0]?.id ?? "internal-policy",
  requestedOutput: workArtefactOptions.intentFraming.requestedOutputs[0]?.id ?? "email-draft",
};

export function Study2Prototype() {
  const [state, send] = useMachine(studyPrototypeMachine);
  const scenario = scenarioMap[state.context.scenarioId];
  const ActiveIcon = scenarioIcons[state.context.scenarioId];
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isFramingEditorOpen, setIsFramingEditorOpen] = useState(false);
  const [draftFraming, setDraftFraming] = useState<IntentFramingSelection>(defaultFraming);
  const [appliedFraming, setAppliedFraming] = useState<IntentFramingSelection>(defaultFraming);
  const [bannerVariant, setBannerVariant] = useState<GovernanceBannerVariant>("passive");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [state.context.messages.length]);

  useEffect(() => {
    if (state.context.scenarioId !== "s2") {
      setIsFramingEditorOpen(false);
      setBannerVariant("passive");
    }
  }, [state.context.scenarioId]);

  const introDescription = useMemo(() => {
    if (state.context.scenarioId === "s1") {
      return "Try how the same request changes when the audience and detail level change.";
    }
    if (state.context.scenarioId === "s2") {
      return "Review the setup first, then compare how the warning changes the answer path.";
    }
    if (state.context.scenarioId === "s3") {
      return "Send a prompt, then open Sources inside the reply to inspect the evidence behind it.";
    }
    if (state.context.scenarioId === "s4") {
      return "Send a prompt to open an editable work output directly inside the conversation.";
    }
    return "This area simulates a lightweight enterprise assistant walkthrough.";
  }, [state.context.scenarioId]);

  return (
    <main className="min-h-screen w-full bg-transparent xl:h-dvh xl:overflow-hidden">
      <div className="min-h-screen xl:grid xl:h-full xl:grid-cols-[272px_minmax(0,1fr)_308px]">
        <ScenarioSidebar
          currentScenarioId={state.context.scenarioId}
          onSelectScenario={(scenarioId) => send({ type: "SCENARIO.SELECT", scenarioId })}
        />

        <section className="flex min-h-screen min-w-0 flex-col xl:h-full xl:min-h-0">
          <PrototypeHeader scenario={scenario} />

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 xl:px-6">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-500/12 text-violet-200">
                      <ActiveIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle>{scenario.title}</CardTitle>
                      <CardDescription>{scenario.subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {state.context.scenarioId === "s1" ? (
                    <>
                      <RoleAwareResponseDetail
                        rolePersona={state.context.rolePersona}
                        onChange={(rolePersona) => send({ type: "ROLE.SET", rolePersona })}
                      />
                      <AdaptiveInteractionControl
                        detailLevel={state.context.detailLevel}
                        onChange={(detailLevel) => send({ type: "DETAIL.SET", detailLevel })}
                      />
                    </>
                  ) : null}

                  {state.context.scenarioId === "s2" ? (
                    <>
                      <PreflightTaskFraming
                        appliedSelection={appliedFraming}
                        draftSelection={draftFraming}
                        isEditing={isFramingEditorOpen}
                        onOpenEditor={() => {
                          setDraftFraming(appliedFraming);
                          setIsFramingEditorOpen(true);
                        }}
                        onCancel={() => {
                          setDraftFraming(appliedFraming);
                          setIsFramingEditorOpen(false);
                        }}
                        onUpdateField={(field, value) =>
                          setDraftFraming((current) => ({ ...current, [field]: value }))
                        }
                        onApply={() => {
                          setAppliedFraming(draftFraming);
                          setIsFramingEditorOpen(false);
                        }}
                      />
                      <GovernanceBanner
                        variant={bannerVariant}
                        onVariantChange={setBannerVariant}
                        selectedPromptId={state.context.selectedPromptId}
                        framing={appliedFraming}
                      />
                    </>
                  ) : null}
                </CardContent>
              </Card>

              <Card className="min-h-[320px] xl:min-h-[380px]">
                <CardHeader>
                  <CardTitle>Conversation</CardTitle>
                  <CardDescription>{introDescription}</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[46dvh] space-y-4 overflow-y-auto pr-2 xl:max-h-[52dvh]">
                  {state.context.messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  <div ref={messagesEndRef} />
                </CardContent>
              </Card>
            </div>
          </div>

          <ChatComposer
            scenarioId={state.context.scenarioId}
            selectedPromptId={state.context.selectedPromptId}
            completedPromptIds={state.context.completedPromptIds}
            onPromptChange={(promptId) => send({ type: "PROMPT.SELECT", promptId })}
            onSend={() =>
              send({
                type: "CHAT.SEND",
                framing: state.context.scenarioId === "s2" ? appliedFraming : null,
                bannerVariant: state.context.scenarioId === "s2" ? bannerVariant : null,
              })
            }
            onNextStep={() => send({ type: "CHAT.NEXT_STEP" })}
            onReset={() => send({ type: "CHAT.RESET" })}
          />
        </section>

        <AdaptationRail scenario={scenario} scenarioId={state.context.scenarioId} />
      </div>
    </main>
  );
}
