import { specialties } from "@/data/mockData";
import { Link } from "react-router-dom";
import {
  Stethoscope, Smile, Heart, Sparkles, Baby, Bone, Brain, Ear,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Stethoscope, Smile, Heart, Sparkles, Baby, Bone, Brain, Ear,
};

const SpecialtiesSection = () => (
  <section className="py-16">
    <div className="container">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          Browse by Specialty
        </h2>
        <p className="mt-2 text-muted-foreground">
          Find the right doctor for your needs
        </p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {specialties.map((s) => {
          const Icon = iconMap[s.icon] || Stethoscope;
          return (
            <Link
              key={s.id}
              to={`/find-doctors?specialty=${encodeURIComponent(s.name)}`}
              className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-4 shadow-card transition-all duration-300 hover:shadow-hover hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-foreground">{s.name}</p>
                <p className="text-[10px] text-muted-foreground">{s.count} doctors</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </section>
);

export default SpecialtiesSection;
