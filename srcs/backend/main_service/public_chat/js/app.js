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
            conversationSearch: document.getElementById('conversation-search'),
            
            // Chat area
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
        
        // Conversation search
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
            this.elements.mobileBackBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.elements.chatLayout.classList.remove('chat-open');
                if (this.elements.mainSidebar) {
                    this.elements.mainSidebar.classList.add('active');
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
        SocketService.on('onOnlineUsers', (data) => this.onOnlineUsers(data));
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
            // Try sessionStorage first (set by parent)
            token = sessionStorage.getItem('authToken');
            const storedUser = sessionStorage.getItem('authUser');
            if (storedUser) {
                try {
                    userData = JSON.parse(storedUser);
                } catch (e) {
                    console.warn('Failed to parse stored user data');
                }
            }

            // Try Zustand persist storage from parent (auth-storage)
            if (!token) {
                try {
                    const authStorage = localStorage.getItem('auth-storage');
                    if (authStorage) {
                        const parsed = JSON.parse(authStorage);
                        token = parsed.state?.token;
                        userData = parsed.state?.user;
                    }
                } catch (e) {
                    console.warn('Failed to parse auth-storage:', e);
                }
            }
        }

        // If running in iframe, try parent storage
        if (!token && window.parent !== window) {
            try {
                // Try parent sessionStorage
                token = window.parent.sessionStorage?.getItem('authToken');
                const parentUser = window.parent.sessionStorage?.getItem('authUser');
                if (parentUser && !userData) {
                    userData = JSON.parse(parentUser);
                }

                // Try parent Zustand storage
                if (!token) {
                    const authStorage = window.parent.localStorage?.getItem('auth-storage');
                    if (authStorage) {
                        const parsed = JSON.parse(authStorage);
                        token = parsed.state?.token;
                        userData = parsed.state?.user;
                    }
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
        
        // Update UI with user info (only if elements exist - they're removed in RH view)
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
        
        // Show appropriate sidebar based on role
        this.setupSidebarForRole(user.role);
        
        // Hide login screen, show chat
        this.elements.loginScreen.classList.remove('active');
        this.elements.chatScreen.classList.add('active');
        
        // Connect to socket with JWT token
        try {
            console.log('[Chat] Connecting to socket with user:', this.state.user);
            console.log('[Chat] Using token:', API.token ? 'Token exists' : 'NO TOKEN');
            SocketService.connect(this.state.user, API.token);
        } catch (error) {
            console.error('Socket connection error:', error);
            this.showToast('Failed to connect to chat server', 'error');
        }
        
        // For candidates, load RH profile BEFORE conversations so state.rhUser is ready
        if (user.role.toLowerCase() === 'candidate') {
            await this.loadRHProfile();
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
            // loadRHProfile() is called separately with await in startChat()
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
            // Fetch actual RH info from API
            const rhUser = await API.getRecruiter();

            // Store RH info in state for later use
            this.state.rhUser = rhUser;

            // Update RH profile UI (desktop sidebar)
            const initials = (rhUser.firstName.charAt(0) + rhUser.lastName.charAt(0)).toUpperCase();
            this.elements.rhProfileInitials.textContent = initials;
            
            if (rhUser.avatarUrl) {
                // Add backend base URL to avatar path
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

            // Populate mobile RH header (shown on small screens instead of sidebar)
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
            
            // Check actual online status
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

            console.log('[Chat] RH profile loaded:', rhUser);
        } catch (error) {
            console.error('Failed to load RH profile:', error);
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
            // For candidates, create/get conversation with RH automatically
            console.log('[Chat] Candidate view - creating/getting RH conversation');
            
            try {
                // Create or get existing conversation with RH
                const conversation = await API.createConversation();
                console.log('[Chat] Conversation API response:', conversation);
                
                if (!conversation || !conversation.id) {
                    throw new Error('Invalid conversation response from API');
                }
                
                // Set as current conversation
                this.state.currentConversation = conversation;
                console.log('[Chat] Current conversation set:', conversation.id);
                
                // Show chat interface
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
                // Set chat-avatar image or initials
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
                // Status will be updated by onUserStatusChange once socket connects
                const isRhOnlineNow = this.state.rhUser ? this.state.onlineUsers.has(this.state.rhUser.id) : false;
                this.elements.chatStatus.textContent = isRhOnlineNow ? 'Online' : 'Offline';
                this.elements.chatAvatar.classList.toggle('online', isRhOnlineNow);
                this.elements.chatAvatar.classList.toggle('offline', !isRhOnlineNow);

                // Also sync mobile RH header from state (state.rhUser is already loaded)
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
                
                // Join the conversation room via socket
                if (SocketService.socket) {
                    SocketService.joinConversation(conversation.id);
                }
                
                // Load existing messages if any
                await this.loadMessages(conversation.id);
            } catch (error) {
                console.error('Failed to create/get conversation:', error);
                this.showToast('Failed to initialize chat', 'error');
            }
            return;
        }
        
        // For RH/Admin, fetch and display conversation list
        try {
            console.log('[Chat] RH fetching conversations...');
            const conversations = await API.getConversations();
            console.log('[Chat] RH received conversations:', conversations);
            console.log('[Chat] Number of conversations:', conversations.length);
            
            this.state.conversations = conversations;
            this.renderConversations();
            
            // Join all conversation rooms for real-time updates
            if (SocketService.socket) {
                console.log('[Chat] RH joining conversation rooms:', conversations.map(c => c.id));
                conversations.forEach(conv => {
                    SocketService.joinConversation(conv.id);
                    console.log('[Chat] Joined room:', conv.id);
                });
            } else {
                console.warn('[Chat] Socket not connected, cannot join rooms');
            }
            
            // Automatically select the first conversation if available
            if (conversations.length > 0) {
                console.log('[Chat] Auto-selecting first conversation for RH');
                await this.selectConversation(conversations[0].id);
            }
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
            
            // Get participant name and initials
            const participantName = otherParticipant.firstName && otherParticipant.lastName
                ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
                : otherParticipant.email || 'Unknown User';
            const participantInitials = otherParticipant.firstName && otherParticipant.lastName
                ? (otherParticipant.firstName.charAt(0) + otherParticipant.lastName.charAt(0)).toUpperCase()
                : (participantName.charAt(0) || '?').toUpperCase();
            
            // Check if participant has avatar
            const avatarUrl = otherParticipant.avatarUrl 
                ? (otherParticipant.avatarUrl.startsWith('http') ? otherParticipant.avatarUrl : `${API.baseUrl}${otherParticipant.avatarUrl}`)
                : null;
            
            // Check if user is online
            const isOnline = this.state.onlineUsers.has(otherParticipant.id);
            const onlineClass = isOnline ? 'online' : 'offline';
            
            // Avatar HTML with image or initials
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

        // Add click handlers
        this.elements.conversationsList.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => this.selectConversation(item.dataset.id));
        });
    },

    /**
     * Filter conversations based on search query
     */
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

    /**
     * Get the other participant in a conversation
     */
    getOtherParticipant(conversation) {
        // If conversation has participants array (from backend)
        if (conversation.participants && Array.isArray(conversation.participants)) {
            const otherParticipant = conversation.participants.find(p => p.userId !== this.state.user.id);
            if (otherParticipant && otherParticipant.user) {
                return otherParticipant.user;
            }
        }
        
        // Fallback: if otherParticipant is already computed by the API
        if (conversation.otherParticipant) {
            return conversation.otherParticipant;
        }
        
        // Minimal fallback
        return { 
            id: 'unknown',
            firstName: 'Unknown',
            lastName: 'User'
        };
    },

    /**
     * Select a conversation
     */
    async selectConversation(conversationId) {
        const conversation = this.state.conversations.find(c => c.id === conversationId);
        if (!conversation) return;

        this.state.currentConversation = conversation;
        
        // Update header FIRST (before making chat-active visible to avoid empty flash)
        const otherParticipant = this.getOtherParticipant(conversation);
        const isOnline = this.state.onlineUsers.has(otherParticipant.id);
        
        // Get participant name and initials
        const participantName = otherParticipant.firstName && otherParticipant.lastName
            ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
            : otherParticipant.email || 'Unknown User';
        const participantInitials = otherParticipant.firstName && otherParticipant.lastName
            ? (otherParticipant.firstName.charAt(0) + otherParticipant.lastName.charAt(0)).toUpperCase()
            : (participantName.charAt(0) || '?').toUpperCase();
        
        // Set avatar: image if available, otherwise initials
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

        // NOW show the chat area
        this.elements.chatEmptyState.classList.remove('active');
        this.elements.chatActive.classList.add('active');
        this.elements.chatLayout.classList.add('chat-open');
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768 && this.elements.mainSidebar) {
            this.elements.mainSidebar.classList.remove('active');
        }
        
        // Highlight active conversation in list
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
            console.log('[Chat] Loading messages for conversation:', conversationId);
            const messages = await API.getMessages(conversationId);
            console.log('[Chat] Loaded messages from API:', messages);
            console.log('[Chat] Number of messages:', messages.length);
            
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
            if (!msg || !msg.senderId) {
                console.error('[Chat] Invalid message object:', msg);
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
        
        if (!this.state.currentConversation) {
            console.error('No current conversation set!');
            this.showToast('Please wait for chat to initialize', 'error');
            return;
        }

        const conversationId = this.state.currentConversation.id;
        console.log('[Chat] Sending message to conversation:', conversationId);
        
        // Clear input immediately
        this.elements.messageInput.value = '';
        
        // Stop typing indicator
        if (SocketService.socket) {
            SocketService.stopTyping(conversationId);
        }

        try {
            let message;

            if (file) {
                // Upload file
                message = await API.uploadFile(conversationId, file);
                this.clearFileSelection();
            } else {
                // Send text message via API
                message = await API.sendMessage(conversationId, content);
            }
            
            console.log('[Chat] Message sent successfully:', message);
            
            // Add to local state only if not already added by the socket event (onNewMessage)
            if (message && !this.state.messages.find(m => m.id === message.id)) {
                this.state.messages.push(message);
                this.renderMessages();
                this.scrollToBottom();
            }
            
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
     * Handle socket connection
     */
    onSocketConnect() {
        console.log('[Chat] Socket connected successfully');
        // Request current online users list
        if (SocketService.socket) {
            SocketService.socket.emit('user:getOnlineUsers', {}, (response) => {
                if (response && response.success) {
                    this.onOnlineUsers({ userIds: response.data });
                }
            });
        }
    },

    /**
     * Handle initial online users list
     */
    onOnlineUsers(data) {
        console.log('[Status] Received online users:', data.userIds);
        if (data.userIds && Array.isArray(data.userIds)) {
            // Clear current online users and add all from list
            this.state.onlineUsers.clear();
            data.userIds.forEach(userId => {
                this.state.onlineUsers.add(userId);
            });
            
            // Update UI for all online users
            data.userIds.forEach(userId => {
                this.onUserStatusChange(userId, true);
            });
            
            // Update RH profile if candidate
            if (this.state.user.role.toLowerCase() === 'candidate' && this.state.rhUser) {
                const isRhOnline = this.state.onlineUsers.has(this.state.rhUser.id);
                this.onUserStatusChange(this.state.rhUser.id, isRhOnline);
            }
            
            // Re-render conversations to show online status
            if (this.state.conversations.length > 0) {
                this.renderConversations();
            }
        }
    },

    /**
     * Handle new message from socket
     */
    onNewMessage(data) {
        console.log('[Chat] onNewMessage received:', data);
        const { message, conversationId } = data;
        const isRH = this.state.user.role.toLowerCase() === 'recruiter';
        
        console.log('[Chat] Current user role:', this.state.user.role, 'isRH:', isRH);
        console.log('[Chat] Current conversations:', this.state.conversations.map(c => c.id));
        
        // For RH, if conversation doesn't exist in list, reload conversations
        if (isRH && !this.state.conversations.find(c => c.id === conversationId)) {
            console.log('[Chat] Conversation not found in list, reloading...');
            this.loadConversations();
        }
        
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
        console.log(`[Status] User ${userId} is now ${isOnline ? 'online' : 'offline'}`);
        
        if (isOnline) {
            this.state.onlineUsers.add(userId);
        } else {
            this.state.onlineUsers.delete(userId);
        }
        
        // Update RH online indicator for candidates
        const isCandidate = this.state.user.role.toLowerCase() === 'candidate';
        if (isCandidate && this.elements.rhOnlineIndicator && this.state.rhUser) {
            // Check if this is the RH user
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
        
        // Update conversation list avatars
        this.updateConversationOnlineStatus(userId, isOnline);
        
        // Update UI if viewing this user's conversation
        const conv = this.state.currentConversation;
        if (conv) {
            const otherParticipant = this.getOtherParticipant(conv);
            if (otherParticipant.id === userId) {
                this.elements.chatAvatar.classList.toggle('online', isOnline);
                this.elements.chatAvatar.classList.toggle('offline', !isOnline);
                this.elements.chatStatus.textContent = isOnline ? 'Online' : 'Offline';
                this.elements.chatStatus.classList.toggle('online', isOnline);
                
                // Update mobile RH header if candidate view
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

    /**
     * Update online status indicator in conversation list
     */
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
            // PDF and other files — download link
            const icon = mimeType === 'application/pdf' ? '📄' : '📁';
            return `<div class="message-attachment">
                <a href="${fileUrl}" class="file-link" target="_blank" download="${this.escapeHtml(att.fileName)}">
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
