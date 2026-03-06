import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, CalendarDays, IndianRupee, Percent, CheckCircle, XCircle, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PendingDoctor {
  id: string;
  specialization: string;
  qualification: string;
  user_id: string;
  profile?: { full_name: string; email: string } | null;
}

interface PendingCenter {
  id: string;
  name: string;
  address: string;
  owner_id: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    centers: 0,
    bookings: 0,
    revenue: 0,
  });
  const [pendingDoctors, setPendingDoctors] = useState<PendingDoctor[]>([]);
  const [pendingCenters, setPendingCenters] = useState<PendingCenter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [patientsRes, doctorsRes, centersRes, bookingsRes, paymentsRes, pendingDocRes, pendingCenRes] =
      await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("doctors").select("id", { count: "exact", head: true }),
        supabase.from("centers").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("total_amount"),
        supabase.from("doctors").select("id, specialization, qualification, user_id").eq("is_approved", false),
        supabase.from("centers").select("id, name, address, owner_id").eq("is_approved", false),
      ]);

    const revenue = paymentsRes.data?.reduce((sum, p) => sum + Number(p.total_amount), 0) ?? 0;

    setStats({
      patients: patientsRes.count ?? 0,
      doctors: doctorsRes.count ?? 0,
      centers: centersRes.count ?? 0,
      bookings: bookingsRes.count ?? 0,
      revenue,
    });

    // Fetch profiles for pending doctors
    const docs = pendingDocRes.data ?? [];
    if (docs.length > 0) {
      const profileIds = docs.map((d) => d.user_id);
      const { data: profiles } = await supabase.from("profiles").select("id, full_name, email").in("id", profileIds);
      const profileMap = new Map(profiles?.map((p) => [p.id, p]));
      setPendingDoctors(docs.map((d) => ({ ...d, profile: profileMap.get(d.user_id) })));
    } else {
      setPendingDoctors([]);
    }

    setPendingCenters(pendingCenRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveDoctor = async (id: string) => {
    const { error } = await supabase.from("doctors").update({ is_approved: true }).eq("id", id);
    if (error) return toast.error("Failed to approve doctor");
    toast.success("Doctor approved");
    fetchData();
  };

  const rejectDoctor = async (id: string) => {
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (error) return toast.error("Failed to reject doctor");
    toast.success("Doctor rejected");
    fetchData();
  };

  const approveCenter = async (id: string) => {
    const { error } = await supabase.from("centers").update({ is_approved: true }).eq("id", id);
    if (error) return toast.error("Failed to approve center");
    toast.success("Center approved");
    fetchData();
  };

  const rejectCenter = async (id: string) => {
    const { error } = await supabase.from("centers").delete().eq("id", id);
    if (error) return toast.error("Failed to reject center");
    toast.success("Center rejected");
    fetchData();
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  const statCards = [
    { label: "Total Users", value: stats.patients.toLocaleString(), icon: Users },
    { label: "Total Doctors", value: stats.doctors.toLocaleString(), icon: Stethoscope },
    { label: "Medical Centers", value: stats.centers.toLocaleString(), icon: Building2 },
    { label: "Total Bookings", value: stats.bookings.toLocaleString(), icon: CalendarDays },
    { label: "Platform Revenue", value: formatCurrency(stats.revenue), icon: IndianRupee },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container py-8">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Platform overview and management</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <s.icon className="h-5 w-5 text-primary" />
                <p className="mt-2 text-xl font-bold text-foreground">{loading ? "…" : s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Commission Settings */}
        <h2 className="mt-8 text-lg font-semibold text-foreground">
          <Percent className="mr-2 inline h-5 w-5" />
          Commission Settings
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Standard Commission", value: "15%", desc: "Applied to all bookings" },
            { label: "Premium Doctor Rate", value: "10%", desc: "For subscribed doctors" },
            { label: "Patient Booking Fee", value: "₹20", desc: "Per appointment" },
          ].map((c) => (
            <Card key={c.label}>
              <CardContent className="p-4">
                <p className="text-2xl font-bold text-primary">{c.value}</p>
                <p className="font-medium text-foreground">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending Approvals */}
        <h2 className="mt-8 text-lg font-semibold text-foreground">Pending Approvals</h2>
        <div className="mt-4 space-y-3">
          {!loading && pendingDoctors.length === 0 && pendingCenters.length === 0 && (
            <p className="text-sm text-muted-foreground">No pending approvals</p>
          )}

          {pendingDoctors.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{doc.profile?.full_name || "Unknown"}</p>
                    <Badge variant="secondary">Doctor</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {doc.specialization} · {doc.qualification}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="gap-1" onClick={() => approveDoctor(doc.id)}>
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-destructive" onClick={() => rejectDoctor(doc.id)}>
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {pendingCenters.map((center) => (
            <Card key={center.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{center.name}</p>
                    <Badge variant="secondary">Center</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{center.address}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="gap-1" onClick={() => approveCenter(center.id)}>
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-destructive" onClick={() => rejectCenter(center.id)}>
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
