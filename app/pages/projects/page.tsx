import Navbar from '@/app/components/Navbar/Navbar';
import CustomCard from '@/app/components/CustomCard/CustomCard';

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
  },
    {
    title: "My Profect",
    image: "/images/blue.png",
    description: "A cool thing I built.",
  },
      {
    title: "My Profect",
    image: "/images/blue.png",
    description: "A cool thing I built.",
  },
      {
    title: "My Profect",
    image: "/images/blue.png",
    description: "A cool thing I built.",
  },
      {
    title: "My Profect",
    image: "/images/blue.png",
    description: "A cool thing I built.",
  },
      {
    title: "My Profect",
    image: "/images/blue.png",
    description: "A cool thing I built.",
  },
      {
    title: "My Profect",
    image: "/images/blue.png",
    description: "A cool thing I built.",
  },
      {
    title: "My Profect",
    image: "/images/blue.png",
    description: "A cool thing I built.",
  },
      {
    title: "My Profect",
    image: "/images/blue.png",
    description: "A cool thing I built.",
  },
      {
    title: "My Profect",
    image: "/images/blue.png",
    description: "A cool thing I built.",
  }
];

export default function Projects() {
  return (
    <div className="relative">

      {/* Mesh Background
      <div className="absolute inset-0 -z-10">
        <MeshBackground />
      </div>


      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-align-center mb-4">My Projects</h1>
        <p>This is the projects page.</p>

        <div className="row-column grid gap-15 mt-10">
          {projects.map((project, index) => (
            <CustomCard key={index} index={index} {...project} />
          ))}
        </div>

      </main>
    </div>
  );
}