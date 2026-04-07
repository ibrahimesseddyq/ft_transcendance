import { useState, useEffect, KeyboardEvent, useRef } from "react";
import { AudioLines, Pause, SendHorizontal, Sparkles, CircleDot, Trash2 } from 'lucide-react';
import { Loading } from "./Loading";
import { mainService } from '@/utils/Api';
import MarkdownPreview  from '@/components/MarkDownPreview'

const SUGGESTIONS = [
  "How does the company hire?",
  "What does the company expect from candidates?",
  "Give me a quick overview of the company."
];

type ChatRole = "user" | "ai";
type ChatMessage = {
  role: ChatRole;
  content: string;
};

const CHAT_STORAGE_KEY = "ai-chat-messages-v1";
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "ai",
    content: "Hello, I am your hiring assistant. Ask me about the company, process, or role expectations."
  }
];

export default function AiChat() {
  const [showSuggestions, setShowSuggestions] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const env_ai_api = import.meta.env.VITE_AI_API_URL;
  const env_rag_api = import.meta.env.VITE_RAG_API_URL;



  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHAT_STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved) as ChatMessage[];
      const isValid = Array.isArray(parsed) && parsed.every(
        (msg) => (msg.role === "user" || msg.role === "ai") && typeof msg.content === "string"
      );

      if (isValid && parsed.length > 0) {
        setMessages(parsed);
        setShowSuggestions(false);
      }
    } catch {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInput("");
    setShowSuggestions(true);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToAI(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "ai",
          content: "I cannot access your microphone right now. Please check browser permissions and try again."
        }
      ]);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    };
  const generateAiResponse = async (userText: string) => {
  setIsGenerating(true);
  setMessages(prev => [...prev, { role: "ai", content: "" }]);

  let accumulated = "";

  try {
    await mainService.post(
      `${env_rag_api}/generate`,
      { text: userText },
      {
        responseType: "text",
        onDownloadProgress: (progressEvent) => {
          const raw = progressEvent.event?.target?.responseText ?? "";
          accumulated = raw;
          setMessages(prev => {
            const copy = [...prev];
            copy[copy.length - 1] = {
              ...copy[copy.length - 1],
              content: accumulated,
            };
            return copy;
          });
        },
      }
    );
  } catch {
    setMessages(prev => {
      const copy = [...prev];
      copy[copy.length - 1].content = "Sorry, I couldn't generate a response.";
      return copy;
    });
  } finally {
    setIsGenerating(false);
  }
};

  const sendAudioToAI = async (blob: Blob) => {
    setIsProcessing(true);
    
    const formData = new FormData();
    formData.append("audio", blob, "recording.mp3");

    try {
      const response = await mainService.post(`${env_ai_api}/recognate`, formData);

      const data = response.data;
      if (data.text) {
        setInput(data.text);
      }
    } catch {
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSend = async () => {
    const textToSend = input.trim();
    if (!textToSend || isGenerating) return;

    setMessages(prev => [...prev, { role: "user", content: textToSend }]);
    setInput("");
    setShowSuggestions(false);

    await generateAiResponse(textToSend);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="flex flex-col z-50 m-2 w-full md:w-80 h-[450px] md:h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
      <div className="bg-gradient-to-r from-[#0ea5e9] via-[#0284c7] to-[#0369a1] p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold leading-tight">AI Assistant</h2>
              <p className="text-[11px] text-white/85">Professional hiring support</p>
            </div>
          </div>
          <div className="flex gap-2 group">
            <button
              onClick={clearChat}
              disabled={isGenerating || isProcessing || isRecording}
              className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] text-white hover:bg-white/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Clear chat"
              >
              <span className="group-hover:text-red-600">Clear</span>
            </button>
            <div className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[11px]">
              <CircleDot className="w-3 h-3" />
              <span>{isGenerating ? "Responding" : isProcessing ? "Listening" : "Online"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[86%] p-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${
              msg.role === "user"
                ? "bg-[#0284c7] text-white rounded-br-md"
                : "bg-white border border-slate-200 text-slate-800 rounded-bl-md dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
            }`}>
              <MarkdownPreview text={msg.content}/>
            </div>
          </div>
        ))}

        {showSuggestions && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Suggested Questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(text)}
                  className="text-left bg-white border border-slate-200 hover:border-[#0ea5e9]
                  hover:bg-sky-50 transition-colors px-4 py-2 rounded-xl text-sm text-slate-700 shadow-sm
                  dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {(isGenerating || isProcessing) && (
          <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3 py-2 w-fit text-xs text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
            <div className="h-5 w-5"><Loading/></div>
            <span>{isGenerating ? "Generating response..." : "Processing audio..."}</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
          disabled={isProcessing || isGenerating}
          className={`w-9 h-9 rounded-full flex text-sm text-center items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isRecording
              ? "bg-red-500 animate-pulse text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {isRecording ? <Pause className="w-5 h-5"/> : <AudioLines className="w-5 h-5"/>}
        </button>
        
        <input
          type="text"
          ref={inputRef}
          value={input}
          maxLength={200}
          onKeyDown={handleKeyDown}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isProcessing ? "Processing..." : "Speak or type..."}
          className="text-black bg-slate-100 border border-slate-200 rounded-full flex-1
            px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-300
            dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400"
        />
        
        <button
          onClick={handleSend}
          disabled={!input.trim() || isGenerating}
          aria-label="Send message"
          className="bg-[#0284c7] text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#0369a1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}