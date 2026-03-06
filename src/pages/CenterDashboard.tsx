import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CalendarDays, IndianRupee, TrendingUp, LayoutDashboard, Stethoscope, Settings, Building2 } from "lucide-react";

const centerNav = [
  { label: "Overview", path: "/center/dashboard", icon: LayoutDashboard },
  { label: "Doctors", path: "/center/doctors", icon: Stethoscope },
  { label: "Bookings", path: "/center/bookings", icon: CalendarDays },
  { label: "Earnings", path: "/center/earnings", icon: IndianRupee },
  { label: "Settings", path: "/center/settings", icon: Settings },
];

const CenterDashboard = () => (
  <DashboardLayout title="Center Dashboard" subtitle="Apollo Medical Center" navItems={centerNav} accentColor="bg-primary">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        { label: "Total Doctors", value: "25", icon: Users },
        { label: "Total Bookings", value: "342", icon: CalendarDays },
        { label: "Revenue (This Month)", value: "₹2,50,000", icon: IndianRupee },
        { label: "Platform Commission", value: "₹37,500", icon: TrendingUp },
      ].map((s) => (
        <Card key={s.label}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <s.icon className="h-5 w-5 text-primary" />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{s.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <h2 className="mt-8 text-lg font-semibold text-foreground">Doctors</h2>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {[
        { name: "Dr. Priya Sharma", specialty: "Cardiologist", bookings: 45, earnings: "₹22,500" },
        { name: "Dr. Vikram Singh", specialty: "Orthopedic", bookings: 38, earnings: "₹30,400" },
      ].map((d) => (
        <Card key={d.name}>
          <CardContent className="p-4">
            <p className="font-semibold text-foreground">{d.name}</p>
            <p className="text-sm text-muted-foreground">{d.specialty}</p>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">{d.bookings} bookings</span>
              <span className="font-medium text-foreground">{d.earnings}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </DashboardLayout>
);

export default CenterDashboard;
