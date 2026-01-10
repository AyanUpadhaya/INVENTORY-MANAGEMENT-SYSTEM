import { useRegisterMutation } from "../features/auth/authApi";
import toast from "react-hot-toast";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import Button from "../components/ui/Button";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import { Loader2 } from "lucide-react";
export default function Register() {
  const { token } = useSelector((s) => s.auth);
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  if (token) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return toast.error("All fields are required");
    }
    if (form.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      }).unwrap();

      toast.success("Account created successfully 🎉");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full bg-white rounded-md max-w-md shadow-md p-6 font-poppins">
        <div className="space-y-2 text-center mb-3">
          <h3 className="text-2xl font-bold">InventoryPro - Create Account</h3>
          <p>Enter your credentials to create account</p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                name="email"
                value={form.email}
                onChange={handleChange}
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
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>

          <p className="font-poppins mt-10">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-700 underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

