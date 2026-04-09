import { useState } from "react";
import AiChat from "@/components/AiChat";
import { Bot, X } from "lucide-react";

export function AiChatButton() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* Chat Window */}
      {visible && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <AiChat />
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Close AI assistant" : "Open AI assistant"}
        className={`group inline-flex h-12 min-w-[138px] items-center justify-between gap-3 rounded-full border px-4 text-sm font-semibold shadow-lg transition-all active:scale-95 sm:h-14 sm:min-w-[170px] ${
          visible
            ? "border-slate-700 bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800 dark:border-slate-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <span className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-200 ${visible ? "rotate-90 bg-white/10" : "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"}`}>
          {visible ? <X className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </span>
        <span className="inline text-xs sm:text-sm"> Assistant</span>
        <span className={`h-2 w-2 rounded-full ${visible ? "bg-emerald-400" : "bg-slate-300 dark:bg-slate-600"}`} />
      </button>
    </div>
  );
}