import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/prototype";
import { WorkArtefactComposer } from "@/components/adaptations/work-artefact-composer";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant";
  const hasArtefact = Boolean(message.artefact);

  return (
    <div className={cn("flex w-full flex-col gap-3", isAssistant ? "items-start" : "items-end")}>
      <div
        className={cn(
          "rounded-3xl border px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.18)]",
          hasArtefact ? "w-full max-w-full" : "max-w-[82%]",
          isAssistant
            ? "border-white/10 bg-white/8 text-slate-100"
            : "border-violet-400/20 bg-violet-500/14 text-violet-50",
        )}
      >
        <div className="whitespace-pre-wrap text-sm leading-7">{message.content}</div>
        {message.meta ? <div className="mt-3 text-xs text-slate-400">{message.meta}</div> : null}
        {message.artefact ? <WorkArtefactComposer artefact={message.artefact} /> : null}
      </div>
    </div>
  );
}
