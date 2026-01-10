import { useLoginMutation } from "../features/auth/authApi";
import { setCredentials } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import { Loader2, Loader2Icon } from "lucide-react";

export default function Login() {
  const [login, { isLoading }] = useLoginMutation();
  const { token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form);
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials(res));
      toast.success("Welcome back 🎉");
      nav("/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full bg-white rounded-md max-w-md shadow-md p-6 font-poppins">
        <div className="space-y-2 text-center mb-3">
          <h3 className="text-2xl font-bold">InventoryPro - Login</h3>
          <p>Enter your credentials to access the inventory system</p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                name="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                name="password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-md text-base"
              disabled={isLoading}
            >
              {isLoading && <Loader2Icon className="h-4 w-4 animate-spin" />}
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </form>

          <p className="font-poppins mt-10">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-700 underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
