import React from 'react'
import ThreeDImageRing from "./lightswind/3d-image-ring";
import Link from 'next/link';


function Collections({ className }: { className?: string }) {
  const imageUrls = [
    "https://images.pexels.com/photos/1704120/pexels-photo-1704120.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/912110/pexels-photo-912110.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/114979/pexels-photo-114979.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/698808/pexels-photo-698808.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/2449540/pexels-photo-2449540.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ];

  return (
    <div id="categories" className="bg-[#F0EDCC] rounded-3xl px-4 md:px-8 lg:px-12 h-screen w-full relative overflow-y-auto">
      <div className="py-6 md:py-8 flex flex-col gap-8">
        <div className="h-[70vh]">
          <div className="flex justify-between items-center mb-4 mt-4">
            <h1 className="text-background font-extrabold text-4xl">
              Men's Collection
            </h1>
            <Link href="/men" className="justify-end">
              <span className="text-background underline">View All</span>{" "}
            </Link>
          </div>
          <ThreeDImageRing images={imageUrls} borderRadius={32} />
        </div>

        <div className="h-[70vh]">
          <div className="flex justify-between items-center mb-4 mt-4">
            <h1 className="text-background font-extrabold text-4xl">
              Women's Collection
            </h1>
            <Link href="/women" className="justify-end">
              <span className="text-background underline">View All</span>{" "}
            </Link>
          </div>
          <ThreeDImageRing images={imageUrls} borderRadius={32} />
        </div>

        <div className="h-[70vh]">
          <div className="flex justify-between items-center mb-4 mt-4">
            <h1 className="text-background font-extrabold text-4xl">
              Kids' Collection
            </h1>
            <Link href="/kids" className="justify-end">
              <span className="text-background underline">View All</span>{" "}
            </Link>
          </div>
          <ThreeDImageRing images={imageUrls} borderRadius={32} />
        </div>

        <div className="h-[70vh]">
          <div className="flex justify-between items-center mb-4 mt-4">
            <h1 className="text-background font-extrabold text-4xl">
              Couple's Collection
            </h1>
            <Link href="/couples" className="justify-end">
              <span className="text-background underline">View All</span>{" "}
            </Link>
          </div>
          <ThreeDImageRing images={imageUrls} borderRadius={32} />
        </div>
      </div>
    </div>
  );
}

export default Collections