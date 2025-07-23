import { ImageWithFallback } from './figma/ImageWithFallback';

export default function ServicesSection() {
  const services = [
    {
      title: "Upholstery Materials",
      description: "Durable, stylish fabrics & leathers",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&h=300"
    },
    {
      title: "Car Seat Repairs",
      description: "Restore your car's interior to like-new",
      image: "https://images.pexels.com/photos/244818/pexels-photo-244818.jpeg"
    },
    {
      title: "Sofa Restoration",
      description: "Fix sagging cushions, fabrics & frames", 
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&h=300"
    },
    {
      title: "Decor for Events",
      description: "Elegant setups for any occasion",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&h=300"
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-up">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up animation-delay-100">
            From premium materials to expert repairs & decor — our craftsmanship speaks for itself.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-up animation-delay-200">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-surface/80 backdrop-blur-lg border border-border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:border-primary"
            >
              <div className="aspect-video overflow-hidden">
                <ImageWithFallback 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-medium text-foreground">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
