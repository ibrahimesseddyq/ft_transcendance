/**
 * =====================================================
 * SOCKET SERVICE - REAL-TIME COMMUNICATION
 * =====================================================
 * 
 * This module handles Socket.IO connections for real-time
 * messaging features like:
 * - Instant message delivery
 * - Typing indicators
 * - Online/offline status
 * - Read receipts
 */

const SocketService = {
    // Socket.IO instance
    socket: null,
    
    // Current user
    user: null,
    
    // Event handlers
    handlers: {},

    /**
     * Connect to the Socket.IO server
     * @param {Object} user - User object with id and role
     */
    connect(user, token) {
        this.user = user;
        this.token = token;
        console.log('SocketService.connect() called with user:', user);

        // Connect to Socket.IO with JWT token
        this.socket = io({
            auth: {
                token: token
            },
            transports: ['websocket', 'polling']
        });
        
        console.log('Socket.IO connection initiated, socket:', this.socket);

        this.setupEventListeners();
    },

    /**
     * Disconnect from the server
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    },

    /**
     * Set up all socket event listeners
     */
    setupEventListeners() {
        // Connection events
        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.emit('onConnect');
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            this.emit('onDisconnect', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            this.emit('onError', error);
        });

        // Message events
        this.socket.on('message:new', (data) => {
            console.log('New message received:', data);
            this.emit('onNewMessage', data);
        });

        this.socket.on('message:updated', (data) => {
            console.log('Message updated:', data);
            this.emit('onMessageUpdated', data);
        });

        this.socket.on('message:deleted', (data) => {
            console.log('Message deleted:', data);
            this.emit('onMessageDeleted', data);
        });

        // Typing events
        this.socket.on('typing:update', (data) => {
            this.emit('onTypingUpdate', data);
        });

        // Notification events
        this.socket.on('notification:message', (data) => {
            console.log('Message notification:', data);
            this.emit('onNotification', data);
        });

        // Read receipt events
        this.socket.on('message:read', (data) => {
            this.emit('onMessageRead', data);
        });

        // User status events
        this.socket.on('user:online', (data) => {
            this.emit('onUserOnline', data);
        });

        this.socket.on('user:offline', (data) => {
            this.emit('onUserOffline', data);
        });

        // Conversation events
        this.socket.on('conversation:new', (data) => {
            console.log('New conversation:', data);
            this.emit('onNewConversation', data);
        });
    },

    /**
     * Register an event handler
     * @param {string} event - Event name
     * @param {Function} handler - Handler function
     */
    on(event, handler) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler);
    },

    /**
     * Remove an event handler
     * @param {string} event - Event name
     * @param {Function} handler - Handler function
     */
    off(event, handler) {
        if (this.handlers[event]) {
            this.handlers[event] = this.handlers[event].filter(h => h !== handler);
        }
    },

    /**
     * Emit an event to all registered handlers
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        if (this.handlers[event]) {
            this.handlers[event].forEach(handler => handler(data));
        }
    },

    // ============================================
    // SOCKET EMITTERS
    // ============================================

    /**
     * Send a message via Socket.IO
     * @param {string} conversationId - Conversation ID
     * @param {string} content - Message content
     * @param {string} messageType - Message type
     * @returns {Promise<Object>} Server response
     */
    sendMessage(conversationId, content, messageType = 'text') {
        return new Promise((resolve, reject) => {
            this.socket.emit('message:send', {
                conversationId,
                content,
                messageType
            }, (response) => {
                if (response.success) {
                    resolve(response.data);
                } else {
                    reject(new Error(response.error));
                }
            });
        });
    },

    /**
     * Start typing indicator
     * @param {string} conversationId - Conversation ID
     */
    startTyping(conversationId) {
        this.socket.emit('typing:start', { conversationId });
    },

    /**
     * Stop typing indicator
     * @param {string} conversationId - Conversation ID
     */
    stopTyping(conversationId) {
        this.socket.emit('typing:stop', { conversationId });
    },

    /**
     * Join a conversation room
     * @param {string} conversationId - Conversation ID
     */
    joinConversation(conversationId) {
        this.socket.emit('conversation:join', { conversationId });
    },

    /**
     * Mark messages as read
     * @param {string} conversationId - Conversation ID
     */
    markAsRead(conversationId) {
        this.socket.emit('message:read', { conversationId });
    },

    /**
     * Get user status
     * @param {string} userId - User ID
     * @returns {Promise<Object>} User status
     */
    getUserStatus(userId) {
        return new Promise((resolve) => {
            this.socket.emit('user:status', { userId }, (response) => {
                resolve(response);
            });
        });
    }
};

// Export for use in other modules
window.SocketService = SocketService;
