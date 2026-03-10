import { Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t bg-muted/50">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">MediBook</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Your trusted platform for booking doctor appointments online.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">For Patients</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/find-doctors" className="hover:text-foreground">Find Doctors</Link></li>
            <li><Link to="/centers" className="hover:text-foreground">Medical Centers</Link></li>
            <li><Link to="/register" className="hover:text-foreground">Create Account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">For Doctors</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/register" className="hover:text-foreground">Join as Doctor</Link></li>
            <li><Link to="/register" className="hover:text-foreground">Register Center</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-foreground">Help Center</a></li>
            <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
        <Link to="/admin/login" className="hover:text-foreground">© 2026 MediBook</Link>. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
