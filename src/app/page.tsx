'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#926829' }}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-9xl animate-float">🎨</div>
          <div className="absolute top-40 right-20 text-8xl animate-float-delayed">✂️</div>
          <div className="absolute bottom-32 left-1/4 text-7xl animate-float-slow">🧵</div>
          <div className="absolute bottom-20 right-1/3 text-8xl animate-float-slow-delayed">🪡</div>
          <div className="absolute top-1/3 right-1/4 text-6xl animate-float">🏺</div>
          <div className="absolute bottom-1/3 left-1/3 text-7xl animate-float-delayed">🪔</div>
        </div>

        {/* Parallax Background Elements */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          {/* Main Heading with Stagger Animation */}
          <div className="mb-6 animate-slide-in-down">
            <h1 className="text-7xl md:text-8xl font-bold text-white mb-4 tracking-tight animate-fade-in" style={{ fontFamily: 'Georgia, serif' }}>
              Artisan Marketplace
            </h1>
            <div className="w-32 h-1.5 bg-white mx-auto rounded-full animate-expand-center"></div>
          </div>

          <p className="text-2xl md:text-3xl text-gray-100 mb-6 max-w-4xl mx-auto font-light leading-relaxed animate-fade-in-delay-1">
            Where Traditional Craftsmanship Meets Modern Commerce
          </p>

          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto animate-fade-in-delay-2">
            Discover authentic handmade treasures from talented artisans across India. 
            Every purchase tells a story, preserves a tradition, and supports a dream.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/products">
              <button className="group relative px-10 py-4 bg-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
                      style={{ color: '#926829' }}>
                <span className="relative z-10 flex items-center gap-2">
                  Browse Products
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="group relative px-10 py-4 border-3 border-white text-white text-lg font-semibold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl"
                      style={{ borderWidth: '2px' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#926829')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}>
                <span className="flex items-center gap-2">
                  Join as Artisan
                  <span className="transform group-hover:translate-x-1 transition-transform">✨</span>
                </span>
              </button>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
            <div className="text-white text-sm mb-2 opacity-75">Scroll to explore</div>
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1.5 h-3 bg-white rounded-full mt-2 animate-scroll-indicator"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative" style={{ backgroundColor: '#f5efe6' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '500+', label: 'Artisans', icon: '👨‍🎨' },
              { number: '2000+', label: 'Products', icon: '🎨' },
              { number: '50+', label: 'States', icon: '📍' },
              { number: '10k+', label: 'Happy Customers', icon: '⭐' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-scale-in border-2"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  borderColor: '#e8dfd0'
                }}
              >
                <div className="text-5xl mb-3 animate-bounce-subtle">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
              Why Choose Us
            </h2>
            <div className="w-24 h-1.5 mx-auto rounded-full animate-expand-center" style={{ backgroundColor: '#926829' }}></div>
            <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
              Experience the perfect blend of tradition and technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* For Buyers */}
            <div className="group relative bg-white p-10 rounded-2xl shadow-xl hover:shadow-3xl border-2 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-slide-up overflow-hidden"
                 style={{ 
                   borderColor: '#e8dfd0',
                   animationDelay: '0.1s'
                 }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"
                   style={{ backgroundColor: '#926829' }}></div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  🛍️
                </div>
                <h3 className="text-3xl font-bold mb-4" style={{ color: '#926829', fontFamily: 'Georgia, serif' }}>
                  For Buyers
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Discover unique handcrafted products and support rural artisans directly. 
                  Every purchase makes a difference.
                </p>
                <ul className="space-y-3 text-gray-600">
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
            <div className="group relative bg-white p-10 rounded-2xl shadow-xl hover:shadow-3xl border-2 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-slide-up overflow-hidden"
                 style={{ 
                   borderColor: '#e8dfd0',
                   animationDelay: '0.2s'
                 }}>
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
                  Smart pricing, multilingual support, and personalized recommendations 
                  powered by advanced AI.
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
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#926829' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-9xl animate-float">🎯</div>
          <div className="absolute bottom-10 left-10 text-9xl animate-float-delayed">💝</div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in" style={{ fontFamily: 'Georgia, serif' }}>
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl md:text-2xl text-gray-100 mb-10 animate-fade-in-delay-1">
            Join thousands of artisans and buyers in celebrating traditional craftsmanship
          </p>
          <div className="flex flex-wrap justify-center gap-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <Link href="/auth/signup">
              <button className="px-12 py-5 bg-white text-xl font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2"
                      style={{ color: '#926829' }}>
                Get Started Today
              </button>
            </Link>
            <Link href="/products">
              <button className="px-12 py-5 border-3 border-white text-white text-xl font-semibold rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 shadow-lg"
                      style={{ borderWidth: '2px' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#926829')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}>
                Explore Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-600" style={{ backgroundColor: '#f5efe6' }}>
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-lg mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            <span style={{ color: '#926829', fontWeight: 'bold' }}>Artisan Marketplace</span> - Preserving Traditions, Empowering Communities
          </p>
          <p className="text-sm">© 2025 All rights reserved. Made with ❤️ for artisans.</p>
        </div>
      </footer>
    </div>
  );
}
