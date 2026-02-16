# 3D Interactive Gallery - Implementation Guide

## Overview
A stunning WebGL-based 3D rotating gallery has been added to the Smokeville website, featuring an infinite carousel effect with smooth animations and particle effects.

## Features

### 🎨 Visual Effects
- **WebGL Rendering**: Using gl-matrix for 3D transformations
- **Smoke Particles**: Floating ambient particles with purple/orange gradient
- **Auto-Rotation**: Automatically rotates when idle (after 2 seconds)
- **Active Highlighting**: Center item glows with orange gradient
- **Depth Fading**: Items fade based on distance from viewer
- **Smooth Transitions**: All animations use ease-in-out timing

### 🎯 Interactions
- **Drag to Rotate**: Click and drag to manually rotate the carousel
- **Touch Support**: Full mobile touch support
- **Scroll to Navigate**: Mouse wheel to rotate through items
- **View Toggle**: Switch between Grid View and 3D View
- **Lightbox Integration**: Click items in Grid View for detailed view

### 🎭 Brand Integration
- **Dark Background**: #0b0b0b with smoky overlays
- **Gold Accents**: #CBA135 for active elements
- **Purple/Orange Gradients**: Atmospheric glow effects
- **Playfair Display**: For titles
- **Inter Font**: For descriptions

## Components Created

### 1. `/components/InfiniteMenu.tsx`
Main 3D gallery component using WebGL and gl-matrix.

**Props:**
```typescript
interface MenuItem {
  image: string;      // Image URL
  link: string;       // Action link
  title: string;      // Display title
  description: string; // Short description
}

interface InfiniteMenuProps {
  items: MenuItem[];
}
```

**Features:**
- WebGL shader-based rendering
- Automatic texture loading
- Circular arrangement of items
- Active item detection and highlighting
- Smooth rotation interpolation

### 2. `/components/SmokeParticles.tsx`
Ambient particle effect for atmospheric background.

**Features:**
- Canvas-based particle system
- 30 floating smoke particles
- Purple/orange gradient colors
- Automatic fade in/out
- Responsive to window resize

### 3. Updated `/components/pages/GalleryPage.tsx`
Enhanced gallery page with view toggle.

**New Features:**
- 3D View / Grid View toggle buttons
- Smoke particles in 3D mode
- Fallback sample images if no gallery items
- Responsive layout
- Instructions for interaction

## Installation

### Required Package
```bash
npm install gl-matrix
```

The gl-matrix library provides high-performance matrix and vector operations for WebGL.

## Usage Example

```tsx
import InfiniteMenu from './components/InfiniteMenu';

const galleryItems = [
  {
    image: 'https://example.com/image1.jpg',
    link: '#',
    title: 'Smoke Session 01',
    description: 'Grilled Perfection'
  },
  {
    image: 'https://example.com/image2.jpg',
    link: '#',
    title: 'Pizza Night',
    description: 'Artisan Pizzas'
  }
];

<div style={{ height: '600px', position: 'relative' }}>
  <InfiniteMenu items={galleryItems} />
</div>
```

## Styling

All 3D gallery styles are in `/styles/globals.css`:
- Canvas cursor states
- Action button animations
- Title/description transitions
- Responsive breakpoints

## Performance Optimizations

1. **WebGL Blending**: Enabled for smooth transparency
2. **Texture Caching**: Textures loaded once and reused
3. **Depth Testing**: Proper z-ordering for 3D effect
4. **RequestAnimationFrame**: Smooth 60fps rendering
5. **Auto-rotation Delay**: Reduces CPU when user is inactive

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers with WebGL support

**Note**: Requires WebGL-enabled browser. Falls back gracefully to Grid View if WebGL is not available.

## Responsive Design

### Desktop (>1500px)
- Full title and description displayed
- Large action button
- Maximum visual effects

### Tablet (768px - 1500px)
- Titles/descriptions hidden for cleaner view
- Medium action button
- Optimized for touch

### Mobile (<768px)
- Compact layout
- Smaller action button
- Touch-optimized controls

## Customization

### Change Colors
In `InfiniteMenu.tsx`:
```typescript
// Background color
gl.clearColor(0.043, 0.043, 0.043, 1.0); // #0b0b0b

// Glow color (in fragment shader)
vec3 glowColor = vec3(0.8, 0.5, 0.2); // Orange
```

### Adjust Rotation Speed
```typescript
// Auto-rotation speed
targetRotationRef.current += 0.002; // Lower = slower

// Manual drag sensitivity
targetRotationRef.current += deltaX * 0.01; // Higher = more sensitive
```

### Change Carousel Radius
```typescript
const radius = 5; // Distance from center
```

### Modify Scale
```typescript
const scale = index === activeIndex ? 1.8 : 1.3; // Active vs inactive
```

## Integration with Firebase Gallery

The component automatically uses images from Firebase Gallery:
- Filters out video items (3D view only supports images)
- Uses image URL from gallery items
- Displays title and category
- Syncs with admin uploads

## Future Enhancements

- [ ] Video support in 3D view
- [ ] Parallax effect on mouse/gyro movement
- [ ] Multiple layout options (sphere, wave, etc.)
- [ ] Customizable particle effects
- [ ] Performance mode toggle
- [ ] VR/AR support

## Troubleshooting

### Gallery not rendering?
- Check browser console for WebGL errors
- Ensure images have proper CORS headers
- Verify gl-matrix is installed

### Performance issues?
- Reduce number of particles in SmokeParticles.tsx
- Lower texture resolution
- Disable auto-rotation

### Mobile not working?
- Ensure touch events are not blocked
- Check viewport meta tag
- Test on actual device (not just emulator)

## Credits

- WebGL implementation using gl-matrix
- Inspired by modern Apple/Tesla UI design
- Particle system adapted for restaurant atmosphere
- Custom shaders for depth and glow effects
