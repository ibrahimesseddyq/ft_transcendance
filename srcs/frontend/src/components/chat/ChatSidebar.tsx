import { useState } from 'react';
import { Conversation } from '../../types/chat';

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onlineUsers: Set<string>;
  onSelectConversation: (conversationId: string) => void;
  getOtherParticipant: (conversation: Conversation) => any;
}

export function ChatSidebar({
  conversations,
  currentConversation,
  onlineUsers,
  onSelectConversation,
  getOtherParticipant,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conv) => {
    const p = getOtherParticipant(conv);
    const name = p?.user?.firstName
      ? `${p.user.firstName} ${p.user.lastName || ''}`.trim()
      : p?.user?.email || 'Unknown';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getParticipantName = (p: any) => {
    if (p?.user?.firstName && p?.user?.lastName)
      return `${p.user.firstName} ${p.user.lastName}`;
    if (p?.user?.firstName) return p.user.firstName;
    if (p?.user?.email) return p.user.email;
    return 'Unknown User';
  };

  const getInitials = (p: any) => {
    if (p?.user?.firstName && p?.user?.lastName)
      return (p.user.firstName.charAt(0) + p.user.lastName.charAt(0)).toUpperCase();
    if (p?.user?.firstName) return p.user.firstName.charAt(0).toUpperCase();
    if (p?.user?.email) return p.user.email.charAt(0).toUpperCase();
    return '?';
  };

  const getAvatarUrl = (p: any) => {
    const BACKEND_YRL = import.meta.env.VITE_MAIN_SERVICE_URL;
    if (p?.user?.avatarUrl) {
      return p.user.avatarUrl.startsWith('http')
        ? p.user.avatarUrl
        : `${BACKEND_YRL}${p.user.avatarUrl}`;
    }
    return null;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="normal-sidebar-content ">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 0', marginBottom: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', margin: 0 }}>Messages</h2>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16, position: 'relative', display: 'flex', alignItems: 'center' }}>
        <svg
          style={{ position: 'absolute', left: 12, color: '#94a3b8', pointerEvents: 'none' }}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="search-input"
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px 8px 36px',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 8,
            fontSize: 13,
            color: '#1e293b',
            background: '#ffffff',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Conversations List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {filteredConversations.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
            No conversations yet
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const p = getOtherParticipant(conversation);
            const isUserOnline = p?.userId ? onlineUsers.has(p.userId) : false;
            const avatarUrl = getAvatarUrl(p);
            const initials = getInitials(p);
            const name = getParticipantName(p);
            const isActive = currentConversation?.id === conversation.id;
            const lastMsg = conversation.lastMessage;
            const unread = conversation.unreadCount || 0;

            return (
              <div
                key={conversation.id}
                className="conv-item"
                onClick={() => onSelectConversation(conversation.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 8px',
                  cursor: 'pointer',
                  marginBottom: 8,
                  borderRadius: 8,
                  background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                {/* Avatar */}
                <div className="conv-avatar-wrap" style={{ position: 'relative', flexShrink: 0 }}>
                  <div
                    className="conv-avatar"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 6,
                      background: 'rgba(0,0,0,0.2)',
                      color: '#fff',
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
                      <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                    ) : (
                      initials
                    )}
                  </div>
                  {/* Online dot */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      border: '2px solid #018ABE',
                      background: isUserOnline ? '#10b981' : '#6b7280',
                      transition: 'background-color 0.3s',
                    }}
                  />
                </div>

                {/* Info */}
                <div className="conv-info" style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 }}>
                    {name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                      {lastMsg?.content || 'No messages yet'}
                    </span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                      {lastMsg ? formatTime(lastMsg.createdAt) : ''}
                    </span>
                  </div>
                </div>

                {/* Unread badge */}
                {unread > 0 && (
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#00adef', color: 'white', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {unread}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

