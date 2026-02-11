import React from 'react'
import { AnimatedTestimonials } from './ui/animated-testimonials'

const About = () => {
  const testimonials = [
    {
      quote: "This product exceeded my expectations! The quality is outstanding and the customer service was excellent.",
      name: "Sarah Johnson",
      designation: "Fashion Enthusiast",
      src: "/images/download.png"
    },
    {
      quote: "I've been a loyal customer for years. The attention to detail and craftsmanship is unmatched.",
      name: "Michael Chen",
      designation: "Style Blogger",
      src: "/images/download (1).png"
    },
    {
      quote: "Absolutely love the collection! Every piece is unique and the fit is perfect.",
      name: "Emma Williams",
      designation: "Designer",
      src: "/images/download (2).png"
    }
  ]

  return (
    <section className='w-full px-4 py-4 md:px-8 lg:px-4'>
      <div className='flex flex-col md:flex-row gap-4 md:gap-4'>
        {/* About Section - Takes full width on mobile, half on desktop */}
        <div className='flex-1 rounded-3xl p-4 md:p-8 bg-background shadow-lg'>
          <h1 className='text-4xl md:text-5xl font-extrabold mb-6 text-mencolor'>
            About <span className=''>Clothly</span>
          </h1>
          <div className='text-base md:text-lg text-muted-foreground'>
            <p className='mb-4'>
              At Clothly, we believe that fashion is more than just clothing; it's a form of self-expression and a way to connect with others. Our mission is to provide high-quality, stylish apparel that empowers individuals to showcase their unique personalities.
            </p>
            <p className='mb-4'>
              Founded in 2020, Clothly has quickly become a trusted name in the fashion industry. We are committed to sustainability and ethical practices, ensuring that our products not only look good but also make a positive impact on the world.
            </p>
            <p className='mb-4'>
              Join us on our journey to redefine fashion and make a statement with every outfit. Explore our collections and discover the perfect pieces to elevate your wardrobe.
            </p>
          </div>
        </div>

        {/* Testimonials Section - Takes full width on mobile, half on desktop */}
        <div className='flex-1 rounded-3xl p-6 md:p-8 bg-background shadow-lg'>
          <h2 className='text-4xl md:text-5xl font-extrabold mb-6 text-center text-mencolor'>
            What Our Clients Say
          </h2>
          <div>
            <AnimatedTestimonials 
              testimonials={testimonials}
              autoplay={true}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
