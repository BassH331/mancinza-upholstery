# 🚀 Quick Reference - Mancinza Upholstery

## 📝 Common Commands

### Development
```bash
# Start development server
npm run dev

# Start on specific port
npm run dev -- --port 3000

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Package Management
```bash
# Install dependencies
npm install

# Add new package
npm install package-name

# Add dev dependency
npm install -D package-name

# Remove package
npm uninstall package-name

# Update packages
npm update
```

### Troubleshooting
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Check for outdated packages
npm outdated
```

## 🔧 VS Code Shortcuts

### General
- `Ctrl+Shift+P` - Command Palette
- `Ctrl+`` - Toggle Terminal
- `Ctrl+B` - Toggle Sidebar
- `Ctrl+Shift+E` - Explorer
- `Ctrl+Shift+F` - Search in Files

### Editing
- `Ctrl+D` - Select next occurrence
- `Alt+Up/Down` - Move line up/down
- `Shift+Alt+Up/Down` - Duplicate line
- `Ctrl+/` - Toggle comment
- `Ctrl+Shift+K` - Delete line

### React/TypeScript
- `rafce` - React Arrow Function Component Export
- `useState` - Auto-import useState hook
- `useEffect` - Auto-import useEffect hook

## 📁 Key File Locations

### Main Files
- `/App.tsx` - Main application component
- `/main.tsx` - React entry point
- `/index.html` - HTML template
- `/styles/globals.css` - Global styles

### Components
- `/components/Navigation.tsx` - Header navigation
- `/components/HeroSection.tsx` - Hero video section
- `/components/AboutSection.tsx` - About us section
- `/components/ServicesSection.tsx` - Services showcase
- `/components/GallerySection.tsx` - Image galleries
- `/components/ContactSection.tsx` - Contact form
- `/components/BookingSection.tsx` - Booking form

### Configuration
- `/package.json` - Dependencies and scripts
- `/vite.config.ts` - Vite configuration
- `/tsconfig.json` - TypeScript configuration
- `/.eslintrc.cjs` - ESLint configuration

## 🎨 Tailwind Classes Reference

### Layout
```css
/* Container */
.container - max-width: 1200px with auto margins

/* Flexbox */
.flex - display: flex
.flex-col - flex-direction: column
.items-center - align-items: center
.justify-between - justify-content: space-between

/* Grid */
.grid - display: grid
.grid-cols-3 - grid-template-columns: repeat(3, 1fr)
.gap-4 - gap: 1rem
```

### Spacing
```css
/* Padding */
.p-4 - padding: 1rem
.px-6 - padding-left: 1.5rem; padding-right: 1.5rem
.py-2 - padding-top: 0.5rem; padding-bottom: 0.5rem

/* Margin */
.m-4 - margin: 1rem
.mx-auto - margin-left: auto; margin-right: auto
.mt-8 - margin-top: 2rem
```

### Colors (Using CSS Variables)
```css
.bg-background - background-color: var(--background)
.text-foreground - color: var(--foreground)
.bg-primary - background-color: var(--primary)
.text-primary-foreground - color: var(--primary-foreground)
```

### Responsive Design
```css
.md:flex - apply flex on medium screens and up
.lg:grid-cols-4 - 4 columns on large screens and up
.sm:px-8 - padding on small screens and up
```

## 🌐 Browser Testing

### Responsive Testing
- `F12` - Open Developer Tools
- `Ctrl+Shift+M` - Toggle Device Toolbar
- Test on: Mobile (375px), Tablet (768px), Desktop (1024px+)

### Performance Testing
- Lighthouse audit in Chrome DevTools
- Network tab for loading times
- Console for JavaScript errors

## 📱 Mobile Testing URLs

When running locally, test on mobile devices:
```
# Find your local IP
ipconfig (Windows) or ifconfig (Mac/Linux)

# Access from mobile on same network
http://[YOUR_IP]:5173
# Example: http://192.168.1.100:5173
```

## 🔄 Git Commands (if using version control)

```bash
# Initialize repository
git init

# Add files
git add .

# Commit changes
git commit -m "Initial commit"

# Check status
git status

# View changes
git diff
```

## 🚨 Emergency Fixes

### If server won't start:
1. Check if port 5173 is in use
2. Try: `npm run dev -- --port 3000`
3. Restart terminal
4. Clear cache: `npm cache clean --force`

### If styles aren't loading:
1. Check `main.tsx` imports `./styles/globals.css`
2. Restart dev server
3. Clear browser cache (Ctrl+Shift+R)

### If TypeScript errors:
1. Run: `npm run build` to see all errors
2. Check file extensions are `.tsx`
3. Verify import paths

### If components not found:
1. Check file names match imports exactly
2. Ensure components export correctly
3. Verify file paths are relative to App.tsx

---

**Keep this reference handy while developing!**