export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 animate-fade-up">
          About Us
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4 animate-fade-up animation-delay-100">
          We specialize in <span className="text-primary font-medium">premium upholstery</span> — from supplying
          high-quality materials to restoring car interiors &amp; sofas.
        </p>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-up animation-delay-200">
          <span className="italic">Craftsmanship meets comfort &amp; class</span>, bringing elegance back into your spaces.
        </p>
      </div>
    </section>
  );
}
