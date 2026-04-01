import { Link } from "react-router-dom";
import { Stethoscope, User, HeartPulse, Shield } from "lucide-react";

const loginOptions = [
  {
    role: "Patient",
    path: "/login/patient",
    icon: User,
    description: "Book appointments and manage your health records",
    color: "bg-primary hover:bg-primary/90 text-primary-foreground",
  },
  {
    role: "Doctor",
    path: "/login/doctor",
    icon: HeartPulse,
    description: "Manage your practice, patients, and appointments",
    color: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  {
    role: "Admin",
    path: "/login/admin",
    icon: Shield,
    description: "Administration console for platform management",
    color: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
  },
];

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Stethoscope className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Welcome to MediBook</h1>
          <p className="mt-1 text-sm text-muted-foreground">Choose how you'd like to sign in</p>
        </div>

        <div className="space-y-4">
          {loginOptions.map((opt) => (
            <Link
              key={opt.role}
              to={opt.path}
              className={`flex items-center gap-4 rounded-xl p-5 shadow-sm transition-all ${opt.color}`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <opt.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold">{opt.role}</p>
                <p className="text-sm opacity-80">{opt.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">Create account</Link>
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">← Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
