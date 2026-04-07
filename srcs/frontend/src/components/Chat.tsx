import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { ChatSidebar } from './chat/ChatSidebar';
import { RHProfileSidebar } from './chat/RHProfileSidebar';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatInput } from './chat/ChatInput';
import {ToastContainer} from "react-toastify";
import { AiChatButton } from '@/components/ui/AiChatButton'
import { Loading } from './Loading';

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
    moderationAlert,
  } = useChat();

  const [chatOpen, setChatOpen] = useState(false);
  const [sidebarActive, setSidebarActive] = useState(false);
  const isAdminOrRecruiter = ["admin", "recruiter"].includes((user as any)?.role ?? "");
  const BACKEND_YRL = import.meta.env.VITE_SERVICE_URL;

  if (isLoading) {
    return (
      <div className="chat-loading-screen">
        <Loading />
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
    setChatOpen(true);
    setSidebarActive(false);
  };

  const handleBack = () => {
    setChatOpen(false);
    setSidebarActive(true);
  };

  const handleHamburger = () => {
    setSidebarActive(v => !v);
  };

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

  const recruiterName = recruiter
    ? `${recruiter.firstName || ''} ${recruiter.lastName || ''}`.trim() || 'Recruiter'
    : 'Loading...';
  const recruiterInitials = recruiter?.firstName && recruiter?.lastName
    ? (recruiter.firstName.charAt(0) + recruiter.lastName.charAt(0)).toUpperCase()
    : 'RH';
  const recruiterAvatarUrl = recruiter?.avatarUrl
    ? (recruiter.avatarUrl.startsWith('http') ? recruiter.avatarUrl : `${BACKEND_YRL}${recruiter.avatarUrl}`)
    : null;

  return (
    <div
      className={layoutClasses}
      style={{ height: 'calc(100vh - 120px)' }}
      onClick={handleLayoutClick}
    >
      <ToastContainer/>
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

      <main className="chat-main">
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

        <div className={`chat-empty-state${!currentConversation ? ' active' : ''}`}>
          <div className="chat-empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h2 className="chat-empty-title">Select a conversation</h2>
          <p className="chat-empty-description">Choose a conversation from the sidebar or start a new one.</p>
        </div>

        <div className={`chat-active${currentConversation ? ' active' : ''}`}>

          <div className="mobile-rh-header">
            <div className="mobile-rh-profile">
              <div className="mobile-rh-avatar">
                {recruiterAvatarUrl ? (
                  <img src={recruiterAvatarUrl} alt={recruiterName} className="mobile-rh-avatar-image" />
                ) : (
                  recruiterInitials
                )}
              </div>
              <div className="mobile-rh-meta">
                <span className="chat-header-name mobile-rh-name">{recruiterName}</span>
                <span className={`mobile-rh-status ${isOtherUserOnline ? 'online' : 'offline'}`}>
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
          <div className="chat-connection-banner">
            Reconnecting...
          </div>
        )}

        {moderationAlert && (
          <div className={`moderation-overlay ${moderationAlert.action === 'Block' ? 'block' : 'warn'}`}>
            <div className="moderation-icon">
              {moderationAlert.action === 'Block' ? '!' : '!!'}
            </div>
            <div className="moderation-title">
              {moderationAlert.action === 'Block' ? 'Message Blocked' : 'Warning'}
            </div>
            <div className="moderation-description">
              {moderationAlert.reason.length > 0
                ? `Reason: ${moderationAlert.reason.join(', ')}`
                : 'Your message was flagged by moderation.'}
            </div>
          </div>
        )}
        {!isAdminOrRecruiter && (
          <AiChatButton />
        )}
      </main>
    </div>
  );
}

