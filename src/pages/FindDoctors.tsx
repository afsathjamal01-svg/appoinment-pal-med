import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoctorCard from "@/components/DoctorCard";
import { doctors, specialties } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const FindDoctors = () => {
  const [searchParams] = useSearchParams();
  const initialSpecialty = searchParams.get("specialty") || "";
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty);

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const matchesQuery =
        !query ||
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.specialty.toLowerCase().includes(query.toLowerCase()) ||
        d.location.toLowerCase().includes(query.toLowerCase());
      const matchesSpecialty =
        !selectedSpecialty || d.specialty === selectedSpecialty;
      return matchesQuery && matchesSpecialty;
    });
  }, [query, selectedSpecialty]);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container py-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Find Doctors
        </h1>
        <p className="mt-1 text-muted-foreground">
          Browse and book appointments with verified doctors
        </p>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialty, location..."
              className="pl-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        {/* Specialty chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge
            variant={!selectedSpecialty ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedSpecialty("")}
          >
            All
          </Badge>
          {specialties.map((s) => (
            <Badge
              key={s.id}
              variant={selectedSpecialty === s.name ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedSpecialty(s.name === selectedSpecialty ? "" : s.name)}
            >
              {s.name}
            </Badge>
          ))}
        </div>

        {/* Results */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filtered.length > 0 ? (
            filtered.map((doc) => <DoctorCard key={doc.id} {...doc} />)
          ) : (
            <div className="col-span-2 py-16 text-center text-muted-foreground">
              No doctors found matching your criteria.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FindDoctors;
