import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserCard from '@/components/ui/UserCard';
import Icon  from '@/components/ui/Icon'

export function AppAllCards() {
  const navigate = useNavigate();
  const location = useLocation();
  const Title = location.state?.title || "Default Title";
  const applications = location.state?.applications || [];
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApplications = useMemo(() => {
    return applications?.filter((item: any) => 
      item.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, applications]);

  return (
    <div className="min-h-screen rounded-xl bg-surface-child">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#161F32] text-surface-main shadow-xl rounded-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-surface-main/10 rounded-full transition-colors"
            >
              <Icon name='ChevronLeft' className="w-6 h-6 text-primary" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{Title}</h1>
              <p className="text-slate-400 text-sm font-medium">Total: {applications?.length} candidates</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Icon name='Search' className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text"
              placeholder="Search by name or position..."
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-surface-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {filteredApplications.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredApplications.map((item: any, index: number) => (
              <div 
                key={item.id || index}
                className="animate-in fade-in slide-in-from-bottom-5 duration-500"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <UserCard candidateId={item.candidateId} applicationId={item.id}/>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <Icon name='UsersIcon' className="w-16 h-16 mb-4 opacity-20" />
            <h2 className="text-xl font-semibold">No results found</h2>
            <p>Try a different search term or check back later.</p>
          </div>
        )}
      </main>
    </div>
  );
};
