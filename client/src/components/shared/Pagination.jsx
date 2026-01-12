export const Pagination = ({
  currentPage,
  setCurrentPage,
  rowsPerPage,
  totalRows,
}) => {
  const handleIncrement = () => {
    if (currentPage * rowsPerPage >= totalRows) {
      return;
    } else {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (currentPage <= 1) {
      return;
    } else {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <section className="flex items-center justify-end gap-4 text-darkHigh w-full flex-nowrap whitespace-nowrap px-5 py-4 bg-white border-t border-slateLow">
      

      
      <div>
        <p>
          showing {currentPage} from  - {Math.min(rowsPerPage * currentPage, totalRows)} of{" "}
          {totalRows}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={handleDecrement}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M15.7049 16.59L11.1249 12L15.7049 7.41L14.2949 6L8.29492 12L14.2949 18L15.7049 16.59Z"
              fill="#474747"
            />
          </svg>
        </button>
        <button type="button" onClick={handleIncrement}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M8.29492 16.59L12.8749 12L8.29492 7.41L9.70492 6L15.7049 12L9.70492 18L8.29492 16.59Z"
              fill="#474747"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};