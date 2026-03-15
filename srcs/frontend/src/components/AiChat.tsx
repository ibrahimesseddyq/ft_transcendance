import { useState, useEffect, useRef } from "react";
import { aiapi } from '@/utils/Api';

export default function AiChat() {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! Upload an audio clip and I'll transcribe it." }
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const env_ai_api = import.meta.env.VITE_AI_API_URL;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const startRecording = async () => {
    try {
      //Get access to the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      //Collect audio data as it comes in
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // recording stops
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToAI(audioBlob);
        
        //Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const sendAudioToAI = async (blob: Blob) => {
    setIsProcessing(true);
    
    const formData = new FormData();
    formData.append("audio", blob, "recording.mp3");

    try {
      const response = await aiapi.post(`${env_ai_api}/recognate`, formData);

      const data = response.data;
      console.log("data : ", data);
      if (data.text) {
        setInput(data.text);
      }
    } catch (err) {
      console.error("AI Reader Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");
  };

  return (
    <div className="flex flex-col z-50 w-full h-[450px] md:h-[500px] md:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border">
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
          {isRecording ? "■" : "🎤"}
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isProcessing ? "Processing..." : "Speak or type..."}
          className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm outline-none"
        />
        
        <button onClick={handleSend} className="bg-black text-white w-10 h-10 rounded-full">→</button>
      </div>
    </div>
  );
}