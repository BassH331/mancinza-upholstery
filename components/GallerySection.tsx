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
      src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&h=400",
      alt: "Elegant dark sofa"
    },
    {
      src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&h=400", 
      alt: "Brown dining set"
    },
    {
      src: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=500&h=400",
      alt: "Cozy armchair"
    },
    {
      src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=500&h=400",
      alt: "Luxury lounge"
    }
  ];

  const decorImages: ImageItem[] = [
    {
      src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=500&h=400",
      alt: "Decor setup 1"
    },
    {
      src: "https://images.unsplash.com/photo-1519167758481-83f29d8ae8e0?auto=format&fit=crop&w=500&h=400",
      alt: "Decor setup 2"
    },
    {
      src: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=500&h=400",
      alt: "Decor setup 3"
    },
    {
      src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&h=400",
      alt: "Decor setup 4"
    }
  ];

  return (
  <div className="py-20 bg-[#f4f6fa]">
    {/* Furniture Gallery */}
    <section id="gallery" className="container mx-auto px-4 mb-16 bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-[#2f2f3a] mb-4">Furniture Gallery</h2>
        <button
          onClick={() => setShowFurnitureGallery(!showFurnitureGallery)}
          className="inline-block px-6 py-2 text-sm font-medium text-white bg-[#7c6de4] rounded-full shadow-sm hover:bg-[#6252c8] transition"
        >
          {showFurnitureGallery ? 'Hide Gallery' : 'Show Gallery'}
        </button>
      </div>

      {showFurnitureGallery && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {furnitureImages.map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
    </section>

    {/* Event Decor Gallery */}
    <section id="decor-gallery" className="container mx-auto px-4 bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-[#2f2f3a] mb-4">Event Decor Gallery</h2>
        <button
          onClick={() => setShowDecorGallery(!showDecorGallery)}
          className="inline-block px-6 py-2 text-sm font-medium text-white bg-[#7c6de4] rounded-full shadow-sm hover:bg-[#6252c8] transition"
        >
          {showDecorGallery ? 'Hide Gallery' : 'Show Gallery'}
        </button>
      </div>

      {showDecorGallery && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {decorImages.map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
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
    </section>
  </div>
);}
