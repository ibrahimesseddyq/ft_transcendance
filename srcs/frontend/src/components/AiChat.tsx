import { useState, useEffect, useRef } from "react";
import { AudioLines } from 'lucide-react';
import { aiapi } from '@/utils/Api';

const SUGGESTIONS = [
  "How can i find job?",
  "What is the rules of a valid picture?",
  "How can i get the best job offer?"
];

export default function AiChat() {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const handleSuggestionClick = (suggestion: string) => {
    setMessages(prev => [...prev, { role: "user", content: suggestion }]);
    setShowSuggestions(false);
  };

  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! Upload an audio clip and I'll transcribe it." }
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const env_ai_api = import.meta.env.VITE_AI_API_URL;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

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
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const generateAiResponse = async (userText: string) => {
    setIsGenerating(true);
    try {
      const response = await aiapi.post(`${env_ai_api}/generate`, { 
        text: userText 
      });

      const aiText = response.data.result || response.data.text;
      setMessages(prev => [...prev, { role: "ai", content: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, I couldn't generate a response." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const sendAudioToAI = async (blob: Blob) => {
    setIsProcessing(true);
    
    const formData = new FormData();
    formData.append("audio", blob, "recording.mp3");

    try {
      const response = await aiapi.post(`${env_ai_api}/recognate`, formData);

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

  return (
    <div className="flex flex-col z-50 m-2 w-full md:w-80 h-[450px] md:h-[500px]  bg-white rounded-2xl shadow-2xl overflow-hidden border">
      <div className="bg-black p-4 text-white font-bold">AI Assistant</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === "user" ? "bg-black text-white" : "bg-white border text-gray-800"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {showSuggestions && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Example Questions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((text, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(text)}
                  className="text-left bg-white border border-gray-200 hover:border-pink-400 
                  hover:bg-pink-50 transition-colors px-4 py-2 rounded-xl text-sm text-gray-700 shadow-sm"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {isProcessing && <div className="text-xs italic text-gray-400">Transcribing audio...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white border-t flex items-center gap-2">
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isRecording ? "bg-red-500 animate-pulse text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          {isRecording ? "■" : <AudioLines/>}
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isProcessing ? "Processing..." : "Speak or type..."}
          className="flex-1 text-black bg-gray-100 border-none rounded-full px-4 py-2 text-sm outline-none"
        />
        
        <button onClick={handleSend} className="bg-black text-white w-10 h-10 rounded-full">→</button>
      </div>
    </div>
  );
}