# Mancinza Upholstery Website

A modern, responsive website for Mancinza Upholstery, featuring premium furniture and decor services. Built with React, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design with smooth animations
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Interactive Galleries**: Toggleable furniture and event decor galleries
- **Contact Forms**: Contact and booking forms with validation
- **WhatsApp Integration**: Direct WhatsApp contact with QR code
- **Video Background**: Engaging hero section with video background
- **Smooth Scrolling**: Enhanced navigation with smooth scroll behavior

## 🚀 Services Showcased

- **Upholstery Materials**: Durable, stylish fabrics & leathers
- **Car Seat Repairs**: Restore your car's interior to like-new condition
- **Sofa Restoration**: Fix sagging cushions, fabrics & frames
- **Event Decor**: Elegant setups for any occasion
- **Furniture Rental**: Premium furniture pieces for events and staging

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **UI Components**: Custom components + Radix UI primitives
- **Icons**: Lucide React
- **Animations**: CSS animations + smooth transitions
- **Toast Notifications**: Sonner

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mancinza-upholstery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎨 Customization

### Theme Colors
The website uses CSS custom properties for theming. You can modify colors in `/styles/globals.css`:

```css
:root {
  --primary: #030213;
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  /* ... other color variables */
}
```

### Content Updates
- **Company Information**: Update in respective component files
- **Contact Details**: Modify WhatsApp number in `ContactSection.tsx`
- **Services**: Edit service cards in `ServicesSection.tsx`
- **Images**: Replace image URLs with your own assets

### Adding New Sections
1. Create a new component in `/components/`
2. Import and add to `App.tsx`
3. Update navigation links in `Navigation.tsx`

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📂 Project Structure

```
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   └── figma/           # Figma-specific components
├── styles/              # Global styles and CSS
├── App.tsx              # Main application component
├── main.tsx             # React entry point
├── index.html           # HTML template
└── package.json         # Dependencies and scripts
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🤝 Contributing

This is a private project. For any changes or improvements, please contact the development team.

## 📞 Support

For technical support or questions about this website, please contact:
- Email: [your-email@example.com]
- WhatsApp: [your-whatsapp-number]

---

Built with ❤️ for Mancinza Upholstery