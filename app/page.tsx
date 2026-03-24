import Navbar from '@/app/components/Navbar/Navbar';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative">

      {/* Navbar */}
      <Navbar />

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
            <h1 className="text-4xl font-bold mb-4">Home</h1>
            <p>Hi! I&apos;m Edgar Buttner.</p>
          </div>

        </div>
      </main>
    </div>
  );
}