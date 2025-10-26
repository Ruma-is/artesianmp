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
      <div className="sticky top-24">
        {/* Main Image */}
        <div 
          className="relative h-[500px] bg-white rounded-2xl overflow-hidden shadow-2xl border-2 group animate-scale-in cursor-zoom-in"
          style={{ borderColor: '#e8dfd0' }}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          {displayImages[selectedImage] ? (
            <Image 
              src={displayImages[selectedImage]} 
              alt={`${title} - View ${selectedImage + 1}`} 
              fill 
              className={`object-cover transition-all duration-700 ${
                isZoomed ? 'scale-150' : 'group-hover:scale-110'
              }`}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-9xl animate-bounce-subtle">🎨</div>
            </div>
          )}
          
          {/* Handmade Badge */}
          <div className="absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-bold text-white shadow-xl backdrop-blur-sm animate-pulse-subtle"
               style={{ backgroundColor: 'rgba(146, 104, 41, 0.95)' }}>
            ✨ 100% HANDMADE
          </div>

          {/* Quality Badge */}
          <div className="absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-bold text-white shadow-xl backdrop-blur-sm"
               style={{ backgroundColor: 'rgba(34, 197, 94, 0.95)' }}>
            ✓ Quality Assured
          </div>

          {/* Image Counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded-full text-sm font-semibold text-white backdrop-blur-sm"
                 style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
              {selectedImage + 1} / {displayImages.length}
            </div>
          )}
        </div>

        {/* Image Thumbnails */}
        {displayImages.length > 1 && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {displayImages.slice(0, 4).map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative h-24 bg-white rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  selectedImage === idx 
                    ? 'ring-4 ring-[#926829] scale-105' 
                    : 'hover:border-opacity-100'
                }`}
                style={{ 
                  borderColor: selectedImage === idx ? '#926829' : '#e8dfd0'
                }}
              >
                {img ? (
                  <Image src={img} alt={`${title} thumbnail ${idx + 1}`} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-3xl">🎨</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
