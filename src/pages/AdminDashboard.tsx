import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, CalendarDays, IndianRupee, Percent, CheckCircle, XCircle, Stethoscope, LayoutDashboard, Settings, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const adminNav = [
  { label: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Doctors", path: "/admin/doctors", icon: Stethoscope },
  { label: "Centers", path: "/admin/centers", icon: Building2 },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Approvals", path: "/admin/approvals", icon: UserCheck },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

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

interface UserRow {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  roles: string[];
}

interface AppointmentRow {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  patient_name: string;
  doctor_name: string;
}

interface PaymentRow {
  id: string;
  total_amount: number;
  commission: number;
  net_amount: number;
  convenience_fee: number;
  payment_status: string;
  payout_status: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState({ patients: 0, doctors: 0, centers: 0, bookings: 0, revenue: 0 });
  const [pendingDoctors, setPendingDoctors] = useState<PendingDoctor[]>([]);
  const [pendingCenters, setPendingCenters] = useState<PendingCenter[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
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

    // Fetch users with roles
    const { data: allProfiles } = await supabase.from("profiles").select("id, full_name, email, phone, created_at").order("created_at", { ascending: false });
    if (allProfiles && allProfiles.length > 0) {
      const { data: allRoles } = await supabase.from("user_roles").select("user_id, role");
      const roleMap = new Map<string, string[]>();
      allRoles?.forEach((r) => {
        const existing = roleMap.get(r.user_id) ?? [];
        existing.push(r.role);
        roleMap.set(r.user_id, existing);
      });
      setUsers(allProfiles.map((p) => ({ ...p, roles: roleMap.get(p.id) ?? [] })));
    }

    // Fetch appointments with patient/doctor names
    const { data: appts } = await supabase
      .from("appointments")
      .select("id, appointment_date, appointment_time, status, notes, patient_id, doctor_id")
      .order("appointment_date", { ascending: false });
    
    if (appts && appts.length > 0) {
      const patientIds = [...new Set(appts.map((a) => a.patient_id))];
      const doctorIds = [...new Set(appts.map((a) => a.doctor_id))];
      
      const [{ data: patientProfiles }, { data: doctorRecords }] = await Promise.all([
        supabase.from("profiles").select("id, full_name").in("id", patientIds),
        supabase.from("doctors").select("id, user_id").in("id", doctorIds),
      ]);
      
      const patientMap = new Map(patientProfiles?.map((p) => [p.id, p.full_name]) ?? []);
      const doctorUserIds = doctorRecords?.map((d) => d.user_id) ?? [];
      const { data: doctorProfiles } = await supabase.from("profiles").select("id, full_name").in("id", doctorUserIds);
      const doctorUserMap = new Map(doctorRecords?.map((d) => [d.id, d.user_id]) ?? []);
      const doctorNameMap = new Map(doctorProfiles?.map((p) => [p.id, p.full_name]) ?? []);
      
      setAppointments(appts.map((a) => ({
        id: a.id,
        appointment_date: a.appointment_date,
        appointment_time: a.appointment_time,
        status: a.status,
        notes: a.notes,
        patient_name: patientMap.get(a.patient_id) ?? "Unknown",
        doctor_name: doctorNameMap.get(doctorUserMap.get(a.doctor_id) ?? "") ?? "Unknown",
      })));
    } else {
      setAppointments([]);
    }

    // Fetch payments
    const { data: payData } = await supabase
      .from("payments")
      .select("id, total_amount, commission, net_amount, convenience_fee, payment_status, payout_status, created_at")
      .order("created_at", { ascending: false });
    setPayments(payData ?? []);

    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

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

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed": case "completed": case "paid": return "default";
      case "pending": return "secondary";
      case "cancelled": case "failed": case "refunded": return "destructive";
      default: return "outline";
    }
  };

  const statCards = [
    { label: "Total Users", value: stats.patients.toLocaleString(), icon: Users },
    { label: "Total Doctors", value: stats.doctors.toLocaleString(), icon: Stethoscope },
    { label: "Medical Centers", value: stats.centers.toLocaleString(), icon: Building2 },
    { label: "Total Bookings", value: stats.bookings.toLocaleString(), icon: CalendarDays },
    { label: "Platform Revenue", value: formatCurrency(stats.revenue), icon: IndianRupee },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Platform overview and management" navItems={adminNav} accentColor="bg-destructive">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
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

      {/* Tabs for Users / Appointments / Payments / Approvals */}
      <Tabs defaultValue="users" className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="gap-1.5"><Users className="h-4 w-4" />Users</TabsTrigger>
          <TabsTrigger value="appointments" className="gap-1.5"><CalendarDays className="h-4 w-4" />Appointments</TabsTrigger>
          <TabsTrigger value="payments" className="gap-1.5"><IndianRupee className="h-4 w-4" />Payments</TabsTrigger>
          <TabsTrigger value="approvals" className="gap-1.5"><UserCheck className="h-4 w-4" />Approvals</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
            <CardContent>
              {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : users.length === 0 ? (
                <p className="text-sm text-muted-foreground">No users found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>{u.phone || "—"}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {u.roles.map((r) => (
                                <Badge key={r} variant="secondary" className="capitalize text-xs">{r}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(u.created_at).toLocaleDateString("en-IN")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader><CardTitle>All Appointments</CardTitle></CardHeader>
            <CardContent>
              {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No appointments yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell className="font-medium">{a.patient_name}</TableCell>
                          <TableCell>{a.doctor_name}</TableCell>
                          <TableCell>{new Date(a.appointment_date).toLocaleDateString("en-IN")}</TableCell>
                          <TableCell>{a.appointment_time}</TableCell>
                          <TableCell>
                            <Badge variant={statusColor(a.status)} className="capitalize">{a.status}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">{a.notes || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader><CardTitle>All Payments</CardTitle></CardHeader>
            <CardContent>
              {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payments yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Total</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Net</TableHead>
                        <TableHead>Fee</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Payout</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{formatCurrency(p.total_amount)}</TableCell>
                          <TableCell>{formatCurrency(p.commission)}</TableCell>
                          <TableCell>{formatCurrency(p.net_amount)}</TableCell>
                          <TableCell>{formatCurrency(p.convenience_fee)}</TableCell>
                          <TableCell>
                            <Badge variant={statusColor(p.payment_status)} className="capitalize">{p.payment_status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusColor(p.payout_status)} className="capitalize">{p.payout_status}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(p.created_at).toLocaleDateString("en-IN")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals">
          <Card>
            <CardHeader><CardTitle>Pending Approvals</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {!loading && pendingDoctors.length === 0 && pendingCenters.length === 0 && (
                <p className="text-sm text-muted-foreground">No pending approvals</p>
              )}
              {pendingDoctors.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{doc.profile?.full_name || "Unknown"}</p>
                      <Badge variant="secondary">Doctor</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{doc.specialization} · {doc.qualification}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="gap-1" onClick={() => approveDoctor(doc.id)}>
                      <CheckCircle className="h-3.5 w-3.5" /> Approve
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1 text-destructive" onClick={() => rejectDoctor(doc.id)}>
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
              {pendingCenters.map((center) => (
                <div key={center.id} className="flex items-center justify-between rounded-lg border p-4">
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
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
    </DashboardLayout>
  );
};

export default AdminDashboard;
