
const Pagination = ({ currentPage, totalPages, setCurrentPage }: any) => {
  return (
    <div className="fixed bottom-1 left-1/2 -translate-x-1/2 md:bottom-6 md:right-24 md:left-auto md:translate-x-0 z-40 flex items-center gap-4 
      bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 px-4 rounded-2xl border shadow-xl">
      <button
        disabled={currentPage <= 1}
        onClick={() => setCurrentPage(currentPage - 1)}
        className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 "
      >
        <small className="font-bold text-black dark:text-white">Prev</small>
      </button>
      <div className="px-4 border-x text-sm font-bold text-black dark:text-white">
        {currentPage} / {totalPages}
      </div>
      <button
        disabled={currentPage >= totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
        className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 "
      >
        <small className="font-bold text-black dark:text-white">Next</small>
      </button>
    </div>
  );
};

export default Pagination;