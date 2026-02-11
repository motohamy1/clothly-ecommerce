import React from 'react'
import { ContactCard } from './ui/contact-card'
import { Mail, Phone, MapPin } from 'lucide-react'

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'support@clothly.com'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567'
    },
    {
      icon: MapPin,
      label: 'Address',
      value: '123 Fashion Street, NY 10001'
    }
  ]

  return (
    <section className=' w-full px-4 py-6 md:px-8 lg:px-4'>
      <ContactCard 
        title="Get In Touch"
        description="Have questions about our products or services? We'd love to hear from you. Fill out the form and we'll get back to you within 1 business day."
        contactInfo={contactInfo}
        className="rounded-3xl overflow-hidden"
      >
        {/* Contact Form */}
        <form className="w-full space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 rounded-lg border bg-muted/70 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 rounded-lg border bg-muted/70 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full px-4 py-2 rounded-lg border bg-muted/70 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Your message..."
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Send Message
          </button>
        </form>
      </ContactCard>
    </section>
  )
}

export default Contact
