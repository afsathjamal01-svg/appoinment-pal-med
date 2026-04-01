import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartPulse, Loader2, Phone, Stethoscope } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const phoneToEmail = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  return `phone_${digits}@medibook.local`;
};

const DoctorLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast({ title: "Phone required", description: "Please enter your phone number", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: phoneToEmail(phone), password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Verify doctor role
    const { data: rolesData } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    const userRoles = rolesData?.map((r) => r.role) ?? [];
    if (!userRoles.includes("doctor")) {
      await supabase.auth.signOut();
      toast({ title: "Access denied", description: "This login is for doctors only.", variant: "destructive" });
      setLoading(false);
      return;
    }

    navigate("/doctor/dashboard");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 items-center justify-center bg-emerald-600 lg:flex">
        <div className="max-w-md px-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
            <HeartPulse className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Doctor Portal</h2>
          <p className="mt-3 text-white/80">
            Manage your appointments, patients, and practice — all from your personalized dashboard.
          </p>
        </div>
      </div>

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

          <h1 className="text-2xl font-bold text-foreground">Doctor Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in with your phone number</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-5 rounded-xl border bg-card p-6 shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="phone" type="tel" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-11 pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11" />
            </div>
            <Button className="h-11 w-full bg-emerald-600 hover:bg-emerald-700" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In as Doctor
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">Create account</Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            <Link to="/login" className="hover:underline">← Back to login options</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
