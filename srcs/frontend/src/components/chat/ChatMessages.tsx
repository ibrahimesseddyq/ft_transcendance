import { Message, User } from '../../types/chat';

interface ChatMessagesProps {
  readonly messages: Message[];
  readonly currentUser: User | null;
  readonly typingUsers: Map<string, any>;
  readonly messagesEndRef: React.RefObject<HTMLDivElement | null>;
  readonly isLoading?: boolean;
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isImageFile = (mimeType?: string) => mimeType?.startsWith('image/');
const isVideoFile = (mimeType?: string) => mimeType?.startsWith('video/');
const isAudioFile = (mimeType?: string) => mimeType?.startsWith('audio/');

const buildFileUrl = (fileUrl?: string) => {
  const BACKEND_YRL = import.meta.env.VITE_SERVICE_URL;
  if (!fileUrl) return null;
  if (fileUrl.startsWith('http')) return fileUrl;
  return `${BACKEND_YRL}${fileUrl}`;
};

interface MediaAttachmentProps {
  readonly message: Message;
  readonly fileUrl: string;
}

function ImageAttachment({ message, fileUrl }: Readonly<MediaAttachmentProps>) {
  return (
    <div>
      <button
        type="button"
        onClick={() => window.open(fileUrl, '_blank', 'noopener,noreferrer')}
        style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
      >
        <img
          src={fileUrl}
          alt={message.fileName || 'Image'}
          style={{ maxWidth: 280, maxHeight: 240, borderRadius: 8, display: 'block', marginTop: 4 }}
        />
      </button>
      {message.content && <p style={{ marginTop: 8, fontSize: 14 }}>{message.content}</p>}
    </div>
  );
}

function VideoAttachment({ fileUrl }: Readonly<MediaAttachmentProps>) {
  return (
    <video
      src={fileUrl}
      controls
      style={{ maxWidth: 320, maxHeight: 240, borderRadius: 8, display: 'block', marginTop: 4 }}
    >
      <track kind="captions" />
    </video>
  );
}

function AudioAttachment({ message, fileUrl }: Readonly<MediaAttachmentProps>) {
  return (
    <div style={{ minWidth: 260, marginTop: 4 }}>
      <audio
        src={fileUrl}
        controls
        preload="metadata"
        style={{ width: '100%', display: 'block' }}
      >
        <track kind="captions" />
      </audio>
      {message.fileName && (
        <p style={{ margin: '8px 0 0', fontSize: 12, opacity: 0.8 }}>
          {message.fileName}
        </p>
      )}
    </div>
  );
}

interface FileAttachmentProps {
  readonly message: Message;
  readonly fileUrl: string;
  readonly isSent: boolean;
}

function FileAttachment({ message, fileUrl, isSent }: Readonly<FileAttachmentProps>) {
  return (
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
      {message.fileSize ? <span style={{ opacity: 0.7, fontSize: 11 }}>{formatFileSize(message.fileSize)}</span> : null}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    </a>
  );
}

interface AttachmentContentProps {
  readonly message: Message;
  readonly fileUrl: string;
  readonly isSent: boolean;
}

function AttachmentContent({ message, fileUrl, isSent }: Readonly<AttachmentContentProps>) {
  if (isImageFile(message.fileMimetype)) {
    return <ImageAttachment message={message} fileUrl={fileUrl} />;
  }

  if (isVideoFile(message.fileMimetype)) {
    return <VideoAttachment message={message} fileUrl={fileUrl} />;
  }

  if (isAudioFile(message.fileMimetype)) {
    return <AudioAttachment message={message} fileUrl={fileUrl} />;
  }

  return <FileAttachment message={message} fileUrl={fileUrl} isSent={isSent} />;
}

interface MessageRowProps {
  readonly message: Message;
  readonly currentUser: User | null;
}

function MessageRow({ message, currentUser }: Readonly<MessageRowProps>) {
  const isSent = message.senderId === currentUser?.id;
  const modAction = message.moderation?.action;

  if (message.messageType === 'system') {
    return (
      <div key={message.id} style={{ alignSelf: 'center', maxWidth: '80%' }}>
        <div style={{ background: '#e8ecf4', color: '#64748b', fontSize: 12, textAlign: 'center', padding: '8px 16px', borderRadius: 12 }}>
          {message.content}
        </div>
      </div>
    );
  }

  let contentStyle: React.CSSProperties;

  if (modAction === 'Block') {
    contentStyle = {
      background: '#fef2f2',
      color: '#991b1b',
      border: '2px solid #ef4444',
      borderRadius: 12,
      borderBottomRightRadius: 4,
      padding: '14px 18px',
      fontSize: 14,
      lineHeight: 1.6,
      wordBreak: 'break-word',
      maxWidth: 500,
    };
  } else if (modAction === 'Warn') {
    contentStyle = {
      background: '#fffbeb',
      color: '#92400e',
      border: '2px solid #f59e0b',
      borderRadius: 12,
      borderBottomRightRadius: isSent ? 4 : 12,
      borderBottomLeftRadius: isSent ? 12 : 4,
      padding: '14px 18px',
      fontSize: 14,
      lineHeight: 1.6,
      wordBreak: 'break-word',
      maxWidth: 500,
    };
  } else if (isSent) {
    contentStyle = {
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
  } else {
    contentStyle = {
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
  }

  const bubbleClass = (isSent || modAction === 'Block' || modAction === 'Warn') ? '' : 'received-bubble';
  const fileUrl = buildFileUrl(message.fileUrl);

  return (
    <div key={message.id} style={{ maxWidth: '65%', display: 'flex', flexDirection: 'column', alignSelf: isSent ? 'flex-end' : 'flex-start', alignItems: isSent ? 'flex-end' : 'flex-start' }}>
      <div className={bubbleClass} style={contentStyle}>
        {message.messageType === 'file' && fileUrl ? (
          <AttachmentContent message={message} fileUrl={fileUrl} isSent={isSent} />
        ) : (
          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.content}</p>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 11, color: '#94a3b8' }}>
        {modAction === 'Block' && (
          <span style={{ color: '#ef4444', fontWeight: 500 }}>Blocked</span>
        )}
        {modAction === 'Warn' && (
          <span style={{ color: '#f59e0b', fontWeight: 500 }}>Warning</span>
        )}
        {formatTime(message.createdAt)}
      </div>
    </div>
  );
}

export function ChatMessages({
  messages,
  currentUser,
  typingUsers,
  messagesEndRef,
  isLoading = false,
}: Readonly<ChatMessagesProps>) {
  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #00adef', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  } else if (messages.length === 0) {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#94a3b8', textAlign: 'center' }}>
        <p style={{ fontSize: 14 }}>No messages yet</p>
        <p style={{ fontSize: 13, marginTop: 8 }}>Send a message to start the conversation</p>
      </div>
    );
  } else {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((message) => (
          <MessageRow key={message.id} message={message} currentUser={currentUser} />
        ))}

        {typingUsers.size > 0 && (
          <div className="typing-indicator" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '10px 14px', background: '#ffffff', borderRadius: 12, borderBottomLeftRadius: 4, width: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginTop: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8', display: 'inline-block', animation: 'typing 1.4s infinite ease-in-out 0s' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8', display: 'inline-block', animation: 'typing 1.4s infinite ease-in-out 0.2s' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8', display: 'inline-block', animation: 'typing 1.4s infinite ease-in-out 0.4s' }} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    );
  }

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
      {content}
    </div>
  );
}

