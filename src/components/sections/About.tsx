import { useEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpinningBadge } from "@/components/ui/SpinningBadge";
import { Badge } from "@/components/ui/Badge";
import { profile } from "@/data/content";
import { GraduationCap, MapPin, Languages, Trophy, ArrowDownRight } from "lucide-react";

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy || prefersReducedMotion()) return;

    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      // Words brighten one by one as the reader scrolls through the copy.
      split = SplitText.create(copy.querySelectorAll("p"), { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.18 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: copy, start: "top 80%", end: "bottom 55%", scrub: 0.5 },
        }
      );

      gsap.from(".about-card", {
        y: 70,
        rotateX: -35,
        autoAlpha: 0,
        transformPerspective: 900,
        transformOrigin: "50% 0%",
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ".about-cards", start: "top 85%", once: true },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="container-px mx-auto max-w-7xl py-32 md:py-40">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              eyebrow="About"
              title="Engineering discipline, applied to intelligent systems."
            />
            <SpinningBadge
              text="Open to work · AI / ML · Data · "
              className="reveal-fade mt-14 hidden w-40 lg:block"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-tertiary text-surface">
                <ArrowDownRight size={22} />
              </span>
            </SpinningBadge>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div ref={copyRef} className="space-y-6 font-sans text-lg leading-relaxed text-on-surface-variant md:text-xl">
            <p>
              I'm {profile.firstName}, an engineering student in{" "}
              <span className="text-on-surface">Artificial Intelligence &amp; Data Science</span>{" "}
              at EMSI Casablanca. I like taking a model past the notebook stage: an API
              behind it, an interface in front of it, and a data pipeline that keeps it
              honest.
            </p>
            <p>
              I've done that in three industry internships. At{" "}
              <span className="text-on-surface">Crédit du Maroc</span> I forecast cash flows,
              at <span className="text-on-surface">GPC</span> I automated ETL and OCR pipelines
              for a manufacturer, and at <span className="text-on-surface">FedEx</span> I built
              HR analytics. My own projects range from a food-recognition model that beats
              Google Research's published Nutrition5K baseline to multi-agent LLM systems
              built with LangGraph.
            </p>
            <p>
              Away from the keyboard I'm a judoka and certified judo referee. I took 2nd
              place at the national Coupe du Trône in 2024. I've also built software for my
              dojo and for iaido tournaments, and I helped organize EMSI's 11th Careers Forum.
            </p>
          </div>

          <div className="about-cards spotlight-group mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InfoCard icon={<MapPin size={16} />} label="Location" value={profile.location} />
            <InfoCard
              icon={<GraduationCap size={16} />}
              label="Education"
              value={`${profile.school}, ${profile.education}`}
            />
            <InfoCard
              icon={<Trophy size={16} />}
              label="Beyond code"
              value="Judoka & referee, 2nd at the national Coupe du Trône 2024"
            />
            <div className="about-card spotlight rounded-lg border border-outline-variant bg-surface-container p-6">
              <div className="mb-3 flex items-center gap-2 text-on-surface-faint">
                <Languages size={16} />
                <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
                  Languages
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((l) => (
                  <Badge key={l.name} tone="outline">
                    {l.name} · {l.level}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="about-card spotlight rounded-lg border border-outline-variant bg-surface-container p-6">
      <div className="mb-3 flex items-center gap-2 text-on-surface-faint">
        {icon}
        <span className="font-mono text-[11px] uppercase tracking-[0.14em]">{label}</span>
      </div>
      <p className="text-sm leading-relaxed text-on-surface">{value}</p>
    </div>
  );
}