import { Conversation } from '../../types/chat';

interface ChatHeaderProps {
  conversation: Conversation | null;
  otherParticipant: any;
  isOnline: boolean;
  onBack?: () => void;
}

export function ChatHeader({
  conversation,
  otherParticipant,
  isOnline,
  onBack,
}: ChatHeaderProps) {
  const BACKEND_YRL = import.meta.env.VITE_MAIN_SERVICE_URL;
  if (!conversation) return null;

  const getInitials = () => {
    const u = otherParticipant?.user;
    if (u?.firstName && u?.lastName)
      return (u.firstName.charAt(0) + u.lastName.charAt(0)).toUpperCase();
    if (u?.firstName) return u.firstName.charAt(0).toUpperCase();
    if (u?.email) return u.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getAvatarUrl = () => {
    const url = otherParticipant?.user?.avatarUrl;
    if (url) return url.startsWith('http') ? url : `${BACKEND_YRL}${url}`;
    return null;
  };

  const name =
    otherParticipant?.user?.firstName && otherParticipant?.user?.lastName
      ? `${otherParticipant.user.firstName} ${otherParticipant.user.lastName}`
      : otherParticipant?.user?.firstName || otherParticipant?.user?.email || 'Unknown User';

  const avatarUrl = getAvatarUrl();
  const initials = getInitials();

  return (
    <div className="chat-header">
      {/* Back button — CSS controls visibility (hidden on desktop, shown on mobile non-candidate) */}
      <button className="mobile-back-btn" onClick={onBack} aria-label="Back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      {/* Avatar */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 6,
            background: '#e0f2fe',
            color: '#00adef',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: 16,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6, position: 'absolute', top: 0, left: 0 }} />
          ) : (
            initials
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: isOnline ? '#10b981' : '#6b7280',
            border: '2px solid #ffffff',
            transition: 'background-color 0.3s',
          }}
        />
      </div>

      {/* Name & Status */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="chat-header-name" style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{name}</span>
        <span style={{ fontSize: 12, color: isOnline ? '#10b981' : '#94a3b8' }}>
          {isOnline ? 'Online' : otherParticipant?.user?.role || 'Offline'}
        </span>
      </div>
    </div>
  );
}


