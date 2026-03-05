const SocketService = {
    socket: null,
    user: null,
    handlers: {},
    connect(user, token) {
        this.user = user;
        this.token = token;
        this.socket = io({
            auth: {
                token: token
            },
            transports: ['websocket', 'polling']
        });
        this.setupEventListeners();
    },
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    },
    setupEventListeners() {
        this.socket.on('connect', () => {
            this.emit('onConnect');
        });
        this.socket.on('disconnect', (reason) => {
            this.emit('onDisconnect', reason);
        });
        this.socket.on('connect_error', (error) => {
            this.emit('onError', error);
        });
        this.socket.on('message:new', (data) => {
            this.emit('onNewMessage', data);
        });
        this.socket.onAny((eventName, ...args) => {
        });
        this.socket.on('message:updated', (data) => {
            this.emit('onMessageUpdated', data);
        });
        this.socket.on('message:deleted', (data) => {
            this.emit('onMessageDeleted', data);
        });
        this.socket.on('typing:update', (data) => {
            this.emit('onTypingUpdate', data);
        });
        this.socket.on('notification:message', (data) => {
            this.emit('onNotification', data);
        });
        this.socket.on('message:read', (data) => {
            this.emit('onMessageRead', data);
        });
        this.socket.on('user:online', (data) => {
            this.emit('onUserOnline', data);
        });
        this.socket.on('user:offline', (data) => {
            this.emit('onUserOffline', data);
        });
        this.socket.on('user:onlineUsers', (data) => {
            this.emit('onOnlineUsers', data);
        });
        this.socket.on('conversation:new', (data) => {
            this.emit('onNewConversation', data);
        });
    },
    on(event, handler) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler);
    },
    off(event, handler) {
        if (this.handlers[event]) {
            this.handlers[event] = this.handlers[event].filter(h => h !== handler);
        }
    },
    emit(event, data) {
        if (this.handlers[event]) {
            this.handlers[event].forEach(handler => handler(data));
        }
    },
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
    startTyping(conversationId) {
        this.socket.emit('typing:start', { conversationId });
    },
    stopTyping(conversationId) {
        this.socket.emit('typing:stop', { conversationId });
    },
    joinConversation(conversationId) {
        this.socket.emit('conversation:join', { conversationId });
    },
    markAsRead(conversationId) {
        this.socket.emit('message:read', { conversationId });
    },
    getUserStatus(userId) {
        return new Promise((resolve) => {
            this.socket.emit('user:status', { userId }, (response) => {
                resolve(response);
            });
        });
    }
};
window.SocketService = SocketService;