'use client'

import { useRef } from 'react';
import ScrollAnimatedCard from './ScrollAnimatedCard';
import MeshBackground, { type MeshBackgroundHandle } from '@/app/components/MeshBackground';
import { useMeshMouseEffect } from '@/app/hooks/useMeshMouseEffect';
import Navbar from '@/app/components/Navbar/Navbar';

const projects = [
  {
    title: "My Project",
    image: "/images/blue.png",
    description: "A cool thing I built.",
    tags: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "My Project",
    image: "/images/blue.png",
    description: "A cool thing I built.",
  },
  {
    title: "My Project",
    image: "/images/blue.png",
    description: "A cool thing I built.",
  },
  {
    title: "My Project",
    image: "/images/blue.png",
    description: "A cool thing I built.",
  },
  {
    title: "My Project",
    image: "/images/blue.png",
    description: "A cool thing I built.",
  },
  {
    title: "My Project",
    image: "/images/blue.png",
    description: "A cool thing I built.",
  }
];

export default function Projects() {
  const meshRef = useRef<MeshBackgroundHandle>(null);
  useMeshMouseEffect(meshRef, { radius: 250, strength: 4, sizeBoost: 4 });

  return (
    <>
      <MeshBackground ref={meshRef} numNodesX={75} numNodesY={40} nodeSize={0.5} nodeColor="#3b82f6" />
      <div className="relative z-10">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl text-align-center mb-4">My Projects</h1>
          <p>This is the projects page.</p>

          <div className="row-column grid gap-15 mt-10">
            {projects.map((project, index) => (
              <ScrollAnimatedCard key={index} index={index} {...project} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
