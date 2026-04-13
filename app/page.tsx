'use client';

import { useRef } from 'react';
import Navbar from '@/app/components/Navbar/Navbar';
import MeshBackground, { type MeshBackgroundHandle } from '@/app/components/MeshBackground';
import { useMeshMouseEffect } from '@/app/hooks/useMeshMouseEffect';
import Image from 'next/image';

export default function Home() {
    const meshRef = useRef<MeshBackgroundHandle>(null);
    useMeshMouseEffect(meshRef, { radius: 500, strength: 15, sizeBoost: 10 });

  return (
    <div className="relative">

      {/* Navbar */}
      <Navbar />

      <MeshBackground ref={meshRef} numNodesX={45} numNodesY={25} nodeSize={0.5} nodeColor="#3b82f6" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 items-center gap-12">

          <Image
            src="/images/blue.png"
            alt="Picture of the author"
            width={600}
            height={600}
            className="w-full h-auto"
          />

          <div>
            <h1 className="text-8xl mb-4 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Hi! I&apos;m Edgar Buttner.</h1>
          </div>

        </div>
      </main>
    </div>
  );
}