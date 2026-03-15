import { useState } from "react";
import AiChat from "@/components/AiChat";

export function AiChatButton() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="fixed right-4 bottom-4 flex flex-col items-end gap-4">
      {/* Chat Window */}
      {visible && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <AiChat />
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setVisible(!visible)}
        className="h-12 w-12 bg-black hover:bg-gray-900 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-90 z-50"
      >
        {visible ? (
          <span className="text-xl font-light">✕</span>
        ) : (
          <span className="text-xs font-bold tracking-tighter">AI</span>
        )}
      </button>
    </div>
  );
}