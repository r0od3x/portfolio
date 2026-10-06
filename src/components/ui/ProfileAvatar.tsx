import { useEffect, useRef } from "react";
import { gsap, isTouchDevice, prefersReducedMotion } from "@/lib/gsap";
import { profile } from "@/data/content";

type ProfileAvatarProps = {
  className?: string;
  /** Play the materialize-in entrance once this is true. */
  play?: boolean;
  delay?: number;
  status?: boolean;
};

/**
 * GitHub avatar inside a spinning violet -> blue -> cyan ring, matching the
 * gradient on github.com/r0od3x.
 */
export function ProfileAvatar({ className = "", play = true, delay = 0, status = true }: ProfileAvatarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const spinRef = useRef<gsap.core.Tween | null>(null);

  // Hidden until the entrance plays.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.set(rootRef.current, { autoAlpha: 0 });
    spinRef.current = gsap.to(ringRef.current, { rotate: 360, duration: 6, ease: "none", repeat: -1 });
    return () => {
      spinRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (!play || prefersReducedMotion()) return;
    const statusDot = rootRef.current?.querySelector(".avatar-status") ?? [];
    const tl = gsap
      .timeline({ delay })
      .set(rootRef.current, { autoAlpha: 1 })
      .from(ringRef.current, { scale: 0, duration: 1, ease: "expo.out" })
      // The portrait "materializes": a blurred, oversaturated blob that
      // snaps into focus, echoing the pixel-art style.
      .fromTo(
        imgRef.current,
        { clipPath: "circle(0% at 50% 50%)", filter: "blur(14px) saturate(2.2)", scale: 1.25 },
        {
          clipPath: "circle(50% at 50% 50%)",
          filter: "blur(0px) saturate(1)",
          scale: 1,
          duration: 1.1,
          ease: "expo.out",
          clearProps: "filter",
        },
        0.15
      )
      .from(statusDot, { scale: 0, duration: 0.6, ease: "back.out(3)" }, "-=0.4");
    return () => {
      tl.kill();
    };
  }, [play, delay]);

  const onEnter = () => {
    if (isTouchDevice() || prefersReducedMotion()) return;
    gsap.to(spinRef.current, { timeScale: 4, duration: 0.4 });
    gsap.to(imgRef.current, { scale: 1.08, duration: 0.6, ease: "expo.out" });
  };
  const onLeave = () => {
    gsap.to(spinRef.current, { timeScale: 1, duration: 1.2 });
    gsap.to(imgRef.current, { scale: 1, duration: 0.8, ease: "expo.out" });
  };

  return (
    <div
      ref={rootRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`relative aspect-square ${className}`}
    >
      {/* Soft glow behind the ring */}
      <div
        aria-hidden
        className="absolute -inset-[18%] rounded-full opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-accent-deep) 55%, transparent), color-mix(in srgb, var(--color-secondary) 15%, transparent) 55%, transparent 72%)",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, var(--color-tertiary), var(--color-accent-blue), var(--color-secondary), transparent 70%, var(--color-tertiary))",
        }}
      />
      <div className="absolute inset-[3px] overflow-hidden rounded-full bg-surface p-[3px]">
        <img
          ref={imgRef}
          src="/avatar.webp"
          alt={`${profile.name}, pixel-art portrait`}
          width={460}
          height={460}
          decoding="async"
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      {status && (
        <span
          className="avatar-status absolute bottom-[6%] right-[6%] flex h-[14%] w-[14%] items-center justify-center rounded-full bg-surface"
          title="Open to opportunities"
        >
          <span className="absolute h-[62%] w-[62%] animate-ping rounded-full bg-success opacity-50" />
          <span className="relative h-[62%] w-[62%] rounded-full bg-success" />
        </span>
      )}
    </div>
  );
}
