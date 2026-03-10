import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
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

    // Verify admin role
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);

    const userRoles = rolesData?.map((r) => r.role) ?? [];

    if (!userRoles.includes("admin")) {
      await supabase.auth.signOut();
      toast({
        title: "Access denied",
        description: "This login is restricted to administrators only.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    navigate("/admin/dashboard");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="w-full max-w-md px-4">
        {/* Admin branding card */}
        <div className="rounded-2xl border bg-card shadow-lg">
          {/* Header */}
          <div className="flex flex-col items-center gap-3 rounded-t-2xl bg-destructive px-6 py-8 text-destructive-foreground">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive-foreground/20">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-sm text-destructive-foreground/80">
              MediBook Administration Console
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5 px-6 py-8">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@medibook.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <Button className="h-11 w-full bg-destructive hover:bg-destructive/90" type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
              Sign In as Admin
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Not an admin?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Go to user login
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">← Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
