"use client";

import { useState } from "react";
import Image from "next/image";

interface ExpandableCardProps {
  title: string;
  subtitle?: string;
  image: string;
  description: string;
  tags?: string[];
  resetExpanded?: boolean;
  onClick?: () => void;
}

export default function CustomCard({ title, subtitle, image, description, tags, resetExpanded, onClick }: ExpandableCardProps) {
  const [localExpanded, setLocalExpanded] = useState(false);
  const expanded = localExpanded && !resetExpanded;

  const handleClick = () => {
    setLocalExpanded(!localExpanded);
    onClick?.();
  };

  return (
    <div
      className={`w-full border border-primary/30 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
        expanded ? "bg-background border-primary/60" : "bg-background hover:border-primary/60"
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
  );
}
