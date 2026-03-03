import { useRef, useState } from 'react';

export function Chat() {
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // The iframe loads from localhost:3000 (same origin as the backend).
    // The browser automatically sends the accessToken httpOnly cookie,
    // so no token passing is needed.
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
                    ref={iframeRef}
                    id="chat-iframe"
                    src={chatUrl}
                    className="w-full h-full border-0"
                    title="Chat"
                    allow="clipboard-write"
                    onLoad={() => setIframeLoaded(true)}
                />
            </div>
        </div>
    );
}
