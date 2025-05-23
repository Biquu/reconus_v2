'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Ortalama değerlendirme puanına göre yıldız göstergesini oluştur
  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-star-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill="url(#half-star-gradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        <span className="ml-1 text-sm text-muted">
          ({product.num_reviews?.toLocaleString() || '0'})
        </span>
      </div>
    );
  };

  // Ürünün olmadığı durumu kontrol et
  if (!product) {
    return (
      <div className="card p-4 h-full flex items-center justify-center bg-opacity-80 backdrop-blur-sm">
        <p className="text-muted text-center">Ürün bilgisi mevcut değil</p>
      </div>
    );
  }

  return (
    <Link 
      href={`/product/${product.product_id}`} 
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`card flex flex-col h-full transition-all duration-300 border-opacity-50 ${isHovered ? 'border-accent border-opacity-100 scale-[1.02]' : 'border-border'}`}>
        {/* Kategori badge */}
        {product.category_name && (
          <div className="absolute top-2 left-2 z-10">
            <span className="text-xs px-2 py-1 rounded-full bg-surface-hover text-muted">
              {product.category_name}
            </span>
          </div>
        )}
        
        <div className="relative h-52 bg-surface-hover rounded-t-lg overflow-hidden group-hover:shadow-[0_0_15px_rgba(0,245,255,0.3)]">
          {(product.imgUrl_from_amazon && !imageError) ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background opacity-0 group-hover:opacity-70 transition-opacity duration-300 z-10"></div>
              <Image
                src={product.imgUrl_from_amazon}
                alt={product.title_from_amazon || 'Ürün görseli'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-muted transition-all duration-300 group-hover:text-accent" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1" 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <div className="flex-grow">
            <h3 className="text-sm font-medium mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-300">
              {product.title_from_amazon || 'Ürün başlığı yok'}
            </h3>
            
            {product.avg_rating > 0 && (
              <div className="mb-2">
                {renderRatingStars(product.avg_rating)}
              </div>
            )}
          </div>
          
          <div className="mt-3 flex justify-between items-end">
            <div className="flex flex-col">
              <p className="font-bold text-lg text-gradient">
                {product.median_price ? `₺${product.median_price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Fiyat bilgisi yok'}
              </p>
              
              {product.total_sales > 0 && (
                <div className="text-xs text-muted mt-1">
                  {product.total_sales.toLocaleString()} satış
                </div>
              )}
            </div>
            
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 