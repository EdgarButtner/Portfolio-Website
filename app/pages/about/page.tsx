'use client';

import { useRef } from 'react';
import MeshBackground, { type MeshBackgroundHandle } from '@/app/components/MeshBackground';
import { useMeshMouseEffect } from '@/app/hooks/useMeshMouseEffect';
import Navbar from '@/app/components/Navbar/Navbar';


export default function About() {
  const meshRef = useRef<MeshBackgroundHandle>(null);

  useMeshMouseEffect(meshRef, { radius: 150, strength: 40, sizeBoost: 6 });

  return (
    <div className="relative">
      {/* Navbar */}
      <Navbar />

      <MeshBackground ref={meshRef} numNodesX={45} numNodesY={25} nodeSize={4}/>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">About Me</h1>
        <p>This is the about page.</p>
      </main>
    </div>
  );
} 