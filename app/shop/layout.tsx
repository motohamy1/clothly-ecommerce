"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/ui/PageTransition";
import { SHOP_CATEGORIES, ShopCategory } from "./HeroShop";

// Navigation links for shop pages
const shopNavLinks = Object.values(SHOP_CATEGORIES).map((cat) => ({
  href: `/shop/${cat.label.toLowerCase()}`,
  label: cat.label,
}));

// Get current category from pathname
const getCurrentCategory = (pathname: string): ShopCategory => {
  const segments = pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  if (["men", "women", "kids", "couples"].includes(lastSegment)) {
    return lastSegment as ShopCategory;
  }
  return "men";
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const currentCategory = getCurrentCategory(pathname);

  return (
    <div className="shop-theme min-h-screen bg-mencolor">
      <Navbar
        navLinks={shopNavLinks}
        showShopLink={false}
        activeCategory={currentCategory}
      />
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
