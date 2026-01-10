const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="py-4 px-8 bg-white shadow-md flex justify-between gap-3">
      <div>
        <button type="button" onClick={() => toggleSidebar((prev) => !prev)}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 9.33337H28"
              stroke="#222222"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12.6533 16H28"
              stroke="#222222"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M4 16H7.98667"
              stroke="#222222"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M4 22.6666H28"
              stroke="#222222"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
