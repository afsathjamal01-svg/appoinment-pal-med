import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Heart, LayoutDashboard, Search, Settings, User } from "lucide-react";

const patientNav = [
  { label: "Overview", path: "/patient/dashboard", icon: LayoutDashboard },
  { label: "Appointments", path: "/patient/appointments", icon: CalendarDays },
  { label: "Find Doctors", path: "/find-doctors", icon: Search },
  { label: "Health Records", path: "/patient/records", icon: Heart },
  { label: "Settings", path: "/patient/settings", icon: Settings },
];

const appointments = [
  { id: "1", doctor: "Dr. Priya Sharma", specialty: "Cardiologist", date: "Mar 5, 2026", time: "10:00 AM", status: "upcoming" as const, fee: 500 },
  { id: "2", doctor: "Dr. Ananya Patel", specialty: "Dermatologist", date: "Feb 28, 2026", time: "02:00 PM", status: "completed" as const, fee: 600 },
  { id: "3", doctor: "Dr. Rajesh Kumar", specialty: "General Physician", date: "Feb 15, 2026", time: "11:00 AM", status: "cancelled" as const, fee: 300 },
];

const statusColors = {
  upcoming: "bg-primary text-primary-foreground",
  completed: "bg-secondary text-secondary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
};

const PatientDashboard = () => (
  <DashboardLayout title="My Dashboard" subtitle="Manage your appointments and health records" navItems={patientNav} accentColor="bg-primary">
    {/* Stats */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[
        { label: "Upcoming", value: "1", icon: CalendarDays },
        { label: "Completed", value: "8", icon: Clock },
        { label: "Total Spent", value: "₹4,200", icon: User },
      ].map((s) => (
        <Card key={s.label}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <s.icon className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Appointments */}
    <h2 className="mt-8 text-lg font-semibold text-foreground">Appointments</h2>
    <div className="mt-4 space-y-3">
      {appointments.map((apt) => (
        <Card key={apt.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold text-foreground">{apt.doctor}</p>
              <p className="text-sm text-muted-foreground">{apt.specialty}</p>
              <p className="mt-1 text-xs text-muted-foreground">{apt.date} at {apt.time}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={statusColors[apt.status]}>{apt.status}</Badge>
              <span className="font-semibold text-foreground">₹{apt.fee}</span>
              {apt.status === "upcoming" && (
                <Button size="sm" variant="outline">Cancel</Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </DashboardLayout>
);

export default PatientDashboard;
