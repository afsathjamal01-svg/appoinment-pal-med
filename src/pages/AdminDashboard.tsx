import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, CalendarDays, IndianRupee, Percent, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => (
  <div className="min-h-screen">
    <Header />
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Platform overview and management</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: "Total Patients", value: "15,000", icon: Users },
          { label: "Total Doctors", value: "500", icon: Users },
          { label: "Medical Centers", value: "50", icon: Building2 },
          { label: "Total Bookings", value: "25,000", icon: CalendarDays },
          { label: "Platform Revenue", value: "₹12,50,000", icon: IndianRupee },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <s.icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-xl font-bold text-foreground">{s.value}</p>
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
        {[
          { name: "Dr. Kavita Jain", type: "Doctor", specialty: "ENT Specialist", location: "Pune" },
          { name: "HealthFirst Clinic", type: "Center", specialty: "Multi-specialty", location: "Kolkata" },
        ].map((item) => (
          <Card key={item.name}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <Badge variant="secondary">{item.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.specialty} · {item.location}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="outline" className="gap-1 text-destructive">
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

export default AdminDashboard;
