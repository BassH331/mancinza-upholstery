'use client';

import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function GallerySection() {
  const [showFurnitureGallery, setShowFurnitureGallery] = useState(true);
  const [showDecorGallery, setShowDecorGallery] = useState(true);

  type ImageItem = {
    src: string;
    alt: string;
  };

  const furnitureImages: ImageItem[] = [
  {
    src: "https://i.imgur.com/6L0COIZ.jpeg",
    alt: "Elegant dark sofa"
  },
  {
    src: "https://i.imgur.com/LD7ndbL.jpeg",
    alt: "Brown dining set"
  },
  {
    src: "https://i.imgur.com/C9SEtzi.jpeg",
    alt: "Cozy armchair"
  },
  {
    src: "https://i.imgur.com/Tb7JiKK.jpeg",
    alt: "Luxury lounge"
  }
];




   const decorImages = [
    {
      title: "Upholstery Materials",
      description: "Durable, stylish fabrics & leathers",
      image: "https://i.imgur.com/HtqUwJ6.jpeg"
    },
    {
      title: "Car Seat Repairs",
      description: "Restore your car's interior to like-new",
      image: "https://i.postimg.cc/g0XsYTN5/decor-img2.jpg"
    },
    {
      title: "Sofa Restoration",
      description: "Fix sagging cushions, fabrics & frames", 
      image: "https://i.postimg.cc/t4P7pdFk/decor-img3.jpg"
    },
    {
      title: "Decor for Events",
      description: "Elegant setups for any occasion",
      image: "https://i.postimg.cc/ZKv5xPsm/decor-img4.jpg"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Furniture Gallery */}
        <div className="mb-16 bg-surface/80 backdrop-blur-md rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-up">
              Furniture Gallery
            </h2>
            <p className="text-muted-foreground mb-4 animate-fade-up animation-delay-100">
              See examples of our <span className="text-primary font-medium">premium furniture restoration</span>.
            </p>
            <button
              onClick={() => setShowFurnitureGallery(!showFurnitureGallery)}
              className="px-6 py-2 text-sm font-medium text-white bg-green-900 rounded-full shadow-sm hover:bg-primary/80 transition animate-fade-up animation-delay-200"
            >
              {showFurnitureGallery ? 'Hide Gallery' : 'Show Gallery'}
            </button>
          </div>

          {showFurnitureGallery && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-up animation-delay-300">
              {furnitureImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
                >
                  <ImageWithFallback
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Decor Gallery */}
        <div className="bg-surface/80 backdrop-blur-md rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-up">
              Event Decor Gallery
            </h2>
            <p className="text-muted-foreground mb-4 animate-fade-up animation-delay-100">
              Elegant <span className="text-primary font-medium">decor setups</span> for any occasion.
            </p>
            <button
              onClick={() => setShowDecorGallery(!showDecorGallery)}
              className="px-6 py-2 text-sm font-medium text-white bg-green-900 rounded-full shadow-sm hover:bg-primary/80 transition animate-fade-up animation-delay-200"
            >
              {showDecorGallery ? 'Hide Gallery' : 'Show Gallery'}
            </button>
          </div>

          {showDecorGallery && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-up animation-delay-300">
              {decorImages.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
                >
                  <ImageWithFallback
                    src={image.image}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
