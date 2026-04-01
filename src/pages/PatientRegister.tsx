import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Loader2, Phone, Stethoscope } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const phoneToEmail = (phone: string) => `phone_${phone.replace(/\D/g, "")}@medibook.local`;

const PatientRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) { toast({ title: "Phone required", variant: "destructive" }); return; }
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: phoneToEmail(phone), password,
      options: { data: { full_name: name }, emailRedirectTo: window.location.origin },
    });
    if (error) { toast({ title: "Registration failed", description: error.message, variant: "destructive" }); setLoading(false); return; }

    const userId = data.user?.id;
    if (userId) await supabase.from("profiles").update({ phone }).eq("id", userId);

    toast({ title: "Account created!", description: "You can now log in." });
    navigate("/login/patient");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 items-center justify-center bg-primary lg:flex">
        <div className="max-w-md px-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-primary-foreground">Patient Registration</h2>
          <p className="mt-3 text-primary-foreground/80">Join MediBook to book appointments and manage your health records.</p>
        </div>
      </div>
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary"><Stethoscope className="h-5 w-5 text-primary-foreground" /></div>
              <span className="text-xl font-bold text-foreground">MediBook</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Patient Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Fill in your details to get started</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5 rounded-xl border bg-card p-6 shadow-sm">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="tel" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-11 pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="h-11" />
            </div>
            <Button className="h-11 w-full" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login/patient" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground"><Link to="/register" className="hover:underline">← Back to register options</Link></p>
        </div>
      </div>
    </div>
  );
};

export default PatientRegister;
