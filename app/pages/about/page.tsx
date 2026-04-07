'use client';

import { useRef } from 'react';
import MeshBackground, { type MeshBackgroundHandle } from '@/app/components/MeshBackground';
import { useMeshMouseEffect } from '@/app/hooks/useMeshMouseEffect';
import Navbar from '@/app/components/Navbar/Navbar';


export default function About() {
  const meshRef = useRef<MeshBackgroundHandle>(null);
  useMeshMouseEffect(meshRef, { radius: 500, strength: 15, sizeBoost: 10 });

  return (
    <>
      <MeshBackground ref={meshRef} numNodesX={45} numNodesY={25} nodeSize={4} />
      <div className="relative isolate">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-4">About Me</h1>
          <p>This is the about page.</p>
        </main>
      </div>
    </>
  );
} 