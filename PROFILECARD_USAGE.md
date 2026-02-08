# ProfileCard Component - Usage Guide

A customizable profile card component inspired by modern design patterns, featuring a clean layout with avatar, name, title, availability status, and social links.

## 📁 Files Created

- `components/ProfileCard.tsx` - Main reusable component
- `components/ProfileCardExample.tsx` - Example usage with sample data

## 🎨 Features

- ✅ Customizable avatar image
- ✅ Name and title fields
- ✅ Availability status indicator (green/gray dot)
- ✅ Social media links with icons
- ✅ Responsive design (mobile-friendly)
- ✅ Clean, modern styling with borders
- ✅ Hamburger menu button
- ✅ Easy to customize all elements

## 🚀 Quick Start

### Basic Usage

```tsx
import ProfileCard from '@/components/ProfileCard'

function MyPage() {
  return (
    <ProfileCard
      avatarSrc="/images/profile.jpg"
      name="Your Name"
      title="Your Title"
    />
  )
}
```

### Full Customization

```tsx
import ProfileCard from '@/components/ProfileCard'

// Define your social icons
const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    {/* Your SVG path */}
  </svg>
)

function MyPage() {
  return (
    <ProfileCard
      // Avatar
      avatarSrc="/images/my-photo.jpg"
      avatarAlt="My Profile Picture"
      
      // Text
      name="John Doe"
      title="Full Stack Developer"
      
      // Status
      availabilityText="Available for freelance"
      isAvailable={true}
      
      // Social Links
      socialLinks={[
        {
          icon: <TwitterIcon />,
          href: "https://twitter.com/johndoe",
          label: "Twitter"
        },
        {
          icon: <LinkedInIcon />,
          href: "https://linkedin.com/in/johndoe",
          label: "LinkedIn"
        }
      ]}
      
      // Additional styling
      className="my-custom-class"
    />
  )
}
```

## 📝 Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `avatarSrc` | string | ✅ Yes | - | Path to avatar image |
| `avatarAlt` | string | ❌ No | "Profile picture" | Alt text for avatar |
| `name` | string | ✅ Yes | - | Person's name |
| `title` | string | ✅ Yes | - | Job title or role |
| `availabilityText` | string | ❌ No | "Available for work" | Status text |
| `isAvailable` | boolean | ❌ No | true | Shows green (true) or gray (false) dot |
| `socialLinks` | SocialLink[] | ❌ No | [] | Array of social media links |
| `className` | string | ❌ No | "" | Additional CSS classes |

### SocialLink Type

```typescript
interface SocialLink {
  icon: React.ReactNode  // Your icon component
  href: string          // URL to social profile
  label: string         // Accessibility label
}
```

## 🎨 Customization Examples

### 1. Change Colors

Edit the component file to change colors:

```tsx
// Avatar background color
className="bg-[#c08b79]"  // Change to your color

// Social link buttons
className="bg-[#c08b79] hover:bg-[#b07a69]"  // Change to your colors
```

### 2. Add Your Own Icons

You can use any icon library (react-icons, heroicons, etc.):

```tsx
import { FaTwitter, FaLinkedIn, FaGithub } from 'react-icons/fa'

socialLinks={[
  {
    icon: <FaTwitter />,
    href: "https://twitter.com/you",
    label: "Twitter"
  }
]}
```

### 3. Change Availability Status

```tsx
// Available (green dot)
<ProfileCard
  isAvailable={true}
  availabilityText="Available for work"
/>

// Busy (gray dot)
<ProfileCard
  isAvailable={false}
  availabilityText="Currently unavailable"
/>
```

### 4. Without Social Links

```tsx
<ProfileCard
  avatarSrc="/image.jpg"
  name="John Doe"
  title="Designer"
  // Simply don't include socialLinks prop
/>
```

## 📱 Responsive Behavior

The component is fully responsive:
- **Mobile**: Smaller avatar, adjusted text sizes
- **Tablet**: Medium sizes
- **Desktop**: Full sizes with optimal spacing

## 🖼️ Image Requirements

For best results:
- **Format**: JPG, PNG, or WebP
- **Size**: 200x200px minimum (square)
- **Location**: Place in `/public` folder
- **Usage**: Reference as `/images/photo.jpg`

## 🎯 Integration Examples

### In a Page

```tsx
// app/profile/page.tsx
import ProfileCard from '@/components/ProfileCard'

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-[#e5ebd3] py-12">
      <ProfileCard
        avatarSrc="/images/profile.jpg"
        name="Your Name"
        title="Your Title"
      />
    </main>
  )
}
```

### In Hero Section

```tsx
// components/Hero.tsx
import ProfileCard from './ProfileCard'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <ProfileCard
        avatarSrc="/team/ceo.jpg"
        name="CEO Name"
        title="Chief Executive Officer"
      />
    </section>
  )
}
```

## 🔧 Advanced Customization

### Add Click Handler to Menu Button

Edit `ProfileCard.tsx`:

```tsx
// Add prop
interface ProfileCardProps {
  onMenuClick?: () => void
  // ... other props
}

// In component
<button 
  onClick={onMenuClick}
  className="flex flex-col gap-1.5 p-2 hover:bg-gray-100 rounded transition-colors"
>
  {/* menu icon */}
</button>
```

### Make Avatar Clickable

```tsx
// Add prop
avatarHref?: string

// In component
{avatarHref ? (
  <a href={avatarHref}>
    <div className="relative w-20 h-20...">
      {/* avatar */}
    </div>
  </a>
) : (
  <div className="relative w-20 h-20...">
    {/* avatar */}
  </div>
)}
```

## 🎨 Color Scheme

Current colors (from your theme):
- **Primary**: `#c08b79` (Terracotta)
- **Background**: `#e5ebd3` (Light beige)
- **Text**: Black
- **Available**: Green (`#22c55e`)
- **Unavailable**: Gray

## 📦 Dependencies

- Next.js (for Image component)
- React
- Tailwind CSS

## 🐛 Troubleshooting

**Image not showing?**
- Ensure image is in `/public` folder
- Check file path is correct
- Verify image format is supported

**Icons not displaying?**
- Make sure you're passing valid React components
- Check icon library is installed
- Verify SVG viewBox is correct

**Styling issues?**
- Ensure Tailwind CSS is configured
- Check for conflicting CSS classes
- Verify parent container has proper width

## 📄 License

Free to use and modify for your projects!
