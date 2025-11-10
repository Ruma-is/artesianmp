'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: '#faf8f5' }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 md:py-0" style={{ backgroundColor: '#926829' }}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 md:top-20 left-5 md:left-10 text-5xl md:text-7xl lg:text-9xl animate-float">🎨</div>
          <div className="absolute top-20 md:top-40 right-10 md:right-20 text-4xl md:text-6xl lg:text-8xl animate-float-delayed">✂️</div>
          <div className="absolute bottom-16 md:bottom-32 left-1/4 text-3xl md:text-5xl lg:text-7xl animate-float-slow">🧵</div>
          <div className="absolute bottom-20 md:bottom-40 right-1/4 text-3xl md:text-5xl lg:text-6xl animate-float">🪔</div>
          <div className="absolute top-1/3 right-1/3 text-4xl md:text-6xl lg:text-8xl animate-float-delayed">🏺</div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 md:px-6 max-w-6xl mx-auto">
          {/* Scroll-based Parallax Badge */}
          <div 
            className="inline-block mb-6 md:mb-8 px-4 md:px-6 py-2 md:py-3 bg-white/10 backdrop-blur-md rounded-full border-2 border-white/30 animate-fade-in"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
            <p className="text-white font-semibold text-sm md:text-base lg:text-lg">🌟 Celebrating Indian Craftsmanship Since 2024</p>
          </div>

          {/* Main Heading with Stagger Animation */}
          <div className="mb-4 md:mb-6 animate-slide-in-down">
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-3 md:mb-4 tracking-tight animate-fade-in" style={{ fontFamily: 'Georgia, serif' }}>
              Artisan Marketplace
            </h1>
            <div className="w-24 md:w-32 h-1 md:h-1.5 bg-white mx-auto rounded-full animate-expand-center"></div>
          </div>

          <p className="text-lg md:text-2xl lg:text-3xl text-gray-100 mb-4 md:mb-6 max-w-4xl mx-auto font-light leading-relaxed animate-fade-in-delay-1">
            Where Traditional Craftsmanship Meets Modern Commerce
          </p>

          <p className="text-base md:text-lg lg:text-xl text-gray-200 mb-8 md:mb-12 max-w-3xl mx-auto px-4 animate-fade-in-delay-2">
            Discover authentic handmade treasures from talented artisans across India. 
            Every purchase tells a story, preserves a tradition, and supports a dream.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/products">
              <button className="group relative px-8 md:px-10 py-3 md:py-4 bg-white text-base md:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform active:scale-95 md:hover:scale-105 md:hover:-translate-y-1 overflow-hidden w-full sm:w-auto"
                      style={{ color: '#926829', minHeight: '44px' }}>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Browse Products
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="px-8 md:px-10 py-3 md:py-4 border-3 border-white text-white text-base md:text-lg font-semibold rounded-xl hover:bg-white transition-all duration-300 transform active:scale-95 md:hover:scale-105 md:hover:-translate-y-1 shadow-lg w-full sm:w-auto"
                      style={{ borderWidth: '2px', minHeight: '44px' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#926829')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}>
                Start Selling
              </button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 md:mt-16 flex flex-wrap justify-center gap-4 md:gap-8 text-white/80 text-xs md:text-sm animate-fade-in px-4" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl">✓</span>
              <span>100% Authentic</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl">✓</span>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl">✓</span>
              <span>Pan-India Shipping</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:block absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/70 rounded-full mt-2 animate-scroll-indicator"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-20" style={{ backgroundColor: '#f5efe6' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl md:text-5xl lg:text-6xl font-bold mb-1 md:mb-2" style={{ color: '#926829' }}>500+</div>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg">Skilled Artisans</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl md:text-5xl lg:text-6xl font-bold mb-1 md:mb-2" style={{ color: '#926829' }}>2K+</div>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg">Unique Products</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl md:text-5xl lg:text-6xl font-bold mb-1 md:mb-2" style={{ color: '#926829' }}>5K+</div>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg">Happy Customers</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl md:text-5xl lg:text-6xl font-bold mb-1 md:mb-2" style={{ color: '#926829' }}>28</div>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg">States Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
              Why Choose Us
            </h2>
            <div className="w-20 md:w-24 h-1 md:h-1.5 mx-auto rounded-full animate-expand-center" style={{ backgroundColor: '#926829' }}></div>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 mt-4 md:mt-6 max-w-3xl mx-auto px-4">
              Experience the perfect blend of tradition and technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {/* For Buyers */}
            <div className="group relative bg-white p-6 md:p-10 rounded-xl md:rounded-2xl shadow-xl hover:shadow-3xl border-2 transition-all duration-500 transform active:scale-95 md:hover:scale-105 md:hover:-translate-y-2 animate-slide-up overflow-hidden"
                 style={{ 
                   borderColor: '#e8dfd0',
                   animationDelay: '0.1s'
                 }}>
              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"
                   style={{ backgroundColor: '#926829' }}></div>
              
              <div className="relative z-10">
                <div className="text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  🛍️
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                  For Buyers
                </h3>
                <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-relaxed mb-4 md:mb-6">
                  Discover unique handcrafted products and support rural artisans directly. 
                  Every purchase makes a difference.
                </p>
                <ul className="space-y-2 md:space-y-3 text-gray-600 text-sm md:text-base">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Authentic handmade products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Direct artisan support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Quality guaranteed</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* For Artisans */}
            <div className="group relative bg-white p-6 md:p-10 rounded-xl md:rounded-2xl shadow-xl hover:shadow-3xl border-2 transition-all duration-500 transform active:scale-95 md:hover:scale-105 md:hover:-translate-y-2 animate-slide-up overflow-hidden"
                 style={{ 
                   borderColor: '#e8dfd0',
                   animationDelay: '0.2s'
                 }}>
              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"
                   style={{ backgroundColor: '#926829' }}></div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  ✨
                </div>
                <h3 className="text-3xl font-bold mb-4" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                  For Artisans
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Showcase your craftsmanship to a global audience and grow your business 
                  without boundaries.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Global marketplace</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Fair pricing tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Business growth support</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* AI-Powered */}
            <div className="group relative bg-white p-10 rounded-2xl shadow-xl hover:shadow-3xl border-2 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-slide-up overflow-hidden"
                 style={{ 
                   borderColor: '#e8dfd0',
                   animationDelay: '0.3s'
                 }}>
              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"
                   style={{ backgroundColor: '#926829' }}></div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  🤖
                </div>
                <h3 className="text-3xl font-bold mb-4" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                  AI-Powered
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Leverage cutting-edge AI technology for better product discovery, 
                  pricing, and customer engagement.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Smart recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Multilingual chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Dynamic pricing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 relative overflow-hidden" style={{ backgroundColor: '#926829' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-5xl md:text-7xl lg:text-9xl animate-float">🎯</div>
          <div className="absolute bottom-10 left-10 text-5xl md:text-7xl lg:text-9xl animate-float-delayed">💝</div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6 animate-fade-in" style={{ fontFamily: 'Georgia, serif' }}>
            Ready to Begin Your Journey?
          </h2>
          <p className="text-base md:text-xl lg:text-2xl text-gray-100 mb-6 md:mb-10 animate-fade-in-delay-1 px-4">
            Join thousands of artisans and buyers in celebrating traditional craftsmanship
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/auth/signup">
              <button className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 bg-white text-base md:text-lg lg:text-xl font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform active:scale-95 md:hover:scale-110 md:hover:-translate-y-2"
                      style={{ color: '#926829', minHeight: '44px' }}>
                Get Started Today
              </button>
            </Link>
            <Link href="/products">
              <button className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 border-3 border-white text-white text-base md:text-lg lg:text-xl font-semibold rounded-xl hover:bg-white transition-all duration-300 transform active:scale-95 md:hover:scale-110 md:hover:-translate-y-2 shadow-lg"
                      style={{ borderWidth: '2px', minHeight: '44px' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#926829')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}>
                Explore Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 text-center text-gray-600" style={{ backgroundColor: '#f5efe6' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <p className="text-base md:text-lg mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            <span style={{ color: '#926829', fontWeight: 'bold' }}>Artisan Marketplace</span> - Preserving Traditions, Empowering Communities
          </p>
          <p className="text-xs md:text-sm">© 2025 All rights reserved. Made with ❤️ for artisans.</p>
        </div>
      </footer>
    </div>
  );
}

