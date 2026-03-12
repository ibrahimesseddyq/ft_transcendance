
const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-8 pb-10">
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50"
      >
        Previous
      </button>
      
      <span className="text-gray-400">
        Page <strong>{currentPage}</strong> of {totalPages}
      </span>

      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;