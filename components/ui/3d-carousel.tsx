"use client"

import { memo, useEffect, useLayoutEffect, useMemo, useState } from "react"
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion"

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  const handleChange = () => {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    handleChange()

    matchMedia.addEventListener("change", handleChange)

    return () => {
      matchMedia.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}

const keywords = [
  "night",
  "city",
  "sky",
  "sunset",
  "sunrise",
  "winter",
  "skyscraper",
  "building",
  "cityscape",
  "architecture",
  "street",
  "lights",
  "downtown",
  "bridge",
]

const duration = 0.15
const transition = { duration, ease: [0.32, 0.72, 0, 1] as const }
const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const }

const Carousel = memo(
  ({
    handleClick,
    controls,
    cards,
    isCarouselActive,
  }: {
    handleClick: (imgUrl: string, index: number) => void
    controls: any
    cards: string[]
    isCarouselActive: boolean
  }) => {
    const isScreenSizeSm = useMediaQuery("(max-width: 640px)")
    const cylinderWidth = isScreenSizeSm ? 1100 : 1800
    const faceCount = cards.length
    const faceWidth = cylinderWidth / faceCount
    const radius = cylinderWidth / (2 * Math.PI)
    const rotation = useMotionValue(0)
    const transform = useTransform(
      rotation,
      (value) => `rotate3d(0, 1, 0, ${value}deg)`
    )

    return (
      <div
        className="flex h-full items-center justify-center"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          drag={isCarouselActive ? "x" : false}
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
            position: 'absolute',
            left: '50%',
            marginLeft: `-${cylinderWidth / 2}px`,
          }}
          onDrag={(_, info) =>
            isCarouselActive &&
            rotation.set(rotation.get() + info.offset.x * 0.05)
          }
          onDragEnd={(_, info) =>
            isCarouselActive &&
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 0.1,
              },
            })
          }
        >
          {cards.map((imgUrl, i) => (
            <motion.div
              key={`key-${imgUrl}-${i}`}
              className="absolute flex h-full origin-center items-center justify-center rounded-xl bg-mauve-dark-2 p-2"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${
                  i * (360 / faceCount)
                }deg) translateZ(${radius}px)`,
              }}
              onClick={() => handleClick(imgUrl, i)}
            >
              <motion.img
                src={imgUrl}
                alt={`keyword_${i} ${imgUrl}`}
                className="pointer-events-none w-full rounded-xl object-cover aspect-[3/4]"
                initial={{ filter: "blur(4px)" }}
                layout="position"
                animate={{ filter: "blur(0px)" }}
                transition={transition}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  }
)

const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`

interface ProductData {
  image: string;
  title?: string;
  price?: string;
  description?: string;
}

interface ThreeDPhotoCarouselProps {
  id?: string;
  images?: string[];
  height?: string;
  onCardClick?: (imageUrl: string, index: number) => void;
  products?: ProductData[];
}

function ThreeDPhotoCarousel({ id = 'default', images, height, onCardClick, products }: ThreeDPhotoCarouselProps) {
  const [activeImg, setActiveImg] = useState<string | null>(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)
  const controls = useAnimation()
  
  // Use provided images or fallback to placeholder images
  const cards = useMemo(() => {
    if (images && images.length > 0) {
      return images
    }
    return keywords.map((keyword) => `https://picsum.photos/200/300?${keyword}`)
  }, [images])

  // Get product data for the active image
  const getProductData = (imgUrl: string) => {
    if (products && products.length > 0) {
      // Find by matching image URL
      const product = products.find(p => p.image === imgUrl)
      if (product) return product
      // Or match by index
      const index = cards.indexOf(imgUrl)
      if (index >= 0 && index < products.length) {
        return products[index]
      }
    }
    return null
  }

  useEffect(() => {
    console.log("Cards loaded:", cards)
    console.log(`Carousel ${id} - controls:`, controls)
  }, [cards, id, controls])

  const handleClick = (imgUrl: string, index: number) => {
    // Call the external onCardClick callback if provided
    if (onCardClick) {
      onCardClick(imgUrl, index)
    }
    
    // Also open internal modal
    setActiveImg(imgUrl)
    setIsCarouselActive(false)
    controls.stop()
  }

  const handleClose = () => {
    setActiveImg(null)
    setIsCarouselActive(true)
  }

  // Prevent click on image from closing the modal
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const activeProduct = activeImg ? getProductData(activeImg) : null

  return (
    <motion.div layout className="w-full h-full">
      <AnimatePresence mode="sync">
        {activeImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layoutId={`img-container-${id}-${activeImg}`}
            layout="position"
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            style={{ willChange: "opacity" }}
            transition={transitionOverlay}
          >
            {/* Modal Content Container */}
            <div 
              className="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row max-w-4xl w-full shadow-2xl"
              onClick={handleImageClick}
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2">
                <motion.img
                  layoutId={`img-${id}-${activeImg}`}
                  src={activeImg}
                  className="w-full h-auto object-cover"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  alt="Product detail"
                />
              </div>
              
              {/* Product Info Section */}
              <div className="p-6 md:w-1/2 flex flex-col justify-center">
                <button 
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
                
                {activeProduct ? (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {activeProduct.title || 'Product'}
                    </h2>
                    {activeProduct.price && (
                      <p className="text-xl text-purple-600 font-semibold mb-4">
                        {activeProduct.price}
                      </p>
                    )}
                    {activeProduct.description && (
                      <p className="text-gray-600 mb-4">
                        {activeProduct.description}
                      </p>
                    )}
                    <button className="mt-auto bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                      Add to Cart
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Product Details
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Click on the image to view product details.
                    </p>
                    <button className="mt-auto bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                      Add to Cart
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative h-full w-full overflow-hidden" style={height ? { height } : undefined}>
        <Carousel
          handleClick={handleClick}
          controls={controls}
          cards={cards}
          isCarouselActive={isCarouselActive}
        />
      </div>
    </motion.div>
  )
}

export { ThreeDPhotoCarousel };
