import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { ChatSidebar } from './chat/ChatSidebar';
import { RHProfileSidebar } from './chat/RHProfileSidebar';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInput } from './chat/ChatInput';
import {ToastContainer} from "react-toastify";
import { AiChatButton } from '@/components/ui/AiChatButton'

import './chat/chat.css';

export function Chat() {
  const {
    user,
    conversations,
    currentConversation,
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    hasConnectedOnce,
    isLoading,
    isLoadingMessages,
    recruiter,
    isLoadingRecruiter,
    messagesEndRef,
    selectConversation,
    sendMessage,
    sendFile,
    startTyping,
    stopTyping,
    getOtherParticipant,
  } = useChat();

  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const isAdminOrRecruiter = ["admin", "recruiter"].includes((user as any)?.role ?? "");

  if (isLoading) {
    return (
      <div style={{ width: '100%', height: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F3FA' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid #00adef', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading chat...</p>
        </div>
      </div>
    );
  }

  const isCandidate = user?.role?.toLowerCase() === 'candidate';
  const otherParticipant = currentConversation ? getOtherParticipant(currentConversation) : null;

  let isOtherUserOnline = false;
  if (isCandidate && recruiter?.id) {
    isOtherUserOnline = onlineUsers.has(recruiter.id);
  } else if (otherParticipant?.userId) {
    isOtherUserOnline = onlineUsers.has(otherParticipant.userId);
  }

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    // Mark conversation as open → CSS slides sidebar away on mobile
    setChatOpen(true);
    setSidebarActive(false);
  };

  const handleBack = () => {
    // Remove chat-open → CSS slides sidebar back in on mobile
    setChatOpen(false);
    setSidebarActive(true);
  };

  const handleHamburger = () => {
    setSidebarActive(v => !v);
  };

  // Click on chat-layout backdrop on mobile closes sidebar
  const handleLayoutClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth <= 768 && sidebarActive) {
      const aside = (e.currentTarget as HTMLDivElement).querySelector('.sidebar');
      if (aside && !aside.contains(e.target as Node)) {
        setSidebarActive(false);
      }
    }
  };

  const layoutClasses = [
    'chat-layout',
    isCandidate ? 'candidate-view' : '',
    chatOpen ? 'chat-open' : '',
  ].filter(Boolean).join(' ');

  const sidebarClasses = [
    'sidebar',
    isCandidate ? 'rh-profile-sidebar' : '',
    sidebarActive ? 'active' : '',
  ].filter(Boolean).join(' ');

  // Recruiter helpers for mobile-rh-header
  const recruiterName = recruiter
    ? `${recruiter.firstName || ''} ${recruiter.lastName || ''}`.trim() || 'Recruiter'
    : 'Loading...';
  const recruiterInitials = recruiter?.firstName && recruiter?.lastName
    ? (recruiter.firstName.charAt(0) + recruiter.lastName.charAt(0)).toUpperCase()
    : 'RH';
  const recruiterAvatarUrl = recruiter?.avatarUrl
    ? (recruiter.avatarUrl.startsWith('http') ? recruiter.avatarUrl : `http://localhost:3000${recruiter.avatarUrl}`)
    : null;

  return (
    <div
      className={layoutClasses}
      style={{ height: 'calc(100vh - 120px)' }}
      onClick={handleLayoutClick}
    >
      <ToastContainer/>
      {/* ── Sidebar ───────────────────────────────────── */}
      <aside className={sidebarClasses}>
        {isCandidate ? (
          <RHProfileSidebar
            recruiter={recruiter}
            isOnline={isOtherUserOnline}
            isLoading={isLoadingRecruiter}
          />
        ) : (
          <ChatSidebar
            conversations={conversations}
            currentConversation={currentConversation}
            onlineUsers={onlineUsers}
            onSelectConversation={handleSelectConversation}
            getOtherParticipant={getOtherParticipant}
          />
        )}
      </aside>

      {/* ── Main chat area ────────────────────────────── */}
      <main className="chat-main">
        {/* Mobile top bar with hamburger (non-candidate mobile only — CSS controls display) */}
        {!isCandidate && (
          <div className="mobile-topbar">
            <button className="mobile-menu-toggle" onClick={handleHamburger} aria-label="Open sidebar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <span className="mobile-topbar-title">Messages</span>
          </div>
        )}

        {/* ── Empty state ────────────────────────────── */}
        <div className={`chat-empty-state${!currentConversation ? ' active' : ''}`}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e8ecf4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: '#94a3b8' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>Select a conversation</h2>
          <p style={{ fontSize: 14, color: '#64748b' }}>Choose a conversation from the sidebar or start a new one</p>
        </div>

        {/* ── Active chat ────────────────────────────── */}
        <div className={`chat-active${currentConversation ? ' active' : ''}`}>

          {/* Mobile RH header — candidate on mobile (CSS controls display) */}
          <div className="mobile-rh-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 6, background: '#e0f2fe', color: '#00adef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 16, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                {recruiterAvatarUrl ? (
                  <img src={recruiterAvatarUrl} alt={recruiterName} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                ) : (
                  recruiterInitials
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="chat-header-name" style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{recruiterName}</span>
                <span style={{ fontSize: 12, color: isOtherUserOnline ? '#10b981' : '#94a3b8' }}>
                  {isOtherUserOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          <ChatHeader
            conversation={currentConversation}
            otherParticipant={isCandidate ? { user: recruiter } : otherParticipant}
            isOnline={isOtherUserOnline}
            onBack={handleBack}
          />

          <ChatMessages
            messages={messages}
            currentUser={user}
            typingUsers={typingUsers}
            messagesEndRef={messagesEndRef}
            isLoading={isLoadingMessages}
          />

          <ChatInput
            onSendMessage={sendMessage}
            onSendFile={sendFile}
            onStartTyping={startTyping}
            onStopTyping={stopTyping}
            disabled={!isConnected}
          />
        </div>

        {hasConnectedOnce && !isConnected && (
          <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 200 }}>
            Reconnecting...
          </div>
        )}
        {!isAdminOrRecruiter && (
          <AiChatButton />
        )}
      </main>
    </div>
  );
}

