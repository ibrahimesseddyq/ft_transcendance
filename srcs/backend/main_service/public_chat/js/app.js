const ChatApp = {
    state: {
        user: null,
        conversations: [],
        currentConversation: null,
        messages: [],
        typingUsers: new Map(),
        onlineUsers: new Set()
    },
    elements: {},
    async init() {
        try {
            this.cacheElements();
            this.bindEvents();
            await this.initializeAuth();
        } catch (error) {
            this.showToast('Failed to initialize chat. Please refresh the page.', 'error');
        }
    },
    cacheElements() {
        this.elements = {
            loginScreen: document.getElementById('login-screen'),
            chatScreen: document.getElementById('chat-screen'),
            loginForm: document.getElementById('login-form'),
            userId: document.getElementById('user-id'),
            userRole: document.getElementById('user-role'),
            mainSidebar: document.getElementById('main-sidebar'),
            rhProfileSidebar: document.getElementById('rh-profile-sidebar'),
            normalSidebar: document.getElementById('normal-sidebar'),
            rhProfileAvatar: document.getElementById('rh-profile-avatar'),
            rhProfileImage: document.getElementById('rh-profile-image'),
            rhProfileInitials: document.getElementById('rh-profile-initials'),
            rhOnlineIndicator: document.getElementById('rh-online-indicator'),
            rhProfileStatus: document.getElementById('rh-profile-status'),
            rhProfileName: document.getElementById('rh-profile-name'),
            rhProfileEmail: document.getElementById('rh-profile-email'),
            rhProfileCompany: document.getElementById('rh-profile-company'),
            mobileRhHeader: document.getElementById('mobile-rh-header'),
            mobileRhAvatar: document.getElementById('mobile-rh-avatar'),
            mobileRhImage: document.getElementById('mobile-rh-image'),
            mobileRhInitials: document.getElementById('mobile-rh-initials'),
            mobileRhName: document.getElementById('mobile-rh-name'),
            mobileRhStatus: document.getElementById('mobile-rh-status'),
            userAvatar: document.getElementById('user-avatar'),
            userName: document.getElementById('user-name'),
            userRoleBadge: document.getElementById('user-role-badge'),
            logoutBtn: document.getElementById('logout-btn'),
            conversationsList: document.getElementById('conversations-list'),
            conversationSearch: document.getElementById('conversation-search'),
            chatLayout: document.querySelector('.chat-layout'),
            chatEmptyState: document.getElementById('chat-empty-state'),
            chatActive: document.getElementById('chat-active'),
            chatAvatar: document.getElementById('chat-avatar'),
            chatAvatarImage: document.getElementById('chat-avatar-image'),
            chatAvatarInitials: document.getElementById('chat-avatar-initials'),
            chatName: document.getElementById('chat-name'),
            chatStatus: document.getElementById('chat-status'),
            messagesContainer: document.getElementById('messages-container'),
            messagesList: document.getElementById('messages-list'),
            typingIndicator: document.getElementById('typing-indicator'),
            messageForm: document.getElementById('message-form'),
            messageInput: document.getElementById('message-input'),
            mobileBackBtn: document.getElementById('mobile-back-btn'),
            fileInput: document.getElementById('file-input'),
            attachBtn: document.getElementById('attach-btn'),
            filePreview: document.getElementById('file-preview'),
            filePreviewName: document.getElementById('file-preview-name'),
            removeFileBtn: document.getElementById('remove-file-btn'),
            mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
            modal: document.getElementById('new-conversation-modal'),
            modalClose: document.getElementById('modal-close'),
            newConversationForm: document.getElementById('new-conversation-form'),
            participantId: document.getElementById('participant-id'),
            participantRole: document.getElementById('participant-role'),
            toastContainer: document.getElementById('toast-container')
        };
    },
    bindEvents() {
        if (this.elements.loginForm) {
            this.elements.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        } else {
        }
        if (this.elements.logoutBtn) {
            this.elements.logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        if (this.elements.conversationSearch) {
            this.elements.conversationSearch.addEventListener('input', (e) => this.filterConversations(e.target.value));
        }
        if (this.elements.modalClose) {
            this.elements.modalClose.addEventListener('click', () => this.closeModal());
        }
        if (this.elements.modal) {
            const backdrop = this.elements.modal.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => this.closeModal());
            }
        }
        if (this.elements.newConversationForm) {
            this.elements.newConversationForm.addEventListener('submit', (e) => this.handleNewConversation(e));
        }
        if (this.elements.messageForm) {
            this.elements.messageForm.addEventListener('submit', (e) => this.handleSendMessage(e));
        }
        if (this.elements.attachBtn) {
            this.elements.attachBtn.addEventListener('click', () => this.elements.fileInput.click());
        }
        if (this.elements.fileInput) {
            this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }
        if (this.elements.removeFileBtn) {
            this.elements.removeFileBtn.addEventListener('click', () => this.clearFileSelection());
        }
        let typingTimeout;
        if (this.elements.messageInput) {
            this.elements.messageInput.addEventListener('input', () => {
                if (this.state.currentConversation) {
                    SocketService.startTyping(this.state.currentConversation.id);
                    clearTimeout(typingTimeout);
                    typingTimeout = setTimeout(() => {
                        SocketService.stopTyping(this.state.currentConversation.id);
                    }, 1000);
                }
            });
        }
        if (this.elements.mobileBackBtn) {
            this.elements.mobileBackBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.elements.chatLayout.classList.remove('chat-open');
                if (this.elements.mainSidebar) {
                    this.elements.mainSidebar.classList.add('active');
                }
            });
        }
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', () => {
                if (this.elements.mainSidebar) {
                    this.elements.mainSidebar.classList.toggle('active');
                }
            });
        }
        if (this.elements.chatLayout) {
            this.elements.chatLayout.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && 
                    this.elements.mainSidebar && 
                    this.elements.mainSidebar.classList.contains('active') &&
                    !this.elements.mainSidebar.contains(e.target) &&
                    !this.elements.mobileMenuToggle.contains(e.target)) {
                    this.elements.mainSidebar.classList.remove('active');
                }
            });
        }
        if (this.elements.messagesList) {
            this.elements.messagesList.addEventListener('click', (e) => {
                const img = e.target.closest('.attachment-image');
                if (img) {
                    this.openImageViewer(img.dataset.url);
                }
            });
        }
        const overlay = document.getElementById('image-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay || e.target.classList.contains('overlay-close')) {
                    this.closeImageViewer();
                }
            });
        }
        SocketService.on('onConnect', () => this.onSocketConnect());
        SocketService.on('onError', (error) => {
            this.showToast('Failed to connect to chat server', 'error');
        });
        SocketService.on('onNewMessage', (data) => this.onNewMessage(data));
        SocketService.on('onTypingUpdate', (data) => this.onTypingUpdate(data));
        SocketService.on('onUserOnline', (data) => this.onUserStatusChange(data.userId, true));
        SocketService.on('onUserOffline', (data) => this.onUserStatusChange(data.userId, false));
        SocketService.on('onNewConversation', (data) => this.onNewConversation(data));
        SocketService.on('onNotification', (data) => this.onNotification(data));
        SocketService.on('onOnlineUsers', (data) => this.onOnlineUsers(data));
    },
    async initializeAuth() {
        try {
            const response = await API.getCurrentUser();
            const user = response?.data?.user || response?.user || response?.data;
            if (!user) throw new Error('No user in response');
            this.state.user = user;
            await this.startChat();
        } catch (error) {
            this.elements.chatScreen.classList.remove('active');
            this.elements.loginScreen.classList.add('active');
            this.showToast('Please login to the main application first', 'error');
            if (this.elements.loginForm) {
                this.elements.loginForm.innerHTML = '<p style="text-align:center; padding:20px;">Please <a href="/" style="color: #3b82f6; text-decoration: underline;">login</a> to access chat.</p>';
            }
        }
    },
    async startChat() {
        const user = this.state.user;
        if (this.elements.userAvatar) {
            this.elements.userAvatar.textContent = (user.firstName || user.id || 'U').charAt(0).toUpperCase();
        }
        if (this.elements.userName) {
            this.elements.userName.textContent = user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.email || user.id;
        }
        if (this.elements.userRoleBadge) {
            this.elements.userRoleBadge.textContent = user.role;
        }
        this.setupSidebarForRole(user.role);
        this.elements.loginScreen.classList.remove('active');
        this.elements.chatScreen.classList.add('active');
        try {
            SocketService.connect(this.state.user, API.token);
        } catch (error) {
            this.showToast('Failed to connect to chat server', 'error');
        }
        if (user.role.toLowerCase() === 'candidate') {
            await this.loadRHProfile();
        }
        await this.loadConversations();
    },
    setupSidebarForRole(role) {
        const isCandidate = role.toLowerCase() === 'candidate';
        if (isCandidate) {
            this.elements.mainSidebar.classList.add('rh-profile-sidebar');
            this.elements.rhProfileSidebar.style.display = 'flex';
            this.elements.normalSidebar.style.display = 'none';
            this.elements.chatLayout.classList.add('candidate-view');
        } else {
            this.elements.mainSidebar.classList.remove('rh-profile-sidebar');
            this.elements.rhProfileSidebar.style.display = 'none';
            this.elements.normalSidebar.style.display = 'flex';
            this.elements.chatLayout.classList.remove('candidate-view');
        }
    },
    async loadRHProfile() {
        try {
            const rhUser = await API.getRecruiter();
            this.state.rhUser = rhUser;
            const initials = (rhUser.firstName.charAt(0) + rhUser.lastName.charAt(0)).toUpperCase();
            this.elements.rhProfileInitials.textContent = initials;
            if (rhUser.avatarUrl) {
                const avatarUrl = rhUser.avatarUrl.startsWith('http') 
                    ? rhUser.avatarUrl 
                    : `${API.baseUrl}${rhUser.avatarUrl}`;
                this.elements.rhProfileImage.src = avatarUrl;
                this.elements.rhProfileImage.style.display = 'block';
                this.elements.rhProfileInitials.style.display = 'none';
            } else {
                this.elements.rhProfileImage.style.display = 'none';
                this.elements.rhProfileInitials.style.display = 'flex';
            }
            this.elements.rhProfileName.textContent = `${rhUser.firstName} ${rhUser.lastName}`;
            this.elements.rhProfileEmail.textContent = rhUser.email || '';
            if (this.elements.mobileRhName) {
                this.elements.mobileRhName.textContent = `${rhUser.firstName} ${rhUser.lastName}`;
            }
            if (this.elements.mobileRhInitials) {
                this.elements.mobileRhInitials.textContent = initials;
            }
            if (rhUser.avatarUrl && this.elements.mobileRhImage) {
                const mobileAvatarUrl = rhUser.avatarUrl.startsWith('http')
                    ? rhUser.avatarUrl
                    : `${API.baseUrl}${rhUser.avatarUrl}`;
                this.elements.mobileRhImage.src = mobileAvatarUrl;
                this.elements.mobileRhImage.style.display = 'block';
                if (this.elements.mobileRhInitials) this.elements.mobileRhInitials.style.display = 'none';
            } else if (this.elements.mobileRhImage) {
                this.elements.mobileRhImage.style.display = 'none';
                if (this.elements.mobileRhInitials) this.elements.mobileRhInitials.style.display = 'flex';
            }
            const isRhOnline = this.state.onlineUsers.has(rhUser.id);
            const onlineIndicator = document.getElementById('rh-online-indicator');
            if (onlineIndicator) {
                if (isRhOnline) {
                    onlineIndicator.classList.remove('offline');
                    onlineIndicator.classList.add('online');
                    this.elements.rhProfileStatus.textContent = 'Online';
                    if (this.elements.mobileRhStatus) {
                        this.elements.mobileRhStatus.textContent = 'Online';
                        this.elements.mobileRhStatus.classList.add('online');
                    }
                    if (this.elements.mobileRhAvatar) {
                        this.elements.mobileRhAvatar.classList.add('online');
                        this.elements.mobileRhAvatar.classList.remove('offline');
                    }
                } else {
                    onlineIndicator.classList.remove('online');
                    onlineIndicator.classList.add('offline');
                    this.elements.rhProfileStatus.textContent = 'Offline';
                    if (this.elements.mobileRhStatus) {
                        this.elements.mobileRhStatus.textContent = 'Offline';
                        this.elements.mobileRhStatus.classList.remove('online');
                    }
                    if (this.elements.mobileRhAvatar) {
                        this.elements.mobileRhAvatar.classList.remove('online');
                        this.elements.mobileRhAvatar.classList.add('offline');
                    }
                }
            }
        } catch (error) {
            this.elements.rhProfileName.textContent = 'Recruiter';
            if (this.elements.mobileRhName) this.elements.mobileRhName.textContent = 'Recruiter';
            if (this.elements.mobileRhStatus) {
                this.elements.mobileRhStatus.textContent = 'Offline';
                this.elements.mobileRhStatus.classList.remove('online');
            }
            if (this.elements.mobileRhAvatar) {
                this.elements.mobileRhAvatar.classList.remove('online');
                this.elements.mobileRhAvatar.classList.add('offline');
            }
            this.showToast('Failed to load recruiter profile', 'error');
        }
    },
    handleLogout() {
        this.state.user = null;
        this.state.conversations = [];
        this.state.currentConversation = null;
        this.state.messages = [];
        SocketService.disconnect();
        API.user = null;
        API.token = null;
        window.location.href = '/';
    },
    async loadConversations() {
        const isCandidate = this.state.user.role.toLowerCase() === 'candidate';
        if (isCandidate) {
            try {
                const conversation = await API.createConversation();
                if (!conversation || !conversation.id) {
                    throw new Error('Invalid conversation response from API');
                }
                this.state.currentConversation = conversation;
                this.elements.chatEmptyState.classList.remove('active');
                this.elements.chatActive.classList.add('active');
                const rhName = this.state.rhUser 
                    ? `${this.state.rhUser.firstName} ${this.state.rhUser.lastName}`
                    : 'Recruiter';
                const rhInitials = this.state.rhUser
                    ? (this.state.rhUser.firstName.charAt(0) + this.state.rhUser.lastName.charAt(0)).toUpperCase()
                    : 'RH';
                this.elements.chatName.textContent = rhName;
                const rhAvatarUrl = this.state.rhUser?.avatarUrl
                    ? (this.state.rhUser.avatarUrl.startsWith('http') ? this.state.rhUser.avatarUrl : `${API.baseUrl}${this.state.rhUser.avatarUrl}`)
                    : null;
                if (rhAvatarUrl && this.elements.chatAvatarImage) {
                    this.elements.chatAvatarImage.src = rhAvatarUrl;
                    this.elements.chatAvatarImage.style.display = 'block';
                    if (this.elements.chatAvatarInitials) this.elements.chatAvatarInitials.style.display = 'none';
                } else {
                    if (this.elements.chatAvatarImage) this.elements.chatAvatarImage.style.display = 'none';
                    if (this.elements.chatAvatarInitials) {
                        this.elements.chatAvatarInitials.textContent = rhInitials;
                        this.elements.chatAvatarInitials.style.display = '';
                    } else {
                        this.elements.chatAvatar.textContent = rhInitials;
                    }
                }
                const isRhOnlineNow = this.state.rhUser ? this.state.onlineUsers.has(this.state.rhUser.id) : false;
                this.elements.chatStatus.textContent = isRhOnlineNow ? 'Online' : 'Offline';
                this.elements.chatAvatar.classList.toggle('online', isRhOnlineNow);
                this.elements.chatAvatar.classList.toggle('offline', !isRhOnlineNow);
                if (this.state.rhUser && this.elements.mobileRhName) {
                    this.elements.mobileRhName.textContent = rhName;
                }
                if (this.state.rhUser && this.elements.mobileRhInitials) {
                    this.elements.mobileRhInitials.textContent = rhInitials;
                }
                if (this.elements.mobileRhStatus) {
                    this.elements.mobileRhStatus.textContent = isRhOnlineNow ? 'Online' : 'Offline';
                    this.elements.mobileRhStatus.classList.toggle('online', isRhOnlineNow);
                }
                if (this.elements.mobileRhAvatar) {
                    this.elements.mobileRhAvatar.classList.toggle('online', isRhOnlineNow);
                    this.elements.mobileRhAvatar.classList.toggle('offline', !isRhOnlineNow);
                }
                if (SocketService.socket) {
                    SocketService.joinConversation(conversation.id);
                }
                await this.loadMessages(conversation.id);
            } catch (error) {
                this.showToast('Failed to initialize chat', 'error');
            }
            return;
        }
        try {
            const conversations = await API.getConversations();
            this.state.conversations = conversations;
            this.renderConversations();
            if (SocketService.socket) {
                conversations.forEach(conv => {
                    SocketService.joinConversation(conv.id);
                });
            } else {
            }
            if (conversations.length > 0) {
                await this.selectConversation(conversations[0].id);
            }
        } catch (error) {
            this.showToast('Failed to load conversations', 'error');
        }
    },
    renderConversations() {
        const { conversations } = this.state;
        if (conversations.length === 0) {
            this.elements.conversationsList.innerHTML = '<div class="empty-state"><p>No conversations yet</p></div>';
            return;
        }
        this.elements.conversationsList.innerHTML = conversations.map(conv => {
            const otherParticipant = this.getOtherParticipant(conv);
            const isActive = this.state.currentConversation?.id === conv.id;
            const lastMessage = conv.messages?.[0];
            const unreadCount = conv.unreadCount || 0;
            const participantName = otherParticipant.firstName && otherParticipant.lastName
                ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
                : otherParticipant.email || 'Unknown User';
            const participantInitials = otherParticipant.firstName && otherParticipant.lastName
                ? (otherParticipant.firstName.charAt(0) + otherParticipant.lastName.charAt(0)).toUpperCase()
                : (participantName.charAt(0) || '?').toUpperCase();
            const avatarUrl = otherParticipant.avatarUrl 
                ? (otherParticipant.avatarUrl.startsWith('http') ? otherParticipant.avatarUrl : `${API.baseUrl}${otherParticipant.avatarUrl}`)
                : null;
            const isOnline = this.state.onlineUsers.has(otherParticipant.id);
            const onlineClass = isOnline ? 'online' : 'offline';
            const avatarHtml = avatarUrl 
                ? `<div class="avatar ${onlineClass}"><img src="${avatarUrl}" alt="${participantName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;"></div>`
                : `<div class="avatar ${onlineClass}">${participantInitials}</div>`;
            return `
                <div class="conversation-item ${isActive ? 'active' : ''}" data-id="${conv.id}">
                    ${avatarHtml}
                    <div class="conversation-info">
                        <div class="conversation-name">${participantName}</div>
                        <div class="conversation-preview">
                            <span class="conversation-last-message">
                                ${lastMessage ? this.truncateText(lastMessage.content, 30) : 'No messages yet'}
                            </span>
                            <span class="conversation-time">
                                ${lastMessage ? this.formatTime(lastMessage.createdAt) : ''}
                            </span>
                        </div>
                    </div>
                    <div class="conversation-status">
                        <div class="status-indicator ${isOnline ? 'online' : 'offline'}"></div>
                        ${unreadCount > 0 ? `<div class="conversation-unread">${unreadCount}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        this.elements.conversationsList.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => this.selectConversation(item.dataset.id));
        });
    },
    filterConversations(query) {
        const normalizedQuery = query.toLowerCase().trim();
        const conversationItems = this.elements.conversationsList.querySelectorAll('.conversation-item');
        conversationItems.forEach(item => {
            const name = item.querySelector('.conversation-name')?.textContent.toLowerCase() || '';
            const preview = item.querySelector('.conversation-last-message')?.textContent.toLowerCase() || '';
            const matches = name.includes(normalizedQuery) || preview.includes(normalizedQuery);
            item.style.display = matches ? 'flex' : 'none';
        });
    },
    getOtherParticipant(conversation) {
        if (conversation.participants && Array.isArray(conversation.participants)) {
            const otherParticipant = conversation.participants.find(p => p.userId !== this.state.user.id);
            if (otherParticipant && otherParticipant.user) {
                return otherParticipant.user;
            }
        }
        if (conversation.otherParticipant) {
            return conversation.otherParticipant;
        }
        return { 
            id: 'unknown',
            firstName: 'Unknown',
            lastName: 'User'
        };
    },
    async selectConversation(conversationId) {
        const conversation = this.state.conversations.find(c => c.id === conversationId);
        if (!conversation) return;
        this.state.currentConversation = conversation;
        const otherParticipant = this.getOtherParticipant(conversation);
        const isOnline = this.state.onlineUsers.has(otherParticipant.id);
        const participantName = otherParticipant.firstName && otherParticipant.lastName
            ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
            : otherParticipant.email || 'Unknown User';
        const participantInitials = otherParticipant.firstName && otherParticipant.lastName
            ? (otherParticipant.firstName.charAt(0) + otherParticipant.lastName.charAt(0)).toUpperCase()
            : (participantName.charAt(0) || '?').toUpperCase();
        const avatarUrl = otherParticipant.avatarUrl
            ? (otherParticipant.avatarUrl.startsWith('http') ? otherParticipant.avatarUrl : `${API.baseUrl}${otherParticipant.avatarUrl}`)
            : null;
        if (avatarUrl && this.elements.chatAvatarImage) {
            this.elements.chatAvatarImage.src = avatarUrl;
            this.elements.chatAvatarImage.style.display = 'block';
            if (this.elements.chatAvatarInitials) this.elements.chatAvatarInitials.style.display = 'none';
        } else {
            if (this.elements.chatAvatarImage) this.elements.chatAvatarImage.style.display = 'none';
            if (this.elements.chatAvatarInitials) {
                this.elements.chatAvatarInitials.textContent = participantInitials;
                this.elements.chatAvatarInitials.style.display = '';
            } else {
                this.elements.chatAvatar.textContent = participantInitials;
            }
        }
        this.elements.chatAvatar.classList.toggle('online', isOnline);
        this.elements.chatAvatar.classList.toggle('offline', !isOnline);
        this.elements.chatName.textContent = participantName;
        this.elements.chatStatus.textContent = isOnline ? 'Online' : (otherParticipant.role || 'Offline');
        this.elements.chatStatus.classList.toggle('online', isOnline);
        this.elements.chatEmptyState.classList.remove('active');
        this.elements.chatActive.classList.add('active');
        this.elements.chatLayout.classList.add('chat-open');
        if (window.innerWidth <= 768 && this.elements.mainSidebar) {
            this.elements.mainSidebar.classList.remove('active');
        }
        this.renderConversations();
        SocketService.joinConversation(conversationId);
        await this.loadMessages(conversationId);
        SocketService.markAsRead(conversationId);
    },
    openModal() {
        this.elements.modal.classList.add('active');
    },
    closeModal() {
        this.elements.modal.classList.remove('active');
        this.elements.newConversationForm.reset();
    },
    async handleNewConversation(e) {
        e.preventDefault();
        const participantId = this.elements.participantId.value.trim();
        const participantRole = this.elements.participantRole.value;
        if (!participantId || !participantRole) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
        try {
            const conversation = await API.createConversation(participantId, participantRole);
            this.closeModal();
            if (!this.state.conversations.find(c => c.id === conversation.id)) {
                this.state.conversations.unshift(conversation);
            }
            this.renderConversations();
            this.selectConversation(conversation.id);
            this.showToast('Conversation created', 'success');
        } catch (error) {
            this.showToast(error.message || 'Failed to create conversation', 'error');
        }
    },
    async loadMessages(conversationId) {
        try {
            const messages = await API.getMessages(conversationId);
            this.state.messages = messages.reverse(); // Oldest first
            this.renderMessages();
            this.scrollToBottom();
        } catch (error) {
            this.showToast('Failed to load messages', 'error');
        }
    },
    renderMessages() {
        const { messages, user } = this.state;
        if (messages.length === 0) {
            this.elements.messagesList.innerHTML = `
                <div class="empty-state">
                    <p>No messages yet. Start the conversation!</p>
                </div>
            `;
            return;
        }
        this.elements.messagesList.innerHTML = messages.map(msg => {
            if (!msg || !msg.senderId) {
                return '';
            }
            const isSent = msg.senderId === user.id;
            const messageClass = msg.messageType === 'system' ? 'system' : (isSent ? 'sent' : 'received');
            const attachmentHtml = this.renderAttachments(msg);
            return `
                <div class="message ${messageClass}" data-id="${msg.id}">
                    <div class="message-content">
                        ${msg.isDeleted ? '<em>Message deleted</em>' : (attachmentHtml || this.escapeHtml(msg.content))}
                    </div>
                    <div class="message-meta">
                        <span>${this.formatTime(msg.createdAt)}</span>
                        ${msg.isEdited ? '<span>• edited</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');
    },
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
            if (file.size > 100 * 1024 * 1024) {
                this.showToast('File is too large (max 100 MB)', 'error');
                this.elements.fileInput.value = '';
                return;
        }
        this.elements.filePreview.style.display = 'flex';
        this.elements.filePreviewName.textContent = `📎 ${file.name} (${this.formatFileSize(file.size)})`;
    },
    clearFileSelection() {
        this.elements.fileInput.value = '';
        this.elements.filePreview.style.display = 'none';
        this.elements.filePreviewName.textContent = '';
    },
    async handleSendMessage(e) {
        e.preventDefault();
        const content = this.elements.messageInput.value.trim();
        const file = this.elements.fileInput.files[0];
        if (!content && !file) return;
        if (!this.state.currentConversation) {
            this.showToast('Please wait for chat to initialize', 'error');
            return;
        }
        const conversationId = this.state.currentConversation.id;
        this.elements.messageInput.value = '';
        if (SocketService.socket) {
            SocketService.stopTyping(conversationId);
        }
        try {
            let message;
            if (file) {
                message = await API.uploadFile(conversationId, file);
                this.clearFileSelection();
            } else {
                message = await API.sendMessage(conversationId, content);
            }
            if (message && !this.state.messages.find(m => m.id === message.id)) {
                this.state.messages.push(message);
                this.renderMessages();
                this.scrollToBottom();
            }
            this.updateConversationPreview(conversationId, message);
        } catch (error) {
            this.showToast('Failed to send message', 'error');
            if (!file) this.elements.messageInput.value = content;
        }
    },
    updateConversationPreview(conversationId, message) {
        const conversation = this.state.conversations.find(c => c.id === conversationId);
        if (conversation) {
            conversation.messages = [message];
            this.state.conversations = [
                conversation,
                ...this.state.conversations.filter(c => c.id !== conversationId)
            ];
            this.renderConversations();
        }
    },
    scrollToBottom() {
        this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
    },
    onSocketConnect() {
        if (SocketService.socket) {
            SocketService.socket.emit('user:getOnlineUsers', {}, (response) => {
                if (response && response.success) {
                    this.onOnlineUsers({ userIds: response.data });
                }
            });
        }
    },
    onOnlineUsers(data) {
        if (data.userIds && Array.isArray(data.userIds)) {
            this.state.onlineUsers.clear();
            data.userIds.forEach(userId => {
                this.state.onlineUsers.add(userId);
            });
            data.userIds.forEach(userId => {
                this.onUserStatusChange(userId, true);
            });
            if (this.state.user.role.toLowerCase() === 'candidate' && this.state.rhUser) {
                const isRhOnline = this.state.onlineUsers.has(this.state.rhUser.id);
                this.onUserStatusChange(this.state.rhUser.id, isRhOnline);
            }
            if (this.state.conversations.length > 0) {
                this.renderConversations();
            }
        }
    },
    onNewMessage(data) {
        const { message, conversationId } = data;
        const isRH = this.state.user.role.toLowerCase() === 'recruiter';
        if (isRH && !this.state.conversations.find(c => c.id === conversationId)) {
            this.loadConversations();
        }
        this.updateConversationPreview(conversationId, message);
        if (this.state.currentConversation?.id === conversationId) {
            if (!this.state.messages.find(m => m.id === message.id)) {
                this.state.messages.push(message);
                this.renderMessages();
                this.scrollToBottom();
                SocketService.markAsRead(conversationId);
            }
        }
    },
    onTypingUpdate(data) {
        const { conversationId, userId, isTyping } = data;
        if (this.state.currentConversation?.id === conversationId && userId !== this.state.user.id) {
            if (isTyping) {
                this.elements.typingIndicator.classList.add('active');
            } else {
                this.elements.typingIndicator.classList.remove('active');
            }
        }
    },
    onUserStatusChange(userId, isOnline) {
        if (isOnline) {
            this.state.onlineUsers.add(userId);
        } else {
            this.state.onlineUsers.delete(userId);
        }
        const isCandidate = this.state.user.role.toLowerCase() === 'candidate';
        if (isCandidate && this.elements.rhOnlineIndicator && this.state.rhUser) {
            if (userId === this.state.rhUser.id) {
                if (isOnline) {
                    this.elements.rhOnlineIndicator.classList.remove('offline');
                    this.elements.rhOnlineIndicator.classList.add('online');
                    this.elements.rhProfileStatus.textContent = 'Online';
                    if (this.elements.mobileRhStatus) {
                        this.elements.mobileRhStatus.textContent = 'Online';
                        this.elements.mobileRhStatus.classList.add('online');
                    }
                    if (this.elements.mobileRhAvatar) {
                        this.elements.mobileRhAvatar.classList.add('online');
                        this.elements.mobileRhAvatar.classList.remove('offline');
                    }
                } else {
                    this.elements.rhOnlineIndicator.classList.remove('online');
                    this.elements.rhOnlineIndicator.classList.add('offline');
                    this.elements.rhProfileStatus.textContent = 'Offline';
                    if (this.elements.mobileRhStatus) {
                        this.elements.mobileRhStatus.textContent = 'Offline';
                        this.elements.mobileRhStatus.classList.remove('online');
                    }
                    if (this.elements.mobileRhAvatar) {
                        this.elements.mobileRhAvatar.classList.remove('online');
                        this.elements.mobileRhAvatar.classList.add('offline');
                    }
                }
            }
        }
        this.updateConversationOnlineStatus(userId, isOnline);
        const conv = this.state.currentConversation;
        if (conv) {
            const otherParticipant = this.getOtherParticipant(conv);
            if (otherParticipant.id === userId) {
                this.elements.chatAvatar.classList.toggle('online', isOnline);
                this.elements.chatAvatar.classList.toggle('offline', !isOnline);
                this.elements.chatStatus.textContent = isOnline ? 'Online' : 'Offline';
                this.elements.chatStatus.classList.toggle('online', isOnline);
                if (isCandidate && this.elements.mobileRhStatus) {
                    this.elements.mobileRhStatus.textContent = isOnline ? 'Online' : 'Offline';
                    this.elements.mobileRhStatus.classList.toggle('online', isOnline);
                    if (this.elements.mobileRhAvatar) {
                        this.elements.mobileRhAvatar.classList.toggle('online', isOnline);
                        this.elements.mobileRhAvatar.classList.toggle('offline', !isOnline);
                    }
                }
            }
        }
    },
    updateConversationOnlineStatus(userId, isOnline) {
        const conversationItems = this.elements.conversationsList?.querySelectorAll('.conversation-item');
        if (!conversationItems) return;
        conversationItems.forEach(item => {
            const conv = this.state.conversations.find(c => c.id === item.dataset.id);
            if (conv) {
                const otherParticipant = this.getOtherParticipant(conv);
                if (otherParticipant.id === userId) {
                    const avatar = item.querySelector('.avatar');
                    if (avatar) {
                        avatar.classList.toggle('online', isOnline);
                        avatar.classList.toggle('offline', !isOnline);
                    }
                }
            }
        });
    },
    onNewConversation(data) {
        const { conversation } = data;
        if (!this.state.conversations.find(c => c.id === conversation.id)) {
            this.state.conversations.unshift(conversation);
            this.renderConversations();
        }
    },
    onNotification(data) {
        const { message, conversationId } = data;
        if (this.state.currentConversation?.id !== conversationId) {
            const conv = this.state.conversations.find(c => c.id === conversationId);
            if (conv) {
                const sender = this.getOtherParticipant(conv);
                this.showToast(`New message from ${sender.id}`, 'info');
            }
        }
    },
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-message">${message}</span>
            <button class="toast-close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
        this.elements.toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 5000);
    },
    formatTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    },
    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    renderAttachments(msg) {
        if (!msg.attachments || msg.attachments.length === 0) return '';
        return msg.attachments.map(att => {
            const mimeType = att.mimeType || '';
            const fileUrl = att.filePath.startsWith('http') ? att.filePath : `${API.baseUrl}${att.filePath}`;
            if (mimeType.startsWith('image/')) {
                return `<div class="message-attachment">
                    <img src="${fileUrl}" alt="${this.escapeHtml(att.fileName)}" loading="lazy"
                         class="attachment-image" data-url="${fileUrl}" onclick="ChatApp.openImageViewer('${fileUrl}')">
                </div>`;
            }
            if (mimeType.startsWith('video/')) {
                return `<div class="message-attachment">
                    <video controls preload="metadata" style="max-width: 100%; border-radius: 8px;">
                        <source src="${fileUrl}" type="${mimeType}">
                        Your browser does not support the video tag.
                    </video>
                </div>`;
            }
            const icon = mimeType === 'application/pdf' ? '📄' : '📁';
            return `<div class="message-attachment">
                <a href="${fileUrl}" class="file-link" target="_blank" download="${this.escapeHtml(att.fileName)}">
                    ${icon} ${this.escapeHtml(att.fileName)}
                    <span class="file-size">${this.formatFileSize(att.fileSize)}</span>
                </a>
            </div>`;
        }).join('');
    },
    openImageViewer(url) {
        const overlay = document.getElementById('image-overlay');
        const img = document.getElementById('overlay-image');
        if (overlay && img) {
            img.src = url;
            overlay.classList.add('active');
        }
    },
    closeImageViewer() {
        const overlay = document.getElementById('image-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.getElementById('overlay-image').src = '';
        }
    },
    formatFileSize(bytes) {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
};
document.addEventListener('DOMContentLoaded', () => {
    ChatApp.init();
});