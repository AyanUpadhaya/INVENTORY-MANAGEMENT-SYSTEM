import { Link } from "react-router-dom";
import { useProfileQuery, useLogoutMutation } from "../features/auth/authApi";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";


export default function Dashboard() {
  const { data: user } = useProfileQuery();
  const [logoutApi] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    //remove cookie
    await logoutApi();
    //update state
    dispatch(logout());
  };
  const content = (
    <div style={styles.container}>
      <h1 class="text-3xl font-bold underline">Hello world!</h1>
      <h2>Hello {user?.name} {user?.role}</h2>
      <Link to={"/products"}>Go to products</Link>
      <button style={styles.btn} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );

  return content;
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center",
  },
  btn: {
    padding: "10px",
    background: "#ea2720ff",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: 6,
    fontWeight: "bold",
    border: "none",
    transition: "0.2s",
  },
};
