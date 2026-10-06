import { useEffect, useRef } from "react";
import * as THREE from "three";

export function useMouseField() {
  const mouse = useRef(new THREE.Vector2(1000, 1000));

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouse.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };

    const leave = () => {
      mouse.current.set(1000, 1000);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, []);

  return mouse;
}