import { Message, User } from '../../types/chat';

interface ChatMessagesProps {
  messages: Message[];
  currentUser: User | null;
  typingUsers: Map<string, any>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isLoading?: boolean;
}

export function ChatMessages({
  messages,
  currentUser,
  typingUsers,
  messagesEndRef,
  isLoading = false,
}: ChatMessagesProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImageFile = (mimeType?: string) => mimeType?.startsWith('image/');
  const isVideoFile = (mimeType?: string) => mimeType?.startsWith('video/');

  const renderMessage = (message: Message) => {
    const isSent = message.senderId === currentUser?.id;

    if (message.messageType === 'system') {
      return (
        <div key={message.id} style={{ alignSelf: 'center', maxWidth: '80%' }}>
          <div style={{ background: '#e8ecf4', color: '#64748b', fontSize: 12, textAlign: 'center', padding: '8px 16px', borderRadius: 12 }}>
            {message.content}
          </div>
        </div>
      );
    }

    const sentStyle: React.CSSProperties = {
      background: '#0ea5e9',
      color: 'white',
      borderRadius: 12,
      borderBottomRightRadius: 4,
      padding: '14px 18px',
      fontSize: 14,
      lineHeight: 1.6,
      wordBreak: 'break-word',
      maxWidth: 500,
    };

    const receivedStyle: React.CSSProperties = {
      background: '#D6E8EE',
      color: '#333',
      borderRadius: 12,
      borderBottomLeftRadius: 4,
      padding: '14px 18px',
      fontSize: 14,
      lineHeight: 1.6,
      wordBreak: 'break-word',
      maxWidth: 500,
    };

    const contentStyle = isSent ? sentStyle : receivedStyle;
    const bubbleClass = isSent ? '' : 'received-bubble';
    if (message.messageType === 'file' && message.fileUrl) {
      const fileUrl = message.fileUrl.startsWith('http')
        ? message.fileUrl
        : `http://localhost:3000${message.fileUrl}`;

      return (
        <div key={message.id} style={{ maxWidth: '65%', display: 'flex', flexDirection: 'column', alignSelf: isSent ? 'flex-end' : 'flex-start', alignItems: isSent ? 'flex-end' : 'flex-start' }}>
          <div className={bubbleClass} style={contentStyle}>
            {isImageFile(message.fileMimetype) ? (
              <div>
                <img
                  src={fileUrl}
                  alt={message.fileName || 'Image'}
                  style={{ maxWidth: 280, maxHeight: 240, borderRadius: 8, cursor: 'pointer', display: 'block', marginTop: 4 }}
                  onClick={() => window.open(fileUrl, '_blank')}
                />
                {message.content && <p style={{ marginTop: 8, fontSize: 14 }}>{message.content}</p>}
              </div>
            ) : isVideoFile(message.fileMimetype) ? (
              <video
                src={fileUrl}
                controls
                style={{ maxWidth: 320, maxHeight: 240, borderRadius: 8, display: 'block', marginTop: 4 }}
              />
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', marginTop: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 8, color: isSent ? 'white' : '#00adef', textDecoration: 'none', fontSize: 13 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span style={{ flex: 1 }}>{message.fileName || 'File'}</span>
                {message.fileSize && <span style={{ opacity: 0.7, fontSize: 11 }}>{formatFileSize(message.fileSize)}</span>}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 11, color: '#94a3b8' }}>
            {formatTime(message.createdAt)}
          </div>
        </div>
      );
    }

    return (
      <div key={message.id} style={{ maxWidth: '65%', display: 'flex', flexDirection: 'column', alignSelf: isSent ? 'flex-end' : 'flex-start', alignItems: isSent ? 'flex-end' : 'flex-start' }}>
        <div className={bubbleClass} style={contentStyle}>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.content}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 11, color: '#94a3b8' }}>
          {formatTime(message.createdAt)}
        </div>
      </div>
    );
  };

  return (
    <div
      className="messages-container"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '30px 40px',
        display: 'flex',
        flexDirection: 'column',
        background: '#F0F3FA',
      }}
    >
      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <div style={{ width: 40, height: 40, border: '3px solid #00adef', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : messages.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#94a3b8', textAlign: 'center' }}>
          <p style={{ fontSize: 14 }}>No messages yet</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>Send a message to start the conversation</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map(renderMessage)}

          {/* Typing indicator */}
          {typingUsers.size > 0 && (
            <div className="typing-indicator" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 14px', background: '#ffffff', borderRadius: 12, borderBottomLeftRadius: 4, width: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginTop: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8', display: 'inline-block', animation: 'typing 1.4s infinite ease-in-out 0s' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8', display: 'inline-block', animation: 'typing 1.4s infinite ease-in-out 0.2s' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8', display: 'inline-block', animation: 'typing 1.4s infinite ease-in-out 0.4s' }} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}

