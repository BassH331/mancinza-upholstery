import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import BookingSection from './components/BookingSection';
import { Toaster } from './components/ui/sonner';
import { useEffect, useState } from 'react';
import { User, Wrench, Image, Mail, Calendar } from 'lucide-react';


export default function App() {
  const [currentSection, setCurrentSection] = useState<string>('about');
  const [, setIsMenuOpen] = useState(false);
  const sections = [
    { id: 'about', icon: <User className="w-4 h-4" /> },
    { id: 'services', icon: <Wrench className="w-4 h-4" /> },
    { id: 'gallery', icon: <Image className="w-4 h-4" /> },
    { id: 'contact', icon: <Mail className="w-4 h-4" /> },
    { id: 'booking', icon: <Calendar className="w-4 h-4" /> },
  ];


  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const sectionIds = ['about', 'services', 'gallery', 'contact', 'booking'];


    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Vertical dots on the right */}
      <div className="fixed inset-y-0 right-4 flex flex-col justify-center z-50 gap-4">
        {sections.map(({ id, icon }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className="flex items-center gap-2 group"
            aria-label={id}
          >
            <span
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                currentSection === id
                  ? 'bg-emerald-900 scale-125 shadow-md'
                  : 'bg-gray-400 opacity-50 group-hover:opacity-80'
              }`}
            />
            <span
              className={`transition-colors ${
                currentSection === id ? 'text-green-900' : 'text-gray-400 group-hover:text-teal-700'
              }`}
            >
              {icon}
            </span>
          </button>
        ))}
      </div>



      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <GallerySection />
      <ContactSection />
      <BookingSection />
      <Toaster />
    </div>
  );
}
