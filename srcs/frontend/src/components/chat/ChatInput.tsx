import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { CHAT_MESSAGE_MAX_LENGTH } from '../../types/chat';
import { mainService } from '@/utils/Api';

const MAX_RECORDING_SECONDS = 30;

const formatRecordingTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface SelectedFilePreviewProps {
  readonly selectedFile: File;
  readonly onClear: () => void;
}

function SelectedFilePreview({ selectedFile, onClear }: SelectedFilePreviewProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '6px 12px', background: '#e0f2fe', borderRadius: 6, fontSize: 13, color: '#1e293b', width: '100%', maxWidth: 576, boxSizing: 'border-box' }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00adef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
      </svg>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {selectedFile.name}
      </span>
      <button
        type="button"
        onClick={onClear}
        style={{ padding: 2, background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

interface ChatInputProps {
  readonly onSendMessage: (content: string) => void;
  readonly onSendFile: (file: File) => void;
  readonly onStartTyping: () => void;
  readonly onStopTyping: () => void;
  readonly disabled?: boolean;
}

export function ChatInput({
  onSendMessage,
  onSendFile,
  onStartTyping,
  onStopTyping,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const env_ai_api = import.meta.env.VITE_AI_API_URL;

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Auto-stop recording at MAX_RECORDING_SECONDS
  useEffect(() => {
    if (isRecording && recordingSeconds >= MAX_RECORDING_SECONDS) {
      stopRecording();
    }
  }, [isRecording, recordingSeconds]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setMessage(nextValue);

    if (nextValue.trim().length > CHAT_MESSAGE_MAX_LENGTH) {
      setValidationError(`Message must be ${CHAT_MESSAGE_MAX_LENGTH} characters or less`);
    } else {
      setValidationError('');
    }

    onStartTyping();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => onStopTyping(), 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onSendFile(selectedFile);
      setSelectedFile(null);
      setMessage('');
      setValidationError('');
    } else if (message.trim()) {
      const trimmed = message.trim();
      if (trimmed.length > CHAT_MESSAGE_MAX_LENGTH) {
        setValidationError(`Message must be ${CHAT_MESSAGE_MAX_LENGTH} characters or less`);
        return;
      }

      onSendMessage(trimmed);
      setMessage('');
      setValidationError('');
    }
    onStopTyping();
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const stopMediaTracks = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  };

  const resetRecordingState = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const pickRecordingMimeType = () => {
    const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
    return candidates.find((mimeType) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mimeType)) || '';
  };

  const sendAudioForTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.mp3');
      const response = await mainService.post(`${env_ai_api}/recognate`, formData);
      const data = response.data;
      if (data.text) {
        setMessage((prev) => (prev ? prev + ' ' + data.text : data.text));
      }
    } catch {
      toast.error('Failed to transcribe audio');
    } finally {
      setIsTranscribing(false);
    }
  };

  const startRecording = async () => {
    if (disabled || isRecording || isTranscribing) return;

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      toast.error('Audio recording is not supported in this browser');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickRecordingMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];
      setValidationError('');
      setIsRecording(true);
      setRecordingSeconds(0);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        if (recordedChunksRef.current.length > 0) {
          const chunkType = recordedChunksRef.current[0]?.type || recorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(recordedChunksRef.current, { type: chunkType });
          sendAudioForTranscription(audioBlob);
        }
        recordedChunksRef.current = [];
        resetRecordingState();
        stopMediaTracks();
      };

      recorder.start();
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds((current) => current + 1);
      }, 1000);
    } catch {
      toast.error('Microphone access is required to record audio');
      resetRecordingState();
      stopMediaTracks();
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      resetRecordingState();
      stopMediaTracks();
      return;
    }

    recorder.stop();
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const canSend = !disabled && !validationError && (!!message.trim() || !!selectedFile);
  const messageLength = message.trim().length;

  return (
    <div className="chat-input-area" style={{ background: '#F0F3FA', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      {/* File preview */}
      {selectedFile && (
        <SelectedFilePreview selectedFile={selectedFile} onClear={clearFile} />
      )}

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 576 }}>
        {/* Hidden file input */}


        {/* Input wrapper */}
        <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#ffffff', borderRadius: 20, padding: '10px 20px', border: '1px solid #e2e8f0', width: '100%', height: 64, boxSizing: 'border-box' }}>
          {/* Attach button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            style={{ padding: 6, background: 'transparent', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', transition: 'color 0.2s', opacity: disabled ? 0.6 : 1, flexShrink: 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>

          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled || isTranscribing}
            aria-label={isTranscribing ? 'Transcribing' : isRecording ? 'Stop recording' : 'Record audio'}
            style={{
              padding: 6,
              background: isRecording ? '#fee2e2' : isTranscribing ? '#e0f2fe' : 'transparent',
              border: 'none',
              cursor: (disabled || isTranscribing) ? 'not-allowed' : 'pointer',
              color: isRecording ? '#dc2626' : isTranscribing ? '#0ea5e9' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s, background 0.2s',
              opacity: disabled ? 0.6 : 1,
              flexShrink: 0,
              borderRadius: 999,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
              <line x1="8" y1="22" x2="16" y2="22"/>
            </svg>
          </button>

          {/* Text input */}
          <input
            className="message-text-input"
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isTranscribing ? 'Transcribing...' : isRecording ? 'Recording audio...' : 'Type a message...'}
            disabled={disabled}
            maxLength={CHAT_MESSAGE_MAX_LENGTH}
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, color: '#1e293b', outline: 'none', padding: '2px 0' }}
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={!canSend}
            style={{ padding: 10, background: canSend ? '#00adef' : '#cbd5e1', color: 'white', border: 'none', borderRadius: 8, cursor: canSend ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', flexShrink: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, padding: '0 4px', minHeight: 18 }}>
          <span style={{ fontSize: 12, color: validationError ? '#dc2626' : '#64748b' }}>
            {validationError || (isTranscribing ? 'Transcribing audio...' : isRecording ? `Recording... ${formatRecordingTime(recordingSeconds)} / ${formatRecordingTime(MAX_RECORDING_SECONDS)}` : '')}
          </span>
          <span style={{ fontSize: 12, color: messageLength > CHAT_MESSAGE_MAX_LENGTH ? '#dc2626' : '#64748b' }}>
            {messageLength}/{CHAT_MESSAGE_MAX_LENGTH}
          </span>
        </div>
      </form>
    </div>
  );
}

