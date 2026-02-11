import Hero from "@/components/Hero";
import Collections from "@/components/Collections";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/About";
import Contact from "@/components/Contact";
function page() {
  return (
    <>
      <Navbar />
      <Hero />
      <Collections />
      <Testimonials />
      <Contact />
    </>
  );
}

export default page;
