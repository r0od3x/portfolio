import { useEffect, useState } from "react";
import { useLenis } from "@/hooks/useLenis";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useSpotlight } from "@/hooks/useSpotlight";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { VelocityMarquee } from "@/components/ui/VelocityMarquee";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Timeline } from "@/components/sections/Timeline";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { Certifications } from "@/components/sections/Certifications";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { ScrollTrigger } from "@/lib/gsap";

const MARQUEE_ROWS = [
  ["Deep Learning", "LLM Agents", "Computer Vision", "RAG", "Forecasting"],
  ["PyTorch", "LangGraph", "FastAPI", "PostgreSQL", "React", "Flutter"],
];

function App() {
  // ready: the preloader curtain is opening, page intros can start.
  // loading: the preloader is still mounted.
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  useLenis();
  useSpotlight();
  useScrollReveal([ready]);

  useEffect(() => {
    if (ready) {
      // Give the DOM a tick to paint before measuring trigger positions
      const id = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(id);
    }
  }, [ready]);

  return (
    <>
      {loading && (
        <Preloader onReveal={() => setReady(true)} onDone={() => setLoading(false)} />
      )}
      <div className="grain-bg relative">
        <ScrollProgress />
        <CustomCursor />
        <Navbar ready={ready} />
        <main>
          <Hero ready={ready} />
          <About />
          <VelocityMarquee rows={MARQUEE_ROWS} />
          <Timeline />
          <Projects />
          <TechStack />
          <Certifications />
          <Education />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
