import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stethoscope, Loader2, User, HeartPulse, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const roles = [
  { value: "patient", label: "Patient", icon: User, placeholder: "patient@example.com" },
  { value: "doctor", label: "Doctor", icon: HeartPulse, placeholder: "doctor@example.com" },
  { value: "center", label: "Center", icon: Building2, placeholder: "center@example.com" },
] as const;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);

    const userRoles = rolesData?.map((r) => r.role) ?? [];

    if (userRoles.includes("admin")) navigate("/admin/dashboard");
    else if (userRoles.includes("doctor")) navigate("/doctor/dashboard");
    else if (userRoles.includes("center")) navigate("/center/dashboard");
    else navigate("/patient/dashboard");

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - Branding */}
      <div className="hidden w-1/2 items-center justify-center bg-primary lg:flex">
        <div className="max-w-md px-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20">
            <Stethoscope className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-primary-foreground">MediBook</h2>
          <p className="mt-3 text-primary-foreground/80">
            Your trusted platform for booking doctor appointments instantly. Access your dashboard as a patient, doctor, or center — all from one login.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Stethoscope className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">MediBook</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to access your dashboard
          </p>

          <Tabs defaultValue="patient" className="mt-6 w-full">
            <TabsList className="grid w-full grid-cols-3">
              {roles.map((role) => (
                <TabsTrigger key={role.value} value={role.value} className="gap-1.5">
                  <role.icon className="h-4 w-4" />
                  {role.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {roles.map((role) => (
              <TabsContent key={role.value} value={role.value}>
                <form onSubmit={handleLogin} className="mt-4 space-y-5 rounded-xl border bg-card p-6 shadow-sm">
                  <div className="space-y-2">
                    <Label htmlFor={`email-${role.value}`}>Email</Label>
                    <Input
                      id={`email-${role.value}`}
                      type="email"
                      placeholder={role.placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`password-${role.value}`}>Password</Label>
                    <Input
                      id={`password-${role.value}`}
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <Button className="h-11 w-full" type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In as {role.label}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create account
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:underline">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
