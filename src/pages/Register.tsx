import { Link } from "react-router-dom";
import { Stethoscope, User } from "lucide-react";

const registerOptions = [
  {
    role: "Patient",
    path: "/register/patient",
    icon: User,
    description: "Create an account to book appointments and manage your health",
    color: "bg-primary hover:bg-primary/90 text-primary-foreground",
  },
];

const Register = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Stethoscope className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Join MediBook</h1>
          <p className="mt-1 text-sm text-muted-foreground">Choose your account type to get started</p>
        </div>

        <div className="space-y-4">
          {registerOptions.map((opt) => (
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
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">← Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
