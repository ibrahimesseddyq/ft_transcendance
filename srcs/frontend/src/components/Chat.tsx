import { useEffect, useState } from 'react';
import { useAuthStore } from '@/utils/ZuStand';

export function Chat() {
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        // Store token in sessionStorage for the chat iframe to access
        if (token) {
            sessionStorage.setItem('authToken', token);
            if (user) {
                sessionStorage.setItem('authUser', JSON.stringify(user));
            }
        }

        const handleIframeLoad = () => {
            setIframeLoaded(true);
            // Send auth token to chat iframe via postMessage as backup
            const iframe = document.getElementById('chat-iframe') as HTMLIFrameElement;
            if (iframe?.contentWindow && token) {
                iframe.contentWindow.postMessage(
                    {
                        type: 'AUTH_TOKEN',
                        token: token,
                        user: user
                    },
                    'http://localhost:3000' // Specify exact origin for security
                );
            }
        };

        const iframe = document.getElementById('chat-iframe');
        if (iframe) {
            iframe.addEventListener('load', handleIframeLoad);
            return () => {
                iframe.removeEventListener('load', handleIframeLoad);
            };
        }
    }, [token, user]);

    const chatUrl = `http://localhost:3000/chat`;

    return (
        <div style={{ width: '100%', height: 'calc(100vh - 120px)' }} className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex-1 relative">
                {!iframeLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading chat...</p>
                        </div>
                    </div>
                )}
                <iframe
                    id="chat-iframe"
                    src={chatUrl}
                    className="w-full h-full border-0"
                    title="Chat"
                    allow="clipboard-write"
                />
            </div>
        </div>
    );
}
