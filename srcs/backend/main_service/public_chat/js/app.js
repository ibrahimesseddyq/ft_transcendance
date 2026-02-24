/**
 * =====================================================
 * CHAT APPLICATION - MAIN CONTROLLER
 * =====================================================
 * 
 * This is the main application file that:
 * - Manages application state
 * - Handles user interactions
 * - Coordinates between API and Socket services
 * - Updates the UI
 */

const ChatApp = {
    // ============================================
    // APPLICATION STATE
    // ============================================
    state: {
        user: null,
        conversations: [],
        currentConversation: null,
        messages: [],
        typingUsers: new Map(),
        onlineUsers: new Set()
    },

    // ============================================
    // DOM ELEMENTS
    // ============================================
    elements: {},

    /**
     * Initialize the application
     */
    async init() {
        console.log('ChatApp initializing...');
        try {
            this.cacheElements();
            this.bindEvents();
            await this.initializeAuth();
            console.log('ChatApp initialized successfully');
        } catch (error) {
            console.error('ChatApp initialization error:', error);
            this.showToast('Failed to initialize chat. Please refresh the page.', 'error');
        }
    },

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        this.elements = {
            // Screens
            loginScreen: document.getElementById('login-screen'),
            chatScreen: document.getElementById('chat-screen'),
            
            // Login
            loginForm: document.getElementById('login-form'),
            userId: document.getElementById('user-id'),
            userRole: document.getElementById('user-role'),
            
            // Sidebars
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
            
            // Mobile RH Header (for candidates)
            mobileRhHeader: document.getElementById('mobile-rh-header'),
            mobileRhAvatar: document.getElementById('mobile-rh-avatar'),
            mobileRhImage: document.getElementById('mobile-rh-image'),
            mobileRhInitials: document.getElementById('mobile-rh-initials'),
            mobileRhName: document.getElementById('mobile-rh-name'),
            mobileRhStatus: document.getElementById('mobile-rh-status'),
            
            // User info
            userAvatar: document.getElementById('user-avatar'),
            userName: document.getElementById('user-name'),
            userRoleBadge: document.getElementById('user-role-badge'),
            logoutBtn: document.getElementById('logout-btn'),
            
            // Conversations
            conversationsList: document.getElementById('conversations-list'),
            newConversationBtn: document.getElementById('new-conversation-btn'),
            
            // Chat area
            chatLayout: document.querySelector('.chat-layout'),
            chatEmptyState: document.getElementById('chat-empty-state'),
            chatActive: document.getElementById('chat-active'),
            chatAvatar: document.getElementById('chat-avatar'),
            chatName: document.getElementById('chat-name'),
            chatStatus: document.getElementById('chat-status'),
            messagesContainer: document.getElementById('messages-container'),
            messagesList: document.getElementById('messages-list'),
            typingIndicator: document.getElementById('typing-indicator'),
            messageForm: document.getElementById('message-form'),
            messageInput: document.getElementById('message-input'),
            mobileBackBtn: document.getElementById('mobile-back-btn'),
            
            // File upload
            fileInput: document.getElementById('file-input'),
            attachBtn: document.getElementById('attach-btn'),
            filePreview: document.getElementById('file-preview'),
            filePreviewName: document.getElementById('file-preview-name'),
            removeFileBtn: document.getElementById('remove-file-btn'),
            
            // Mobile
            mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
            
            // Modal
            modal: document.getElementById('new-conversation-modal'),
            modalClose: document.getElementById('modal-close'),
            newConversationForm: document.getElementById('new-conversation-form'),
            participantId: document.getElementById('participant-id'),
            participantRole: document.getElementById('participant-role'),
            
            // Toast
            toastContainer: document.getElementById('toast-container')
        };
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Login
        if (this.elements.loginForm) {
            this.elements.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            console.log('Login form event bound');
        } else {
            console.error('Login form not found!');
        }
        
        // Logout
        if (this.elements.logoutBtn) {
            this.elements.logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // New conversation
        if (this.elements.newConversationBtn) {
            this.elements.newConversationBtn.addEventListener('click', () => this.openModal());
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
        
        // Message form
        if (this.elements.messageForm) {
            this.elements.messageForm.addEventListener('submit', (e) => this.handleSendMessage(e));
        }

        // File attach button
        if (this.elements.attachBtn) {
            this.elements.attachBtn.addEventListener('click', () => this.elements.fileInput.click());
        }
        if (this.elements.fileInput) {
            this.elements.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }
        if (this.elements.removeFileBtn) {
            this.elements.removeFileBtn.addEventListener('click', () => this.clearFileSelection());
        }
        
        // Typing indicator
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
        
        // Mobile back button
        if (this.elements.mobileBackBtn) {
            this.elements.mobileBackBtn.addEventListener('click', () => {
                this.elements.chatLayout.classList.remove('chat-open');
                if (this.elements.mainSidebar) {
                    this.elements.mainSidebar.classList.remove('active');
                }
            });
        }

        // Mobile menu toggle
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', () => {
                if (this.elements.mainSidebar) {
                    this.elements.mainSidebar.classList.toggle('active');
                }
            });
        }

        // Close sidebar when clicking outside on mobile
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

        // Image viewer — event delegation on messages list
        if (this.elements.messagesList) {
            this.elements.messagesList.addEventListener('click', (e) => {
                const img = e.target.closest('.attachment-image');
                if (img) {
                    this.openImageViewer(img.dataset.url);
                }
            });
        }

        // Close lightbox
        const overlay = document.getElementById('image-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay || e.target.classList.contains('overlay-close')) {
                    this.closeImageViewer();
                }
            });
        }

        // Socket events
        SocketService.on('onConnect', () => this.onSocketConnect());
        SocketService.on('onError', (error) => {
            console.error('Socket error:', error);
            this.showToast('Failed to connect to chat server', 'error');
        });
        SocketService.on('onNewMessage', (data) => this.onNewMessage(data));
        SocketService.on('onTypingUpdate', (data) => this.onTypingUpdate(data));
        SocketService.on('onUserOnline', (data) => this.onUserStatusChange(data.userId, true));
        SocketService.on('onUserOffline', (data) => this.onUserStatusChange(data.userId, false));
        SocketService.on('onNewConversation', (data) => this.onNewConversation(data));
        SocketService.on('onNotification', (data) => this.onNotification(data));
    },

    // ============================================
    // AUTHENTICATION
    // ============================================

    /**
     * Initialize authentication from existing session
     */
    async initializeAuth() {
        let token = null;
        let userData = null;

        // Listen for postMessage from parent window
        const messagePromise = new Promise((resolve) => {
            const messageHandler = (event) => {
                // Security: verify origin in production
                if (event.data && event.data.type === 'AUTH_TOKEN') {
                    window.removeEventListener('message', messageHandler);
                    resolve({
                        token: event.data.token,
                        user: event.data.user
                    });
                }
            };
            window.addEventListener('message', messageHandler);
            
            // Timeout after 2 seconds
            setTimeout(() => {
                window.removeEventListener('message', messageHandler);
                resolve(null);
            }, 2000);
        });

        // Try to get auth from postMessage first
        const messageData = await messagePromise;
        if (messageData && messageData.token) {
            token = messageData.token;
            userData = messageData.user;
        }

        // Fallback to sessionStorage/localStorage
        if (!token) {
            token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
            const storedUser = sessionStorage.getItem('authUser');
            if (storedUser) {
                try {
                    userData = JSON.parse(storedUser);
                } catch (e) {
                    console.warn('Failed to parse stored user data');
                }
            }
        }

        // If running in iframe, try parent storage
        if (!token && window.parent !== window) {
            try {
                token = window.parent.sessionStorage?.getItem('authToken') || 
                       window.parent.localStorage?.getItem('authToken');
                const parentUser = window.parent.sessionStorage?.getItem('authUser');
                if (parentUser && !userData) {
                    userData = JSON.parse(parentUser);
                }
            } catch (e) {
                console.warn('Cannot access parent storage (CORS):', e.message);
            }
        }
        
        if (!token) {
            // Hide chat screen, show error
            this.elements.chatScreen.classList.remove('active');
            this.elements.loginScreen.classList.add('active');
            this.showToast('Please login to the main application first', 'error');
            if (this.elements.loginForm) {
                this.elements.loginForm.innerHTML = '<p style="text-align:center; padding:20px;">Please <a href="/" style="color: #3b82f6; text-decoration: underline;">login</a> to access chat.</p>';
            }
            return;
        }
        
        // Set token for API requests
        API.setToken(token);
        
        // Get current user info from backend if we don't have it from parent
        try {
            if (userData) {
                // Use data from parent window
                this.state.user = userData;
                await this.startChat();
            } else {
                // Fetch from API
                const response = await API.getCurrentUser();
                this.state.user = response.data.user || response.user || response.data;
                await this.startChat();
            }
        } catch (error) {
            console.error('Failed to get user info:', error);
            this.elements.chatScreen.classList.remove('active');
            this.elements.loginScreen.classList.add('active');
            this.showToast('Authentication failed. Please login again.', 'error');
            if (this.elements.loginForm) {
                this.elements.loginForm.innerHTML = '<p style="text-align:center; padding:20px;">Authentication failed. Please <a href="/" style="color: #3b82f6; text-decoration: underline;">login</a> again.</p>';
            }
        }
    },



    /**
     * Start chat session with authenticated user
     */
    async startChat() {
        const user = this.state.user;
        
        // Update UI with user info
        this.elements.userAvatar.textContent = (user.firstName || user.id || 'U').charAt(0).toUpperCase();
        this.elements.userName.textContent = user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.email || user.id;
        this.elements.userRoleBadge.textContent = user.role;
        
        // Show appropriate sidebar based on role
        this.setupSidebarForRole(user.role);
        
        // Hide login screen, show chat
        this.elements.loginScreen.classList.remove('active');
        this.elements.chatScreen.classList.add('active');
        
        // Connect to socket with JWT token
        try {
            SocketService.connect(this.state.user, API.token);
        } catch (error) {
            console.error('Socket connection error:', error);
            this.showToast('Failed to connect to chat server', 'error');
        }
        
        // Load conversations
        await this.loadConversations();
    },

    /**
     * Setup sidebar UI based on user role
     * - Candidates see RH profile sidebar
     * - RH/Admin see normal conversation list sidebar
     */
    setupSidebarForRole(role) {
        const isCandidate = role.toLowerCase() === 'candidate';
        
        if (isCandidate) {
            // Show RH profile sidebar for candidates
            this.elements.mainSidebar.classList.add('rh-profile-sidebar');
            this.elements.rhProfileSidebar.style.display = 'flex';
            this.elements.normalSidebar.style.display = 'none';
            
            // Add candidate-view class to chat layout for mobile styling
            this.elements.chatLayout.classList.add('candidate-view');
            
            // Fetch and display RH info
            this.loadRHProfile();
        } else {
            // Show normal sidebar for RH/Admin
            this.elements.mainSidebar.classList.remove('rh-profile-sidebar');
            this.elements.rhProfileSidebar.style.display = 'none';
            this.elements.normalSidebar.style.display = 'flex';
            this.elements.chatLayout.classList.remove('candidate-view');
        }
    },

    /**
     * Load and display RH profile information
     */
    async loadRHProfile() {
        try {
            // TODO: Get actual RH info from API
            // For now, use placeholder data
            const rhUser = {
                firstName: 'ABDELMAJID',
                lastName: 'ACHALLAH',
                email: 'recruiter@company.com',
                company: 'Company Inc.',
                profilePicture: null, // URL if available
                isOnline: true
            };

            // Store RH info in state for later use
            this.state.rhUser = rhUser;

            // Update RH profile UI (desktop sidebar)
            const initials = (rhUser.firstName.charAt(0) + rhUser.lastName.charAt(0)).toUpperCase();
            this.elements.rhProfileInitials.textContent = initials;
            
            if (rhUser.profilePicture) {
                this.elements.rhProfileImage.src = rhUser.profilePicture;
                this.elements.rhProfileImage.style.display = 'block';
                this.elements.rhProfileInitials.style.display = 'none';
            }
            
            this.elements.rhProfileName.innerHTML = `${rhUser.firstName}<br>${rhUser.lastName}`;
            this.elements.rhProfileCompany.childNodes[2].textContent = "Company's HR";
            
            // Update online indicator and status
            if (rhUser.isOnline) {
                this.elements.rhOnlineIndicator.classList.remove('offline');
                this.elements.rhProfileStatus.textContent = 'Online';
            } else {
                this.elements.rhOnlineIndicator.classList.add('offline');
                this.elements.rhProfileStatus.textContent = 'Offline';
            }

            // Update mobile RH header
            this.elements.mobileRhInitials.textContent = initials;
            if (rhUser.profilePicture) {
                this.elements.mobileRhImage.src = rhUser.profilePicture;
                this.elements.mobileRhImage.style.display = 'block';
            }
            this.elements.mobileRhName.textContent = `${rhUser.firstName} ${rhUser.lastName}`;
            this.elements.mobileRhStatus.textContent = rhUser.isOnline ? 'Online' : 'Offline';
        } catch (error) {
            console.error('Failed to load RH profile:', error);
        }
    },

    /**
     * Handle logout
     */
    handleLogout() {
        // Clear state
        this.state.user = null;
        this.state.conversations = [];
        this.state.currentConversation = null;
        this.state.messages = [];
        
        // Disconnect socket
        SocketService.disconnect();
        
        // Clear tokens
        API.user = null;
        API.token = null;
        
        // Redirect to main app
        window.location.href = '/';
    },

    // ============================================
    // CONVERSATIONS
    // ============================================

    /**
     * Load user's conversations
     */
    async loadConversations() {
        const isCandidate = this.state.user.role.toLowerCase() === 'candidate';
        
        if (isCandidate) {
            // For candidates, no need to fetch conversations
            // They chat directly with RH - show chat interface immediately
            console.log('[Chat] Candidate view - showing direct RH chat interface');
            this.elements.chatEmptyState.classList.remove('active');
            this.elements.chatActive.classList.add('active');
            
            // Use RH name from state if available
            const rhName = this.state.rhUser 
                ? `${this.state.rhUser.firstName} ${this.state.rhUser.lastName}`
                : 'Recruiter';
            const rhInitials = this.state.rhUser
                ? (this.state.rhUser.firstName.charAt(0) + this.state.rhUser.lastName.charAt(0)).toUpperCase()
                : 'RH';
            
            // Set up RH as the chat partner
            this.elements.chatName.textContent = rhName;
            this.elements.chatStatus.textContent = 'Online';
            this.elements.chatAvatar.textContent = rhInitials;
            
            // Initialize empty messages
            this.state.messages = [];
            this.renderMessages();
            return;
        }
        
        // For RH/Admin, fetch and display conversation list
        try {
            const conversations = await API.getConversations();
            this.state.conversations = conversations;
            this.renderConversations();
        } catch (error) {
            console.error('Failed to load conversations:', error);
            this.showToast('Failed to load conversations', 'error');
        }
    },

    /**
     * Render conversations list
     */
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
            
            return `
                <div class="conversation-item ${isActive ? 'active' : ''}" data-id="${conv.id}">
                    <div class="avatar">${(otherParticipant.id || '?').charAt(0).toUpperCase()}</div>
                    <div class="conversation-info">
                        <div class="conversation-name">${otherParticipant.id || 'Unknown'}</div>
                        <div class="conversation-preview">
                            <span class="conversation-last-message">
                                ${lastMessage ? this.truncateText(lastMessage.content, 30) : 'No messages yet'}
                            </span>
                            <span class="conversation-time">
                                ${lastMessage ? this.formatTime(lastMessage.createdAt) : ''}
                            </span>
                        </div>
                    </div>
                    ${unreadCount > 0 ? `<div class="conversation-unread">${unreadCount}</div>` : ''}
                </div>
            `;
        }).join('');

        // Add click handlers
        this.elements.conversationsList.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => this.selectConversation(item.dataset.id));
        });
    },

    /**
     * Get the other participant in a conversation
     */
    getOtherParticipant(conversation) {
        // If the conversation includes populated participant relations (from User model)
        if (conversation.participant1 && conversation.participant2) {
            if (conversation.participant1Id === this.state.user.id) {
                return conversation.participant2;
            }
            return conversation.participant1;
        }
        // Fallback: if otherParticipant is already computed by the API
        if (conversation.otherParticipant) {
            return conversation.otherParticipant;
        }
        // Minimal fallback
        if (conversation.participant1Id === this.state.user.id) {
            return { id: conversation.participant2Id };
        }
        return { id: conversation.participant1Id };
    },

    /**
     * Select a conversation
     */
    async selectConversation(conversationId) {
        const conversation = this.state.conversations.find(c => c.id === conversationId);
        if (!conversation) return;

        this.state.currentConversation = conversation;
        
        // Update UI
        this.elements.chatEmptyState.classList.remove('active');
        this.elements.chatActive.classList.add('active');
        this.elements.chatLayout.classList.add('chat-open');
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768 && this.elements.mainSidebar) {
            this.elements.mainSidebar.classList.remove('active');
        }
        
        // Update header
        const otherParticipant = this.getOtherParticipant(conversation);
        const isOnline = this.state.onlineUsers.has(otherParticipant.id);
        this.elements.chatAvatar.textContent = (otherParticipant.id || '?').charAt(0).toUpperCase();
        this.elements.chatAvatar.classList.toggle('online', isOnline);
        this.elements.chatName.textContent = otherParticipant.id || 'Unknown';
        this.elements.chatStatus.textContent = isOnline ? 'Online' : (otherParticipant.role || 'Offline');
        this.elements.chatStatus.classList.toggle('online', isOnline);
        
        // Highlight active conversation
        this.renderConversations();
        
        // Join the conversation room for real-time updates
        SocketService.joinConversation(conversationId);
        
        // Load messages
        await this.loadMessages(conversationId);
        
        // Mark as read
        SocketService.markAsRead(conversationId);
    },

    /**
     * Open new conversation modal
     */
    openModal() {
        this.elements.modal.classList.add('active');
    },

    /**
     * Close modal
     */
    closeModal() {
        this.elements.modal.classList.remove('active');
        this.elements.newConversationForm.reset();
    },

    /**
     * Handle new conversation form submission
     */
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
            
            // Add to state and render
            if (!this.state.conversations.find(c => c.id === conversation.id)) {
                this.state.conversations.unshift(conversation);
            }
            this.renderConversations();
            
            // Select the new conversation
            this.selectConversation(conversation.id);
            
            this.showToast('Conversation created', 'success');
        } catch (error) {
            console.error('Failed to create conversation:', error);
            this.showToast(error.message || 'Failed to create conversation', 'error');
        }
    },

    // ============================================
    // MESSAGES
    // ============================================

    /**
     * Load messages for a conversation
     */
    async loadMessages(conversationId) {
        try {
            const messages = await API.getMessages(conversationId);
            this.state.messages = messages.reverse(); // Oldest first
            this.renderMessages();
            this.scrollToBottom();
        } catch (error) {
            console.error('Failed to load messages:', error);
            this.showToast('Failed to load messages', 'error');
        }
    },

    /**
     * Render messages list
     */
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

    /**
     * Handle file selection
     */
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;

        // 20 MB limit
            // 100 MB limit
            if (file.size > 100 * 1024 * 1024) {
                this.showToast('File is too large (max 100 MB)', 'error');
                this.elements.fileInput.value = '';
                return;
        }

        this.elements.filePreview.style.display = 'flex';
        this.elements.filePreviewName.textContent = `📎 ${file.name} (${this.formatFileSize(file.size)})`;
    },

    /**
     * Clear file selection
     */
    clearFileSelection() {
        this.elements.fileInput.value = '';
        this.elements.filePreview.style.display = 'none';
        this.elements.filePreviewName.textContent = '';
    },

    /**
     * Handle send message (text or file)
     */
    async handleSendMessage(e) {
        e.preventDefault();
        
        const content = this.elements.messageInput.value.trim();
        const file = this.elements.fileInput.files[0];

        if (!content && !file) return;
        if (!this.state.currentConversation) return;

        const conversationId = this.state.currentConversation.id;
        
        // Clear input immediately
        this.elements.messageInput.value = '';
        
        // Stop typing indicator
        SocketService.stopTyping(conversationId);

        try {
            let message;

            if (file) {
                // Upload file
                message = await API.uploadFile(conversationId, file);
                this.clearFileSelection();
            } else {
                // Send text via socket for real-time delivery
                message = await SocketService.sendMessage(conversationId, content);
            }
            
            // Add to local state
            this.state.messages.push(message);
            this.renderMessages();
            this.scrollToBottom();
            
            // Update conversation in list
            this.updateConversationPreview(conversationId, message);
        } catch (error) {
            console.error('Failed to send message:', error);
            this.showToast('Failed to send message', 'error');
            // Restore input
            if (!file) this.elements.messageInput.value = content;
        }
    },

    /**
     * Update conversation preview with latest message
     */
    updateConversationPreview(conversationId, message) {
        const conversation = this.state.conversations.find(c => c.id === conversationId);
        if (conversation) {
            conversation.messages = [message];
            
            // Move to top
            this.state.conversations = [
                conversation,
                ...this.state.conversations.filter(c => c.id !== conversationId)
            ];
            
            this.renderConversations();
        }
    },

    /**
     * Scroll messages to bottom
     */
    scrollToBottom() {
        this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
    },

    // ============================================
    // SOCKET EVENT HANDLERS
    // ============================================

    /**
     * Handle socket connect
     */
    onSocketConnect() {
        console.log('Connected to chat server');
    },

    /**
     * Handle new message from socket
     */
    onNewMessage(data) {
        const { message, conversationId } = data;
        
        // Update conversation preview
        this.updateConversationPreview(conversationId, message);
        
        // If this is the current conversation, add message
        if (this.state.currentConversation?.id === conversationId) {
            // Check if message already exists (avoid duplicates)
            if (!this.state.messages.find(m => m.id === message.id)) {
                this.state.messages.push(message);
                this.renderMessages();
                this.scrollToBottom();
                
                // Mark as read
                SocketService.markAsRead(conversationId);
            }
        }
    },

    /**
     * Handle typing indicator update
     */
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

    /**
     * Handle user status change
     */
    onUserStatusChange(userId, isOnline) {
        if (isOnline) {
            this.state.onlineUsers.add(userId);
        } else {
            this.state.onlineUsers.delete(userId);
        }
        
        // Update RH online indicator for candidates
        const isCandidate = this.state.user.role.toLowerCase() === 'candidate';
        if (isCandidate && this.elements.rhOnlineIndicator) {
            // TODO: Check if userId is the RH user
            // For now, update indicator if any RH comes online
            if (isOnline) {
                this.elements.rhOnlineIndicator.classList.remove('offline');
            } else {
                this.elements.rhOnlineIndicator.classList.add('offline');
            }
        }
        
        // Update UI if viewing this user's conversation
        const conv = this.state.currentConversation;
        if (conv) {
            const otherParticipant = this.getOtherParticipant(conv);
            if (otherParticipant.id === userId) {
                this.elements.chatAvatar.classList.toggle('online', isOnline);
                this.elements.chatStatus.textContent = isOnline ? 'Online' : (otherParticipant.role || 'Offline');
                this.elements.chatStatus.classList.toggle('online', isOnline);
            }
        }
    },

    /**
     * Handle new conversation
     */
    onNewConversation(data) {
        const { conversation } = data;
        if (!this.state.conversations.find(c => c.id === conversation.id)) {
            this.state.conversations.unshift(conversation);
            this.renderConversations();
        }
    },

    /**
     * Handle notification
     */
    onNotification(data) {
        const { message, conversationId } = data;
        
        // Show toast if not current conversation
        if (this.state.currentConversation?.id !== conversationId) {
            const conv = this.state.conversations.find(c => c.id === conversationId);
            if (conv) {
                const sender = this.getOtherParticipant(conv);
                this.showToast(`New message from ${sender.id}`, 'info');
            }
        }
    },

    // ============================================
    // UTILITIES
    // ============================================

    /**
     * Show a toast notification
     */
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
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
    },

    /**
     * Format time for display
     */
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

    /**
     * Truncate text with ellipsis
     */
    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Render message attachments (images, videos, files)
     */
    renderAttachments(msg) {
        if (!msg.attachments || msg.attachments.length === 0) return '';

        return msg.attachments.map(att => {
            const fileType = att.fileType || '';

            if (fileType.startsWith('image/')) {
                return `<div class="message-attachment">
                    <img src="${att.url}" alt="${this.escapeHtml(att.fileName)}" loading="lazy"
                         class="attachment-image" data-url="${att.url}">
                </div>`;
            }
            if (fileType.startsWith('video/')) {
                return `<div class="message-attachment">
                    <video controls preload="metadata">
                        <source src="${att.url}" type="${fileType}">
                        Your browser does not support the video tag.
                    </video>
                </div>`;
            }
            // PDF and other files — download link
            const icon = fileType === 'application/pdf' ? '📄' : '📁';
            return `<div class="message-attachment">
                <a href="${att.url}" class="file-link" target="_blank" download="${this.escapeHtml(att.fileName)}">
                    ${icon} ${this.escapeHtml(att.fileName)}
                    <span class="file-size">${this.formatFileSize(att.fileSize)}</span>
                </a>
            </div>`;
        }).join('');
    },

    /**
     * Open image in lightbox overlay
     */
    openImageViewer(url) {
        const overlay = document.getElementById('image-overlay');
        const img = document.getElementById('overlay-image');
        if (overlay && img) {
            img.src = url;
            overlay.classList.add('active');
        }
    },

    /**
     * Close image lightbox overlay
     */
    closeImageViewer() {
        const overlay = document.getElementById('image-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            document.getElementById('overlay-image').src = '';
        }
    },

    /**
     * Format file size in human-readable form
     */
    formatFileSize(bytes) {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ChatApp.init();
});
