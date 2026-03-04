import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Stethoscope, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Patient fields
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientPassword, setPatientPassword] = useState("");

  // Doctor fields
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");
  const [doctorExperience, setDoctorExperience] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");

  // Center fields
  const [centerName, setCenterName] = useState("");
  const [centerEmail, setCenterEmail] = useState("");
  const [centerAddress, setCenterAddress] = useState("");
  const [centerPassword, setCenterPassword] = useState("");

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: "patient" | "doctor" | "center",
    extraData?: Record<string, unknown>
  ) => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setLoading(false);
      return;
    }

    // Update profile with phone if provided
    if (extraData?.phone) {
      await supabase.from("profiles").update({ phone: extraData.phone as string }).eq("id", userId);
    }

    // Add role (trigger already adds 'patient', so for non-patient we add the new role)
    if (role !== "patient") {
      await supabase.from("user_roles").insert({ user_id: userId, role });
    }

    // Create doctor or center record
    if (role === "doctor") {
      await supabase.from("doctors").insert({
        user_id: userId,
        specialization: (extraData?.specialization as string) || "",
        experience: Number(extraData?.experience) || 0,
      });
    }

    if (role === "center") {
      await supabase.from("centers").insert({
        owner_id: userId,
        name: (extraData?.centerName as string) || fullName,
        address: (extraData?.address as string) || "",
        email,
      });
    }

    toast({
      title: "Account created!",
      description: "Please check your email to verify your account, then log in.",
    });

    navigate("/login");
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container flex min-h-[calc(100vh-12rem)] items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-foreground">Create Account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Join MediBook today</p>
          </div>

          <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="doctor">Doctor</TabsTrigger>
              <TabsTrigger value="center">Center</TabsTrigger>
            </TabsList>

            <TabsContent value="patient">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  signUp(patientEmail, patientPassword, patientName, "patient", { phone: patientPhone });
                }}
                className="mt-4 space-y-4 rounded-xl border bg-card p-6 shadow-card"
              >
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="John Doe" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="you@example.com" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input type="tel" placeholder="+91 9876543210" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" value={patientPassword} onChange={(e) => setPatientPassword(e.target.value)} required minLength={6} />
                </div>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Create Account
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="doctor">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  signUp(doctorEmail, doctorPassword, doctorName, "doctor", {
                    specialization: doctorSpecialty,
                    experience: doctorExperience,
                  });
                }}
                className="mt-4 space-y-4 rounded-xl border bg-card p-6 shadow-card"
              >
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="Dr. Jane Smith" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="doctor@example.com" value={doctorEmail} onChange={(e) => setDoctorEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Specialty</Label>
                  <Input placeholder="e.g. Cardiologist" value={doctorSpecialty} onChange={(e) => setDoctorSpecialty(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Experience (years)</Label>
                  <Input type="number" placeholder="10" value={doctorExperience} onChange={(e) => setDoctorExperience(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" value={doctorPassword} onChange={(e) => setDoctorPassword(e.target.value)} required minLength={6} />
                </div>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Register as Doctor
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="center">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  signUp(centerEmail, centerPassword, centerName, "center", {
                    centerName,
                    address: centerAddress,
                  });
                }}
                className="mt-4 space-y-4 rounded-xl border bg-card p-6 shadow-card"
              >
                <div className="space-y-2">
                  <Label>Center Name</Label>
                  <Input placeholder="Apollo Medical Center" value={centerName} onChange={(e) => setCenterName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="admin@center.com" value={centerEmail} onChange={(e) => setCenterEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input placeholder="Full address" value={centerAddress} onChange={(e) => setCenterAddress(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" placeholder="••••••••" value={centerPassword} onChange={(e) => setCenterPassword(e.target.value)} required minLength={6} />
                </div>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Register Center
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Log In</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
