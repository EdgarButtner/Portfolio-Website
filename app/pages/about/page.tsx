import Navbar from '@/app/components/Navbar/Navbar';

export default function About() {
  return (
    <div className="relative">

      {/* Mesh Background 
      <div className="absolute inset-0 -z-10">
        <MeshBackground />
      </div>
      */}

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">About Me</h1>
        <p>This is the about page.</p>
      </main>
    </div>
  );
}