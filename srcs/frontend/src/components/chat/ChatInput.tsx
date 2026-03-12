import { useState, useRef } from 'react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onSendFile: (file: File) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
  disabled?: boolean;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
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
    } else if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      alert('File is too large (max 100 MB)');
      return;
    }
    setSelectedFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const canSend = !disabled && (!!message.trim() || !!selectedFile);

  return (
    <div className="chat-input-area" style={{ background: '#F0F3FA', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      {/* File preview */}
      {selectedFile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '6px 12px', background: '#e0f2fe', borderRadius: 6, fontSize: 13, color: '#1e293b', width: '100%', maxWidth: 576, boxSizing: 'border-box' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00adef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedFile.name}
          </span>
          <button
            type="button"
            onClick={clearFile}
            style={{ padding: 2, background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 576 }}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,application/pdf"
          onChange={handleFileSelect}
          disabled={disabled}
        />

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

          {/* Text input */}
          <input
            className="message-text-input"
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={disabled}
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
      </form>
    </div>
  );
}

