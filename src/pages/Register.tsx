import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";

const Register = () => (
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
            <div className="mt-4 space-y-4 rounded-xl border bg-card p-6 shadow-card">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input type="tel" placeholder="+91 9876543210" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full">Create Account</Button>
            </div>
          </TabsContent>

          <TabsContent value="doctor">
            <div className="mt-4 space-y-4 rounded-xl border bg-card p-6 shadow-card">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Dr. Jane Smith" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="doctor@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Specialty</Label>
                <Input placeholder="e.g. Cardiologist" />
              </div>
              <div className="space-y-2">
                <Label>Experience (years)</Label>
                <Input type="number" placeholder="10" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full">Register as Doctor</Button>
            </div>
          </TabsContent>

          <TabsContent value="center">
            <div className="mt-4 space-y-4 rounded-xl border bg-card p-6 shadow-card">
              <div className="space-y-2">
                <Label>Center Name</Label>
                <Input placeholder="Apollo Medical Center" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="admin@center.com" />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input placeholder="Full address" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full">Register Center</Button>
            </div>
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

export default Register;
