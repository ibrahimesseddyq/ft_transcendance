import { useState, useEffect, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";

const MOCK_JOBS = [
  { id: 1, title: "Front-End Developer", category: "Engineering", location: "Remote", type: "Full-time" },
  { id: 2, title: "Full-Stack Engineer", category: "CS", location: "Hybrid", type: "Full-time" },
  { id: 3, title: "UI Designer", category: "Design", location: "Remote", type: "Contract" },
  { id: 4, title: "Backend Developer", category: "Engineering", location: "Local", type: "Part-time" },
];

interface SearchFieldProps {
  isMobileSearchVisible: boolean;
  setIsMobileSearchVisible: (visible: boolean) => void;
}

export function SearchField({ isMobileSearchVisible, setIsMobileSearchVisible }: SearchFieldProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState<typeof MOCK_JOBS>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResults([]);
      setIsOpen(false);
    } else {
      const filtered = MOCK_JOBS.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResults(filtered);
      setIsOpen(true);
    }
  }, [searchQuery]);

  return (
    <div
      className={`flex-1 flex justify-center items-center relative ${isMobileSearchVisible ? 'w-full' : ''}`}
    >
      {!isMobileSearchVisible && (
        <button
          onClick={() => setIsMobileSearchVisible(true)}
          className="flex sm:hidden childcard w-10 h-10 items-center justify-center"
        >
          <Search className="h-4 w-4 text-[#060d0f] hover:text-green-600" />
        </button>
      )}

      <div className={`${isMobileSearchVisible ? 'flex w-full' : 'hidden sm:flex'} h-9 w-80 items-center rounded-md bg-[#1F2027] border border-[#5F88B8] px-3 gap-2`}>
        <Search className="h-4 w-4 text-[#94999A]" />
        <input
          placeholder="Search jobs..."
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim() !== "" && setIsOpen(true)}
          className="flex h-full w-full outline-none placeholder-[#94999A] text-white bg-transparent text-sm"
        />
        {isMobileSearchVisible && (
          <X
            className="h-4 w-4 text-gray-500 sm:hidden cursor-pointer"
            onClick={() => { setIsMobileSearchVisible(false); setSearchQuery(""); }}
          />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-11 w-full sm:w-80 bg-[#1F2027] border border-[#5F88B8] rounded-md shadow-2xl z-[100]">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredResults.length > 0 ? (
              filteredResults.map((job) => (
                <div key={job.id} className="p-3 rounded-md hover:bg-[#2A2B35] cursor-pointer border-b border-gray-800 last:border-0">
                  <p className="text-white text-xs font-bold">{job.title}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[#10B77F] text-[10px]">{job.category}</p>
                    <p className="text-[#94999A] text-[10px] flex items-center gap-1">
                      <MapPin size={10} /> {job.location}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-[#94999A] text-xs">No matches found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}