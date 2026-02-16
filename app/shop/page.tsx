import React from 'react'
import Navbar from '@/components/Navbar'

const shopNavLinks = [
  { href: '/shop/men', label: 'Men' },
  { href: '/shop/women', label: 'Women' },
  { href: '/shop/kids', label: 'Kids' },
  { href: '/shop/couples', label: 'Couples' },
]

const page = () => {
  return (
    <Navbar navLinks={shopNavLinks} showShopLink={false} />
  )
}

export default page