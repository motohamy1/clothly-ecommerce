import React from 'react'
import ThreeDImageRing from "./lightswind/3d-image-ring";

function MenCollection() {


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
    <div className="bg-current rounded-3xl px-16 h-screen w-full relative overflow-y-auto">
      <div className="py-6 flex flex-col gap-8">
        <div className="h-[70vh]">
          <ThreeDImageRing images={imageUrls} borderRadius={32} />
        </div>
        <div className="h-[70vh]">
          <ThreeDImageRing images={imageUrls} borderRadius={32} />
        </div>
        <div className="h-[70vh]">
          <ThreeDImageRing images={imageUrls} borderRadius={32} />
        </div>
        <div className="h-[70vh]">
          <ThreeDImageRing images={imageUrls} borderRadius={32} />
        </div>
      </div>
    </div>
  );
}

export default MenCollection