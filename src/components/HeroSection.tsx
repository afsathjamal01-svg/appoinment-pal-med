import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { stats } from "@/data/mockData";

const HeroSection = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    navigate(`/find-doctors?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="container relative z-10 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="animate-fade-in text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Find & Book
            <span className="text-primary"> Doctor Appointments</span>
            {" "}Instantly
          </h1>
          <p className="mt-4 animate-fade-in text-lg text-muted-foreground [animation-delay:100ms]">
            Search from {stats.totalDoctors}+ verified doctors across {stats.totalCenters}+ medical centers. Book your appointment in seconds.
          </p>

          <div className="mt-8 flex animate-fade-in flex-col gap-3 sm:flex-row [animation-delay:200ms]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search doctors, specialties..."
                className="h-12 pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="relative flex-1 sm:max-w-[200px]">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Location" className="h-12 pl-10" />
            </div>
            <Button className="h-12 px-8" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-3xl animate-fade-in grid-cols-2 gap-6 [animation-delay:400ms] md:grid-cols-4">
          {[
            { label: "Doctors", value: `${stats.totalDoctors}+` },
            { label: "Centers", value: `${stats.totalCenters}+` },
            { label: "Bookings", value: "25K+" },
            { label: "Patients", value: "15K+" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-card p-4 text-center shadow-card">
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
