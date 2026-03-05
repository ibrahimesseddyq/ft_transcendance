import { User } from '../../types/chat';

interface RHProfileSidebarProps {
  recruiter: User | null;
  isOnline: boolean;
  isLoading?: boolean;
}

// Renders the inner content of the blue candidate sidebar.
// The <aside className="sidebar rh-profile-sidebar"> wrapper lives in Chat.tsx;
// CSS (.sidebar.rh-profile-sidebar) handles dimensions and border-radius.
export function RHProfileSidebar({ recruiter, isOnline, isLoading = false }: RHProfileSidebarProps) {
  if (isLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ width: 48, height: 48, border: '3px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  const getInitials = () => {
    if (recruiter?.firstName && recruiter?.lastName)
      return (recruiter.firstName.charAt(0) + recruiter.lastName.charAt(0)).toUpperCase();
    return 'RH';
  };

  const getAvatarUrl = () => {
    if (recruiter?.avatarUrl) {
      return recruiter.avatarUrl.startsWith('http')
        ? recruiter.avatarUrl
        : `http://localhost:3000${recruiter.avatarUrl}`;
    }
    return null;
  };

  const recruiterName = recruiter
    ? `${recruiter.firstName || ''} ${recruiter.lastName || ''}`.trim() || 'Recruiter'
    : 'Loading...';
  const avatarUrl = getAvatarUrl();
  const initials = getInitials();

  return (
    /* rh-profile-sidebar-content */
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Blue top section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '28px 16px 150px',
          color: 'white',
          background: '#018ABE',
          borderRadius: '30px 30px 0 0',
          position: 'relative',
        }}
      >
        {/* Avatar wrapper */}
        <div style={{ position: 'relative', width: 95, height: 95, marginBottom: 14 }}>
          <div
            style={{
              width: 95,
              height: 95,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f7c97e 0%, #f0a830 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              fontSize: 38,
              fontWeight: 600,
              color: '#5a3e1b',
              border: '3px solid rgba(255,255,255,0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={recruiterName}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
              />
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                {initials}
              </span>
            )}
          </div>
          {/* Online indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: isOnline ? '#10b981' : '#6c757d',
              border: '2px solid #1b4f6e',
              transition: 'background-color 0.3s',
            }}
          />
        </div>

        {/* Status label */}
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', marginBottom: 12, textTransform: 'uppercase' }}>
          {isOnline ? 'Online' : 'Offline'}
        </div>

        {/* Name */}
        <div style={{ fontSize: 15, fontWeight: 700, textAlign: 'center', color: '#ffffff', lineHeight: 1.3, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
          {recruiterName}
        </div>
        {/* email: hidden per original (.rh-profile-email { display: none }) */}
      </div>

      {/* Dark bottom section with diagonal clip */}
      <div
        style={{
          width: '100%',
          flex: 1,
          background: '#2C2C2C',
          clipPath: 'polygon(0 140px, 100% 0px, 100% 100%, 0 100%)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 28,
          paddingTop: 20,
          marginTop: -140,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 500, letterSpacing: '0.3px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {recruiter?.company || "Company's HR"}
        </div>
      </div>
    </div>
  );
}


