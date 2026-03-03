import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, IndianRupee, Star, TrendingUp } from "lucide-react";

const DoctorDashboard = () => (
  <div className="min-h-screen">
    <Header />
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Welcome back, Dr. Priya Sharma</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Today's Appointments", value: "6", icon: CalendarDays, color: "text-primary" },
          { label: "Monthly Earnings", value: "₹45,000", icon: IndianRupee, color: "text-success" },
          { label: "Commission Deducted", value: "₹6,750", icon: TrendingUp, color: "text-accent" },
          { label: "Average Rating", value: "4.8", icon: Star, color: "text-warning" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold text-foreground">Today's Schedule</h2>
      <div className="mt-4 space-y-3">
        {[
          { patient: "Rahul Verma", time: "09:00 AM", status: "completed" },
          { patient: "Sneha Gupta", time: "09:30 AM", status: "completed" },
          { patient: "Amit Joshi", time: "10:30 AM", status: "in-progress" },
          { patient: "Priya Kapoor", time: "11:00 AM", status: "upcoming" },
          { patient: "Deepak Mehta", time: "02:00 PM", status: "upcoming" },
          { patient: "Neha Singh", time: "03:00 PM", status: "upcoming" },
        ].map((apt) => (
          <Card key={apt.time}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-foreground">{apt.patient}</p>
                <p className="text-sm text-muted-foreground">{apt.time}</p>
              </div>
              <Badge
                className={
                  apt.status === "completed"
                    ? "bg-success text-success-foreground"
                    : apt.status === "in-progress"
                    ? "bg-info text-info-foreground"
                    : "bg-secondary text-secondary-foreground"
                }
              >
                {apt.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

export default DoctorDashboard;
