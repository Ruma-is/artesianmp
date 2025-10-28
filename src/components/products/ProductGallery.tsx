'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: string[]
  title: string
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const displayImages = images && images.length > 0 ? images : ['']

  return (
    <div className="animate-slide-in-left">
      <div className="lg:sticky lg:top-24">
        {/* Main Image */}
        <div 
          className="relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl border-2 group animate-scale-in cursor-zoom-in"
          style={{ borderColor: '#e8dfd0' }}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          {displayImages[selectedImage] ? (
            <Image 
              src={displayImages[selectedImage]} 
              alt={`${title} - View ${selectedImage + 1}`} 
              fill 
              className={`object-cover transition-all duration-700 ${
                isZoomed ? 'scale-150' : 'md:group-hover:scale-110'
              }`}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl animate-bounce-subtle">🎨</div>
            </div>
          )}
          
          {/* Handmade Badge */}
          <div className="absolute top-3 left-3 md:top-6 md:left-6 px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold text-white shadow-xl backdrop-blur-sm animate-pulse-subtle"
               style={{ backgroundColor: 'rgba(146, 104, 41, 0.95)' }}>
            ✨ 100% HANDMADE
          </div>

          {/* Quality Badge */}
          <div className="absolute top-3 right-3 md:top-6 md:right-6 px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold text-white shadow-xl backdrop-blur-sm"
               style={{ backgroundColor: 'rgba(34, 197, 94, 0.95)' }}>
            ✓ Quality Assured
          </div>

          {/* Image Counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-3 right-3 md:bottom-6 md:right-6 px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-semibold text-white backdrop-blur-sm"
                 style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
              {selectedImage + 1} / {displayImages.length}
            </div>
          )}
        </div>

        {/* Image Thumbnails */}
        {displayImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2 md:gap-4 mt-3 md:mt-4">
            {displayImages.slice(0, 4).map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative h-16 sm:h-20 md:h-24 bg-white rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 transform md:hover:scale-105 active:scale-95 ${
                  selectedImage === idx 
                    ? 'ring-2 md:ring-4 ring-[#926829] scale-105' 
                    : 'md:hover:border-opacity-100'
                }`}
                style={{ 
                  borderColor: selectedImage === idx ? '#926829' : '#e8dfd0'
                }}
              >
                {img ? (
                  <Image src={img} alt={`${title} thumbnail ${idx + 1}`} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xl md:text-3xl">🎨</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
