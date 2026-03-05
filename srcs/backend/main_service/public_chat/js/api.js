const API = {
    baseUrl: '',
    user: null,
    token: null,
    setToken(token) {
        this.token = token;
    },
    getAuthHeaders() {
        if (!this.token) return {};
        return {
            'Authorization': `Bearer ${this.token}`
        };
    },
    async login(userId, userRole) {
        const response = await this.request('/api/auth/test-login', {
            method: 'POST',
            body: JSON.stringify({ userId, userRole })
        });
        this.token = response.data.token;
        this.user = response.data.user;
        return response.data;
    },
    async getCurrentUser() {
        const response = await this.request('/api/users/me', {
            method: 'GET'
        });
        return response;
    },
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
            throw error;
        }
    },
    async getConversations() {
        const response = await this.request('/chat/conversations');
        const conversations = Array.isArray(response) ? response : (response.data || []);
        return conversations;
    },
    async getConversation(conversationId) {
        const response = await this.request(`/chat/conversations/${conversationId}`);
        return response.data;
    },
    async getConversationWithMessages(conversationId) {
        const response = await this.request(`/chat/conversations/${conversationId}/messages`);
        return response.data;
    },
    async getRecruiter() {
        const response = await this.request('/chat/conversations/rh-profile');
        return response.data || response;
    },
    async createConversation(participantId = null) {
        const body = participantId ? { participantId } : {};
        const response = await this.request('/chat/conversations', {
            method: 'POST',
            body: JSON.stringify(body)
        });
        return response.data || response;
    },
    async markConversationAsRead(conversationId) {
        const response = await this.request(`/chat/conversations/${conversationId}/read`, {
            method: 'PATCH'
        });
        return response.data;
    },
    async getMessages(conversationId, limit = 50, before = null) {
        let endpoint = `/chat/messages/conversation/${conversationId}?limit=${limit}`;
        if (before) {
            endpoint += `&before=${before}`;
        }
        const response = await this.request(endpoint);
        const messages = Array.isArray(response) ? response : (response.data || []);
        return messages;
    },
    async sendMessage(conversationId, content, messageType = 'text') {
        const response = await this.request(`/chat/messages/conversation/${conversationId}`, {
            method: 'POST',
            body: JSON.stringify({ content, messageType })
        });
        return response.data || response;
    },
    async editMessage(messageId, content) {
        const response = await this.request(`/chat/messages/${messageId}`, {
            method: 'PATCH',
            body: JSON.stringify({ content })
        });
        return response.data;
    },
    async deleteMessage(messageId) {
        const response = await this.request(`/chat/messages/${messageId}`, {
            method: 'DELETE'
        });
        return response.data;
    },
    async markMessageAsRead(messageId) {
        const response = await this.request(`/chat/messages/${messageId}/read`, {
            method: 'POST'
        });
        return response.data;
    },
    async uploadFile(conversationId, file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('conversationId', conversationId);
        const url = `${this.baseUrl}/chat/messages/upload`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...this.getAuthHeaders()
            },
            body: formData
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.errors?.[0] || data.message || 'Upload failed');
        }
        return Array.isArray(data) ? data : (data.data || data);
    }
};
window.API = API;