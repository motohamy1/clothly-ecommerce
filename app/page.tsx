import Hero from "@/components/Hero";
import Collections from "@/components/Collections";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Contact from "@/components/Contact";
function page() {
  return (
    <>
      <Navbar />
      <Hero />
      <Collections />
      <About />
      <Contact />
    </>
  );
}

export default page;
