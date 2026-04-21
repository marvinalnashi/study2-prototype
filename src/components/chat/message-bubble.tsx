import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/prototype";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={cn("flex w-full", isAssistant ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[82%] rounded-3xl border px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.18)]",
          isAssistant
            ? "border-white/10 bg-white/8 text-slate-100"
            : "border-violet-400/20 bg-violet-500/14 text-violet-50",
        )}
      >
        <div className="whitespace-pre-wrap text-sm leading-7">{message.content}</div>
        {message.meta ? <div className="mt-3 text-xs text-slate-400">{message.meta}</div> : null}
      </div>
    </div>
  );
}
