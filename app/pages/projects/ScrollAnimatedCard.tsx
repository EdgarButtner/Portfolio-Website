"use client";

import { useEffect, useRef } from "react";
import CustomCard from "@/app/components/CustomCard/CustomCard";

interface ScrollAnimatedCardProps {
  title: string;
  subtitle?: string;
  image: string;
  description: string;
  tags?: string[];
  index?: number;
  onClick?: () => void;
}

export default function ScrollAnimatedCard({ index = 0, ...cardProps }: ScrollAnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sideOffset = 80;
    const speedX = 3;

    const update = () => {
      if (!cardRef.current) return;
      const { top, height } = cardRef.current.getBoundingClientRect();
      const view = window.innerHeight;

      const topShiftStart = view * 0.35 - height;
      const bottomShiftStart = view * 0.65;

      let translateX: number;

      if (top <= topShiftStart) {
        const step = (topShiftStart - top) / (topShiftStart - bottomShiftStart);
        translateX = sideOffset * step * speedX;
      } else if (top >= bottomShiftStart) {
        const step = (bottomShiftStart - top) / (bottomShiftStart - topShiftStart);
        translateX = sideOffset * step * speedX;
      } else {
        translateX = 0;
      }

      cardRef.current.style.transform = `translateX(${translateX}px)`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [index]);

  return (
    <div ref={cardRef} style={{ willChange: "transform" }}>
      <CustomCard {...cardProps} />
    </div>
  );
}
