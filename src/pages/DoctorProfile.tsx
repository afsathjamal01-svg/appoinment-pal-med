import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";
import { doctors } from "@/data/mockData";
import { Star, MapPin, Clock, GraduationCap, Building2, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format, addDays } from "date-fns";
import { toast } from "@/hooks/use-toast";

const DoctorProfile = () => {
  const { id } = useParams();
  const doctor = doctors.find((d) => d.id === id);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!doctor) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container py-20 text-center text-muted-foreground">
          Doctor not found.
        </div>
        <Footer />
      </div>
    );
  }

  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const handleBook = () => {
    if (!selectedSlot) return;
    toast({
      title: "Appointment Booked!",
      description: `Your appointment with ${doctor.name} on ${format(dates[selectedDate], "MMM d")} at ${selectedSlot} has been confirmed.`,
    });
    setSelectedSlot(null);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-6 sm:flex-row">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="h-40 w-40 rounded-2xl object-cover shadow-elevated"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">{doctor.name}</h1>
                <p className="text-primary">{doctor.specialty}</p>
                <p className="mt-1 text-sm text-muted-foreground">{doctor.qualifications}</p>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <strong className="text-foreground">{doctor.rating}</strong> ({doctor.reviews} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {doctor.experience} yrs experience
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {doctor.location}
                  </span>
                </div>

                {doctor.centerName && (
                  <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{doctor.centerName}</span>
                  </div>
                )}

                <div className="mt-4">
                  <span className="text-2xl font-bold text-foreground">₹{doctor.fee}</span>
                  <span className="text-sm text-muted-foreground"> / consultation</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground">About</h2>
              <p className="mt-2 text-muted-foreground">{doctor.about}</p>
            </div>

            <div className="mt-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <GraduationCap className="h-5 w-5" /> Qualifications
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {doctor.qualifications.split(", ").map((q) => (
                  <Badge key={q} variant="secondary">{q}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Panel */}
          <div className="rounded-xl border bg-card p-6 shadow-card lg:sticky lg:top-24 lg:self-start">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <CalendarDays className="h-5 w-5 text-primary" /> Book Appointment
            </h3>

            {/* Date selection */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {dates.map((date, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedDate(i); setSelectedSlot(null); }}
                  className={`flex min-w-[60px] flex-col items-center rounded-lg border p-2 text-xs transition-colors ${
                    selectedDate === i
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:border-primary/50"
                  }`}
                >
                  <span className="font-medium">{format(date, "EEE")}</span>
                  <span className="text-lg font-bold">{format(date, "d")}</span>
                  <span>{format(date, "MMM")}</span>
                </button>
              ))}
            </div>

            {/* Time slots */}
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Available Slots</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {doctor.slots.length > 0 ? (
                  doctor.slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`rounded-md border px-2 py-2 text-xs font-medium transition-colors ${
                        !slot.available
                          ? "cursor-not-allowed bg-muted text-muted-foreground/50 line-through"
                          : selectedSlot === slot.time
                          ? "border-primary bg-primary text-primary-foreground"
                          : "hover:border-primary/50"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))
                ) : (
                  <p className="col-span-3 py-4 text-center text-sm text-muted-foreground">
                    No slots available
                  </p>
                )}
              </div>
            </div>

            {selectedSlot && (
              <div className="mt-4 rounded-lg bg-secondary p-3 text-sm">
                <p className="text-secondary-foreground">
                  <strong>{format(dates[selectedDate], "EEEE, MMM d")}</strong> at{" "}
                  <strong>{selectedSlot}</strong>
                </p>
                <p className="text-muted-foreground">Consultation Fee: ₹{doctor.fee}</p>
              </div>
            )}

            <Button
              className="mt-4 w-full"
              size="lg"
              disabled={!selectedSlot}
              onClick={handleBook}
            >
              Confirm Booking — ₹{doctor.fee}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorProfile;
