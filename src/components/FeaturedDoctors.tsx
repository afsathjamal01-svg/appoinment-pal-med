import { doctors } from "@/data/mockData";
import DoctorCard from "./DoctorCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedDoctors = () => (
  <section className="bg-muted/30 py-16">
    <div className="container">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Top Rated Doctors
          </h2>
          <p className="mt-2 text-muted-foreground">
            Highly recommended by our patients
          </p>
        </div>
        <Link to="/find-doctors">
          <Button variant="ghost" className="hidden sm:flex">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {doctors.slice(0, 3).map((doc) => (
          <DoctorCard key={doc.id} {...doc} />
        ))}
      </div>
      <div className="mt-6 text-center sm:hidden">
        <Link to="/find-doctors">
          <Button variant="outline">
            View All Doctors <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default FeaturedDoctors;
