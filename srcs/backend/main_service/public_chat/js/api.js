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
        const response = await this.request('/api/conversations');
        return response.data || [];
    },

    /**
     * Get a single conversation by ID
     * @param {string} conversationId - Conversation ID
     * @returns {Promise<Object>} Conversation data
     */
    async getConversation(conversationId) {
        const response = await this.request(`/api/conversations/${conversationId}`);
        return response.data;
    },

    /**
     * Get conversation with messages
     * @param {string} conversationId - Conversation ID
     * @returns {Promise<Object>} Conversation with messages
     */
    async getConversationWithMessages(conversationId) {
        const response = await this.request(`/api/conversations/${conversationId}/messages`);
        return response.data;
    },

    /**
     * Create a new conversation
     * @param {string} participantId - ID of the other participant
     * @param {string} participantRole - Role of the other participant
     * @returns {Promise<Object>} Created conversation
     */
    async createConversation(participantId, participantRole) {
        const response = await this.request('/api/conversations', {
            method: 'POST',
            body: JSON.stringify({ 
                targetUserId: participantId, 
                targetUserRole: participantRole 
            })
        });
        return response.data;
    },

    /**
     * Mark conversation as read
     * @param {string} conversationId - Conversation ID
     * @returns {Promise<Object>} Response
     */
    async markConversationAsRead(conversationId) {
        const response = await this.request(`/api/conversations/${conversationId}/read`, {
            method: 'POST'
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
        let endpoint = `/api/messages/conversation/${conversationId}?limit=${limit}`;
        if (before) {
            endpoint += `&before=${before}`;
        }
        const response = await this.request(endpoint);
        return response.data || [];
    },

    /**
     * Send a message
     * @param {string} conversationId - Conversation ID
     * @param {string} content - Message content
     * @param {string} messageType - Message type (text, image, file, system)
     * @returns {Promise<Object>} Created message
     */
    async sendMessage(conversationId, content, messageType = 'text') {
        const response = await this.request('/api/messages', {
            method: 'POST',
            body: JSON.stringify({ conversationId, content, messageType })
        });
        return response.data;
    },

    /**
     * Edit a message
     * @param {string} messageId - Message ID
     * @param {string} content - New content
     * @returns {Promise<Object>} Updated message
     */
    async editMessage(messageId, content) {
        const response = await this.request(`/api/messages/${messageId}`, {
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
        const response = await this.request(`/api/messages/${messageId}`, {
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
        const response = await this.request(`/api/messages/${messageId}/read`, {
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

        const url = `${this.baseUrl}/api/messages/upload`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...this.getAuthHeaders()
                // Note: do NOT set Content-Type — browser sets it with boundary for multipart
            },
            body: formData
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.errors?.[0] || data.message || 'Upload failed');
        }
        return data.data;
    }
};

// Export for use in other modules
window.API = API;
