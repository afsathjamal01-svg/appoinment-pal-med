import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import SpecialtiesSection from "@/components/SpecialtiesSection";
import FeaturedDoctors from "@/components/FeaturedDoctors";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <SpecialtiesSection />
      <FeaturedDoctors />

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl gradient-primary p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
              Are You a Doctor or Medical Center?
            </h2>
            <p className="mt-3 text-primary-foreground/80">
              Join MediBook to grow your practice and reach thousands of patients.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/90">
              {["Easy Registration", "Manage Appointments", "Grow Your Practice"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" /> {item}
                </span>
              ))}
            </div>
            <div className="mt-8 flex justify-center gap-3">
              <Link to="/register">
                <Button size="lg" variant="secondary">
                  Register as Doctor
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Register Center
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
