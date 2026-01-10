import { useDispatch } from "react-redux";
import {
  useLogoutMutation,
  useProfileQuery,
} from "../../features/auth/authApi";
import { logout } from "../../features/auth/authSlice";
import Button from "../ui/Button";
import { LogOut } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  const [logoutApi] = useLogoutMutation();
  const { data: user } = useProfileQuery();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    //remove cookie
    await logoutApi();
    //update state
    dispatch(logout());
  };
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
      <div className="flex items-center gap-2">
        <span>{user?.email}</span>
        <Button className="flex items-center gap-2" variant="destructive" onClick={handleLogout}>
          <LogOut />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
