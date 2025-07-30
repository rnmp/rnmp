# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `yarn dev` - Start development server at localhost:4321
- `yarn build` - Build production site to ./dist/
- `yarn preview` - Preview built site locally

### Project Management
- `yarn install` - Install dependencies
- `yarn astro add` - Add Astro integrations
- `yarn astro check` - TypeScript checking (requires @astrojs/check installation)

## Architecture

This is an Astro-based portfolio site with a minimalist, interactive design.

### Key Components

1. **Layout Structure** - src/layouts/Layout.astro:11
   - Handles SEO meta tags and Google Analytics
   - Progressive background image loading with blur effect
   - Custom Jugendreisen font loading

2. **Interactive Cards** - src/components/Card.astro:136
   - Draggable cards with touch/mouse support
   - Expandable cards with smooth animations
   - Non-overlapping automatic positioning algorithm
   - Responsive positioning (vertical stacking on mobile)

3. **Page Structure** - src/pages/index.astro:19
   - Hero section with animated text
   - Project showcase cards (Bleep, Flow)
   - About me expandable card
   - Social links card

### Technical Features

- **No framework dependencies** - Pure Astro with vanilla JavaScript
- **Custom font loading** - Jugendreisen font in WOFF/WOFF2 formats
- **Progressive enhancement** - Background image loads with placeholder
- **Responsive design** - Mobile-first with breakpoints at 512px, 756px, 1200px
- **Animation system** - Staggered fade-in animations for cards and hero text

### Styling Approach

- Global styles in src/styles/globals.css
- Component-scoped styles using Astro's `<style>` tags
- CSS custom properties for theming potential
- Backdrop filters for glassmorphic card design