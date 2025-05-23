'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import supabase from '../../../lib/supabaseClient';

export default function ProductPage({ params }) {
  const productId = params.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    async function fetchProductDetails() {
      if (!productId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Supabase'den ürün detaylarını getir
        const { data, error } = await supabase
          .from('product_table')
          .select('*')
          .eq('product_id', productId)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setProduct(data);
          // Sayfa başlığını güncelle
          document.title = `${data.title_from_amazon || 'Ürün Detayı'} - Reconus`;
        } else {
          setError('Ürün bulunamadı');
        }
      } catch (err) {
        console.error('Ürün detayları alınırken hata oluştu:', err);
        setError('Ürün bilgileri yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProductDetails();
  }, [productId]);
  
  // Yükleme durumu
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto min-h-[400px] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-600">Ürün bilgileri yükleniyor...</p>
      </div>
    );
  }
  
  // Hata durumu
  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Hata! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <div className="mt-6 text-center">
          <Link 
            href="/recommendations"
            className="text-indigo-600 hover:text-indigo-800 underline"
          >
            Önerilere Geri Dön
          </Link>
        </div>
      </div>
    );
  }
  
  // Ürün bulunamadıysa
  if (!product) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
        <p className="text-gray-600 mb-6">
          Aradığınız ürün sistemde bulunamadı. Lütfen öneriler sayfasına geri dönün.
        </p>
        <Link 
          href="/recommendations"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Önerilere Geri Dön
        </Link>
      </div>
    );
  }
  
  // Ortalama puan gösterimi
  const renderRating = () => {
    if (!product.avg_rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(product.avg_rating);
    const hasHalfStar = product.avg_rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="text-yellow-500">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-500">★</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    
    return (
      <div className="flex items-center">
        <div className="flex text-xl">{stars}</div>
        <span className="ml-2 text-gray-600">{product.avg_rating.toFixed(1)}</span>
        {product.num_reviews > 0 && (
          <span className="ml-1 text-gray-500">({product.num_reviews.toLocaleString()} değerlendirme)</span>
        )}
      </div>
    );
  };
  
  // Geri düğmesi
  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Geri düğmesi */}
      <button
        onClick={handleGoBack}
        className="mb-6 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
      >
        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Geri
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Ürün görseli */}
          <div className="relative h-80 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
            {(product.imgUrl_from_amazon && !imageError) ? (
              <Image
                src={product.imgUrl_from_amazon}
                alt={product.title_from_amazon || 'Ürün görseli'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4"
                onError={() => setImageError(true)}
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <svg 
                  className="w-24 h-24 text-gray-400" 
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
          
          {/* Ürün bilgileri */}
          <div className="flex flex-col">
            <div className="mb-2">
              <p className="text-sm text-indigo-600">{product.category_name || 'Kategori bilgisi yok'}</p>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {product.title_from_amazon || 'Ürün başlığı yok'}
            </h1>
            
            {renderRating()}
            
            <div className="mt-6">
              <p className="text-3xl font-bold text-gray-900">
                {product.median_price ? `₺${product.median_price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Fiyat bilgisi yok'}
              </p>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Toplam Satış</p>
                <p className="text-lg font-medium">{product.total_sales?.toLocaleString() || '0'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Benzersiz Alıcı</p>
                <p className="text-lg font-medium">{product.unique_buyers?.toLocaleString() || '0'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Ürün ID</p>
                <p className="text-lg font-medium truncate">{product.product_id}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-500">Ağırlık</p>
                <p className="text-lg font-medium">{product.product_weight_g ? `${product.product_weight_g}g` : 'Bilinmiyor'}</p>
              </div>
            </div>
            
            <div className="mt-8">
              <button 
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => alert('Bu bir demo uygulamasıdır. Satın alma işlemi gerçekleştirilemiyor.')}
              >
                Satın Al
              </button>
            </div>
          </div>
        </div>
        
        {/* Sistem bilgisi */}
        <div className="p-6 bg-gray-50 border-t">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Sistem Bilgisi (Demo Uygulaması)</h2>
          <p className="text-xs text-gray-500 mb-2">
            Ürün ID: {product.product_id}
          </p>
          <p className="text-xs text-gray-500 mb-2">
            Kategori ID: {product.category_id}
          </p>
          <p className="text-xs text-gray-500">
            Bu ürün Amazon veri seti kullanılarak zenginleştirilmiştir. Görsel ve başlık Amazon&apos;dan alınmıştır.
          </p>
        </div>
      </div>
    </div>
  );
} 