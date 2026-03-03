import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, User } from "lucide-react";

const appointments = [
  {
    id: "1",
    doctor: "Dr. Priya Sharma",
    specialty: "Cardiologist",
    date: "Mar 5, 2026",
    time: "10:00 AM",
    status: "upcoming" as const,
    fee: 500,
  },
  {
    id: "2",
    doctor: "Dr. Ananya Patel",
    specialty: "Dermatologist",
    date: "Feb 28, 2026",
    time: "02:00 PM",
    status: "completed" as const,
    fee: 600,
  },
  {
    id: "3",
    doctor: "Dr. Rajesh Kumar",
    specialty: "General Physician",
    date: "Feb 15, 2026",
    time: "11:00 AM",
    status: "cancelled" as const,
    fee: 300,
  },
];

const statusColors = {
  upcoming: "bg-info text-info-foreground",
  completed: "bg-success text-success-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
};

const PatientDashboard = () => (
  <div className="min-h-screen">
    <Header />
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Manage your appointments and health records</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                <p className="mt-1 text-xs text-muted-foreground">
                  {apt.date} at {apt.time}
                </p>
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
    </div>
    <Footer />
  </div>
);

export default PatientDashboard;
