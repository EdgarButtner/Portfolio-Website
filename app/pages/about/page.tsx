'use client';

import { useRef } from 'react';
import MeshBackground, { type MeshBackgroundHandle } from '@/app/components/MeshBackground';
import { useMeshMouseEffect } from '@/app/hooks/useMeshMouseEffect';
import Navbar from '@/app/components/Navbar/Navbar';


export default function About() {
  const meshRef = useRef<MeshBackgroundHandle>(null);
  useMeshMouseEffect(meshRef, { radius: 250, strength: 4, sizeBoost: 4 });

  return (
    <>
      <MeshBackground ref={meshRef} numNodesX={75} numNodesY={40} nodeSize={0.5} nodeColor="#3b82f6" />
      <div className="relative z-10">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-8xl mb-4">About Me</h1>
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="px-4 py-1.5 rounded-full border border-primary text-secondary text-sm">Student</span>
            <span className="px-4 py-1.5 rounded-full border border-primary text-secondary text-sm">Software Developer</span>
            <span className="px-4 py-1.5 rounded-full border border-primary text-secondary text-sm">Based in the US</span>
          </div>
          <p>This is the about page.</p>
        </main>
      </div>
    </>
  );
} 