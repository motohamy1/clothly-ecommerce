import Navbar from "@/components/Navbar";
import HomePage from "@/app/pages/HomePage";
import SideBar from "@/components/SideBar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <SideBar />
      <div className="ml-[240px] pt-[8.5rem]">
        <HomePage />
      </div>
    </main>
  );
}

