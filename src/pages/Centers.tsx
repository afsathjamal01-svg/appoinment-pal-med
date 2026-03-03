import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { centers, doctors } from "@/data/mockData";
import { Star, MapPin, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Centers = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container py-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Medical Centers</h1>
        <p className="mt-1 text-muted-foreground">Find trusted medical centers near you</p>

        <div className="mt-8 grid gap-6">
          {centers.map((center) => {
            const centerDoctors = doctors.filter((d) => d.centerId === center.id);
            return (
              <div
                key={center.id}
                className="overflow-hidden rounded-xl border bg-card shadow-card transition-all hover:shadow-hover"
              >
                <div className="flex flex-col md:flex-row">
                  <img
                    src={center.image}
                    alt={center.name}
                    className="h-48 w-full object-cover md:h-auto md:w-64"
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{center.name}</h2>
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" /> {center.address}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        <span className="text-sm font-medium">{center.rating}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> {center.doctorCount} Doctors
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {center.workingHours}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {center.services.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>

                    {centerDoctors.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium text-muted-foreground">Top Doctors</p>
                        <div className="mt-1.5 flex gap-2">
                          {centerDoctors.map((d) => (
                            <Link
                              key={d.id}
                              to={`/doctor/${d.id}`}
                              className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors hover:border-primary/50"
                            >
                              <img
                                src={d.image}
                                alt={d.name}
                                className="h-6 w-6 rounded-full object-cover"
                              />
                              <span className="font-medium">{d.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Centers;
