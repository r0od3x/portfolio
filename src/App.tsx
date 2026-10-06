import { useEffect, useState } from "react";
import { useLenis } from "@/hooks/useLenis";
import { ScrollTrigger } from "@/lib/gsap";
import { Preloader } from "@/components/layout/Preloader";
import { Cursor } from "@/components/layout/Cursor";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Marquee } from "@/components/ui/Marquee";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Work } from "@/components/sections/Work";
import { Experience } from "@/components/sections/Experience";
import { Toolbox } from "@/components/sections/Toolbox";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { marqueeWords } from "@/data/content";

function App() {
  // ready: the preloader is lifting, page intros can start.
  // loading: the preloader is still mounted.
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  useLenis();

  useEffect(() => {
    if (!ready) return;
    // Re-measure once fonts have settled so pinned sections line up.
    let id = requestAnimationFrame(() => ScrollTrigger.refresh());
    document.fonts.ready.then(() => {
      id = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => cancelAnimationFrame(id);
  }, [ready]);

  return (
    <>
      {loading && <Preloader onReveal={() => setReady(true)} onDone={() => setLoading(false)} />}
      <div aria-hidden className="grain" />
      <ScrollProgress />
      <Cursor />
      <Navbar ready={ready} />
      <main>
        <Hero ready={ready} />
        <Marquee words={marqueeWords} />
        <About />
        <Work />
        <Experience />
        <Toolbox />
        <Education />
        <Contact />
      </main>
    </>
  );
}

export default App;
