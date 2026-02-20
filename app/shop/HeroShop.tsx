'use client'
import React, { useRef, useState, useEffect } from 'react'
import { ThreeDPhotoCarousel } from '@/components/ui/3d-carousel'
import MagicBento from '@/components/ui/MagicBento'

// Category type definition
export type ShopCategory = 'men' | 'women' | 'kids' | 'couples'

// Category configuration
export const SHOP_CATEGORIES: Record<ShopCategory, { title: string; label: string }> = {
  men: { title: 'Men Collection', label: 'Men' },
  women: { title: 'Women Collection', label: 'Women' },
  kids: { title: 'Kids Collection', label: 'Kids' },
  couples: { title: 'Couples Collection', label: 'Couples' },
}

interface ShopRowProps {
  children: React.ReactNode
  rowId: string
}

const ShopRow = ({ children, rowId }: ShopRowProps) => {
  const leftRef = useRef<HTMLDivElement>(null)
  const [leftHeight, setLeftHeight] = useState<number>(600) // default height

  useEffect(() => {
    const updateHeight = () => {
      if (leftRef.current) {
        const height = leftRef.current.offsetHeight
        if (height > 0) {
          setLeftHeight(height)
        }
      }
    }

    // Initial update with a small delay to ensure DOM is ready
    const initialTimer = setTimeout(updateHeight, 100)
    
    window.addEventListener('resize', updateHeight)
    
    // Also observe for changes in the MagicBento content
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height
        if (height > 0) {
          setLeftHeight(height)
        }
      }
    })
    
    if (leftRef.current) {
      observer.observe(leftRef.current)
    }

    return () => {
      clearTimeout(initialTimer)
      window.removeEventListener('resize', updateHeight)
      observer.disconnect()
    }
  }, [])

  // Calculate carousel height (total height minus gap)
  const carouselHeight = Math.max(200, (leftHeight - 16) / 2) // 16px = gap-4

  // Debug logging
  useEffect(() => {
    console.log('ShopRow - leftHeight:', leftHeight, 'carouselHeight:', carouselHeight)
  }, [leftHeight, carouselHeight])

  return (
    <div className='flex flex-col lg:flex-row items-start justify-center gap-6 px-4 sm:px-6 lg:px-8'>
      <div ref={leftRef} className='w-full lg:w-[54rem] flex-shrink-0'>
        {children}
      </div>
      <div 
        className='flex flex-col gap-4 w-full lg:flex-1 min-w-0'
      >
        <div
          className='overflow-hidden rounded-xl bg-mauve-dark-2'
          style={{ height: `${carouselHeight}px` }}
        >
          <ThreeDPhotoCarousel id={`${rowId}-carousel-1`} />
        </div>
        <div
          className='overflow-hidden rounded-xl bg-mauve-dark-2'
          style={{ height: `${carouselHeight}px` }}
        >
          <ThreeDPhotoCarousel id={`${rowId}-carousel-2`} />
        </div>
      </div>
    </div>
  )
}

interface HeroShopProps {
  category?: ShopCategory
}

const HeroShop = ({ category = 'men' }: HeroShopProps) => {
  const categoryConfig = SHOP_CATEGORIES[category]
  const [selectedProduct, setSelectedProduct] = useState<{ image: string; title: string; price: string; description: string } | null>(null)
  
  const handleCardClick = (card: any) => {
    console.log('Card clicked:', card)
    setSelectedProduct({
      image: card.image,
      title: card.title,
      price: card.price,
      description: card.description
    })
  }
  
  const closeProductModal = () => {
    setSelectedProduct(null)
  }
  
  return (
    <main className='bg-mencolor pt-28 pb-8 min-h-screen'>
      <h1 className='flex items-center justify-center pb-6 font-bold text-[#02343F] text-4xl'>
        {categoryConfig.title}
      </h1>
      
      {/* First Row */}
      <ShopRow rowId={`${category}-row-1`}>
        <MagicBento
          textAutoHide={true}
          enableStars
          enableSpotlight
          enableBorderGlow={true}
          enableTilt={false}
          enableMagnetism={false}
          clickEffect
          spotlightRadius={400}
          particleCount={12}
          glowColor="132, 0, 255"
          disableAnimations={false}
          onCardClick={handleCardClick}
        />
      </ShopRow>

      {/* Second Row */}
      <div className='mt-6'>
        <ShopRow rowId={`${category}-row-2`}>
          <MagicBento
            textAutoHide={true}
            enableStars
            enableSpotlight
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={false}
            clickEffect
            spotlightRadius={400}
            particleCount={12}
            glowColor="132, 0, 255"
            disableAnimations={false}
            onCardClick={handleCardClick}
          />
        </ShopRow>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeProductModal}
        >
          <div 
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeProductModal}
              className="absolute -top-10 right-0 text-white text-xl hover:text-gray-300"
            >
              ✕ Close
            </button>
            <div className="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-1/2">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.title}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="p-6 md:w-1/2 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.title}</h2>
                <p className="text-xl text-purple-600 font-semibold mb-4">{selectedProduct.price}</p>
                <p className="text-gray-600">{selectedProduct.description}</p>
                <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default HeroShop