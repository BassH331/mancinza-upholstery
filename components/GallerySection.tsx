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
      src: "/components/furniture_img/furniture1.jpg",
      alt: "Elegant dark sofa"
    },
    {
      src: "/components/furniture_img/furniture2.jpg", 
      alt: "Brown dining set"
    },
    {
      src: "/components/furniture_img/furniture3.jpg",
      alt: "Cozy armchair"
    },
    {
      src: "/components/furniture_img/furniture4.jpg",
      alt: "Luxury lounge"
    }
  ];

  const decorImages: ImageItem[] = [
    {
      src: "/components/decor_img/decor_img1.jpg",
      alt: "Decor setup 1"
    },
    {
      src: "/components/decor_img/decor_img2.jpg",
      alt: "Decor setup 2"
    },
    {
      src: "/components/decor_img/decor_img3.jpg",
      alt: "Decor setup 3"
    },
    {
      src: "/components/decor_img/decor_img4.jpg",
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
