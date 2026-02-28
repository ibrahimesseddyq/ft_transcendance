/**
 * =====================================================
 * API SERVICE - HTTP COMMUNICATION
 * =====================================================
 * 
 * This module handles all REST API calls to the chat service.
 * It provides a clean interface for making authenticated requests.
 */

const API = {
    // Base URL for API calls
    baseUrl: '',
    
    // Current user data (set after login)
    user: null,

    // JWT token for authenticated requests
    token: null,

    /**
     * Set the authentication token
     * @param {string} token - JWT token
     */
    setToken(token) {
        this.token = token;
    },

    /**
     * Generate authorization header with JWT token
     */
    getAuthHeaders() {
        if (!this.token) return {};
        return {
            'Authorization': `Bearer ${this.token}`
        };
    },

    /**
     * Login via test endpoint to obtain a JWT token
     */
    async login(userId, userRole) {
        const response = await this.request('/api/auth/test-login', {
            method: 'POST',
            body: JSON.stringify({ userId, userRole })
        });
        this.token = response.data.token;
        this.user = response.data.user;
        return response.data;
    },

    /**
     * Get current user from session
     */
    async getCurrentUser() {
        const response = await this.request('/api/auth/me', {
            method: 'GET'
        });
        return response;
    },

    /**
     * Make an API request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} Response data
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeaders(),
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);

            if (response.status === 204) {
                return { status: true };
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.errors?.[0] || data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },

    // ============================================
    // CONVERSATION ENDPOINTS
    // ============================================

    /**
     * Get all conversations for the current user
     * @returns {Promise<Array>} List of conversations
     */
    async getConversations() {
        console.log('[API] Fetching conversations...');
        const response = await this.request('/chat/conversations');
        console.log('[API] getConversations raw response:', response);
        
        // Backend returns array directly, not wrapped in data property
        const conversations = Array.isArray(response) ? response : (response.data || []);
        console.log('[API] Parsed conversations:', conversations);
        return conversations;
    },

    /**
     * Get a single conversation by ID
     * @param {string} conversationId - Conversation ID
     * @returns {Promise<Object>} Conversation data
     */
    async getConversation(conversationId) {
        const response = await this.request(`/chat/conversations/${conversationId}`);
        return response.data;
    },

    /**
     * Get conversation with messages
     * @param {string} conversationId - Conversation ID
     * @returns {Promise<Object>} Conversation with messages
     */
    async getConversationWithMessages(conversationId) {
        const response = await this.request(`/chat/conversations/${conversationId}/messages`);
        return response.data;
    },

    /**
     * Get recruiter (RH) profile
     * @returns {Promise<Object>} RH user data
     */
    async getRecruiter() {
        const response = await this.request('/chat/conversations/rh-profile');
        // Backend returns the user object directly, not wrapped in data
        return response.data || response;
    },

    /**
     * Create a new conversation
     * @param {string} participantId - ID of the other participant (optional for candidates)
     * @returns {Promise<Object>} Created conversation
     */
    async createConversation(participantId = null) {
        const body = participantId ? { participantId } : {};
        console.log('[API] Creating conversation with body:', body);
        const response = await this.request('/chat/conversations', {
            method: 'POST',
            body: JSON.stringify(body)
        });
        console.log('[API] Full response from createConversation:', response);
        console.log('[API] response.data:', response.data);
        return response.data || response;
    },

    /**
     * Mark conversation as read
     * @param {string} conversationId - Conversation ID
     * @returns {Promise<Object>} Response
     */
    async markConversationAsRead(conversationId) {
        const response = await this.request(`/chat/conversations/${conversationId}/read`, {
            method: 'PATCH'
        });
        return response.data;
    },

    // ============================================
    // MESSAGE ENDPOINTS
    // ============================================

    /**
     * Get messages for a conversation (paginated)
     * @param {string} conversationId - Conversation ID
     * @param {number} limit - Number of messages to fetch
     * @param {string} before - Cursor for pagination
     * @returns {Promise<Array>} List of messages
     */
    async getMessages(conversationId, limit = 50, before = null) {
        let endpoint = `/chat/messages/conversation/${conversationId}?limit=${limit}`;
        if (before) {
            endpoint += `&before=${before}`;
        }
        console.log('[API] Fetching messages from:', endpoint);
        const response = await this.request(endpoint);
        console.log('[API] getMessages raw response:', response);
        
        // Backend returns array directly
        const messages = Array.isArray(response) ? response : (response.data || []);
        console.log('[API] Parsed messages:', messages);
        return messages;
    },

    /**
     * Send a message
     * @param {string} conversationId - Conversation ID
     * @param {string} content - Message content
     * @param {string} messageType - Message type (text, image, file, system)
     * @returns {Promise<Object>} Created message
     */
    async sendMessage(conversationId, content, messageType = 'text') {
        console.log('[API] Sending message to conversation:', conversationId, 'content:', content);
        const response = await this.request(`/chat/messages/conversation/${conversationId}`, {
            method: 'POST',
            body: JSON.stringify({ content, messageType })
        });
        console.log('[API] sendMessage response:', response);
        console.log('[API] response.data:', response.data);
        return response.data || response;
    },

    /**
     * Edit a message
     * @param {string} messageId - Message ID
     * @param {string} content - New content
     * @returns {Promise<Object>} Updated message
     */
    async editMessage(messageId, content) {
        const response = await this.request(`/chat/messages/${messageId}`, {
            method: 'PATCH',
            body: JSON.stringify({ content })
        });
        return response.data;
    },

    /**
     * Delete a message (soft delete)
     * @param {string} messageId - Message ID
     * @returns {Promise<Object>} Response
     */
    async deleteMessage(messageId) {
        const response = await this.request(`/chat/messages/${messageId}`, {
            method: 'DELETE'
        });
        return response.data;
    },

    /**
     * Mark message as read
     * @param {string} messageId - Message ID
     * @returns {Promise<Object>} Response
     */
    async markMessageAsRead(messageId) {
        const response = await this.request(`/chat/messages/${messageId}/read`, {
            method: 'POST'
        });
        return response.data;
    },

    /**
     * Upload a file as a message attachment
     * @param {string} conversationId - Conversation ID
     * @param {File} file - File object from input
     * @returns {Promise<Object>} Created message with attachment
     */
    async uploadFile(conversationId, file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('conversationId', conversationId);

        console.log('[API] Uploading file:', file.name, 'to conversation:', conversationId);
        const url = `${this.baseUrl}/chat/messages/upload`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...this.getAuthHeaders()
                // Note: do NOT set Content-Type — browser sets it with boundary for multipart
            },
            body: formData
        });

        const data = await response.json();
        console.log('[API] Upload response:', data);
        
        if (!response.ok) {
            throw new Error(data.errors?.[0] || data.message || 'Upload failed');
        }
        
        // Backend returns message object directly, not wrapped in data
        return Array.isArray(data) ? data : (data.data || data);
    }
};

// Export for use in other modules
window.API = API;
