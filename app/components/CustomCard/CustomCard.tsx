"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface ExpandableCardProps {
  title: string;
  subtitle?: string;
  image: string;
  description: string;
  tags?: string[];
  index?: number;
  onClick?: () => void;
}

export default function CustomCard({ title, subtitle, image, description, tags, index=0, onClick }: ExpandableCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({ });
  const cardRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    const fromLeft = index % 2 === 0;
    const sideOffset = fromLeft ? 80 : 80;

    const update = () => {
      if (!cardRef.current) return;
      const { top, height } = cardRef.current.getBoundingClientRect();
      const view = window.innerHeight;


      // Need start and exit position 
      const topShiftStart = (view * 0.35) - height; 
      const bottomShiftStart = (view * 0.65);

      let translateX: number;
      const speedX = 3; 

      if (top <= topShiftStart) {
        // Going in / out
        const step = (topShiftStart - top) / (topShiftStart - bottomShiftStart);
        translateX = sideOffset * step * speedX;
        setExpanded(false);
      } else if (top >= bottomShiftStart) {
        const step = (bottomShiftStart - top) / (bottomShiftStart - topShiftStart);
        //const step = (top - bottomShiftStart) / (bottomShiftStart - topShiftStart);
        translateX = sideOffset * step * speedX;
        setExpanded(false);
      } else {
        setExpanded(true);
        translateX = 0;
      }

      setCardStyle({ transform: `translateX(${translateX}px)` });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [index]);

  const handleClick = () => {
    setExpanded(!expanded);
    onClick?.();
  };

  return (
    <>
      {/* DEBUG: topShiftStart at 25vh */}
      <div style={{ position: "fixed", top: "35vh", left: 0, width: "100%", height: "2px", background: "red", zIndex: 9999, pointerEvents: "none" }} />
      {/* DEBUG: bottomShiftStart at 75vh */}
      <div style={{ position: "fixed", top: "65vh", left: 0, width: "100%", height: "2px", background: "blue", zIndex: 9999, pointerEvents: "none" }} />
    <div ref={cardRef} style={cardStyle}>
    <div
      className={`w-full border border-foreground/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
        expanded ? "bg-foreground/5" : "bg-background hover:border-foreground/40"
      }`}
      onClick={handleClick}
    >
      {/* Collapsed row */}
      <div className="flex items-center gap-4 px-6 py-6">
        <Image src={image} alt={title} width={48} height={48} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-foreground font-semibold truncate">{title}</h3>
          {subtitle && <p className="text-foreground/60 text-sm truncate">{subtitle}</p>}
        </div>
        <span className={`text-foreground/60 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
          ▾
        </span>
      </div>

      {/* Expanded content */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? "max-h-[600px]" : "max-h-0"}`}>
        <div className="flex flex-col md:flex-row border-t border-foreground/20">
          <div className="md:w-1/2">
            <Image src={image} alt={title} width={600} height={400} className="w-full h-56 md:h-72 object-cover" />
          </div>
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-foreground text-2xl font-bold mb-1">{title}</h2>
              {subtitle && <p className="text-foreground/60 text-sm mb-4">{subtitle}</p>}
              <p className="text-foreground/80 leading-relaxed">{description}</p>
            </div>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full border border-primary/40 text-primary">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
    </>
  );
}