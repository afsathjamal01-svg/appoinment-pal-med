import { Star, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  fee: number;
  rating: number;
  reviews: number;
  image: string;
  location: string;
  available: boolean;
  centerName?: string | null;
}

const DoctorCard = ({
  id, name, specialty, experience, fee, rating, reviews, image, location, available, centerName,
}: DoctorCardProps) => (
  <div className="group overflow-hidden rounded-xl border bg-card shadow-card transition-all duration-300 hover:shadow-hover">
    <div className="flex flex-col sm:flex-row">
      <div className="relative h-48 w-full sm:h-auto sm:w-40">
        <img src={image} alt={name} className="h-full w-full object-cover" />
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
            <span className="rounded-full bg-background px-3 py-1 text-xs font-medium">Unavailable</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{name}</h3>
              <p className="text-sm text-primary">{specialty}</p>
            </div>
            <div className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              <span className="text-xs font-medium">{rating}</span>
              <span className="text-xs text-muted-foreground">({reviews})</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {experience} yrs exp
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {location}
            </span>
          </div>
          {centerName && (
            <Badge variant="secondary" className="mt-2 text-xs">{centerName}</Badge>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-foreground">₹{fee}</p>
          <Link to={`/doctor/${id}`}>
            <Button size="sm" disabled={!available}>
              {available ? "Book Now" : "Unavailable"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default DoctorCard;
