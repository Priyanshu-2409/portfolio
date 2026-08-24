import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Intro from "@/components/Intro";
import FollowLens from "@/components/FollowLens";


import {
  Skills,
  Experience,
  Education,
  Achievements,
  Contact,
  Footer,
} from "@/components/Sections";

export default function Home() {
  return (
    <main>
      <Intro />
      <FollowLens />
      <Nav />
      <Hero />
      <Projects />
      <Skills />
      <Experience />
      <Education />
      <Achievements />
      <Contact />
      <Footer />
    </main>
  );
}
