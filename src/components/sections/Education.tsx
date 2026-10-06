import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { educationEntries, educationFocus } from "@/data/content";
import { GraduationCap } from "lucide-react";

export function Education() {
  const [main, ...rest] = educationEntries;

  return (
    <section id="education" className="container-px mx-auto max-w-7xl py-32 md:py-40">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Education" title="Formal training, engineering focus." />
        </div>

        <div className="spotlight reveal-fade rounded-lg border border-outline-variant bg-surface-container p-8 lg:col-span-7 md:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-outline-variant text-tertiary">
                <GraduationCap size={20} />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-on-surface">{main.school}</h3>
                <p className="text-sm text-on-surface-faint">{main.title}</p>
              </div>
            </div>
            <Badge tone="accent">{main.period}</Badge>
          </div>

          {main.detail && (
            <p className="mt-6 text-sm leading-relaxed text-on-surface-variant">{main.detail}</p>
          )}

          <div className="mt-8 border-t border-outline-variant pt-8">
            <p className="eyebrow mb-4">Focus areas</p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {educationFocus.map((area) => (
                <li key={area} className="flex gap-3 text-sm text-on-surface-variant">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-tertiary" />
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {rest.map((entry) => (
            <div
              key={entry.title}
              className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant pt-8"
            >
              <div>
                <p className="text-sm font-semibold text-on-surface">{entry.title}</p>
                <p className="text-xs text-on-surface-faint">{entry.school}</p>
              </div>
              <Badge tone="outline">{entry.period}</Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
