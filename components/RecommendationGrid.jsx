'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

export default function RecommendationGrid({ recommendations, loading, error, userId }) {
  const [sortBy, setSortBy] = useState('relevance');
  const [filterCategory, setFilterCategory] = useState('');
  
  // Yükleme durumu
  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400 mb-4"></div>
        <p className="text-secondary">Öneriler yükleniyor...</p>
      </div>
    );
  }
  
  // Hata durumu
  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative transition-theme" role="alert">
        <strong className="font-bold">Hata! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }
  
  // Veri yoksa
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-secondary border border-gray-300 dark:border-gray-700 text-primary px-4 py-5 rounded-lg text-center transition-theme">
        <p className="mb-2 text-lg font-medium">Öneri Bulunamadı</p>
        <p className="text-secondary">
          {userId 
            ? `${userId.substring(0, 8)}... için öneri bulunamadı.` 
            : 'Lütfen öneri almak için bir kullanıcı seçin.'}
        </p>
      </div>
    );
  }
  
  // Tüm kategorileri çıkart
  const categories = [...new Set(recommendations.map(product => product.category_name).filter(Boolean))];
  
  // Önerileri filtrele
  let filteredRecommendations = recommendations;
  
  if (filterCategory) {
    filteredRecommendations = recommendations.filter(product => product.category_name === filterCategory);
  }
  
  // Önerileri sırala
  const sortedRecommendations = [...filteredRecommendations];
  
  switch (sortBy) {
    case 'price-low':
      sortedRecommendations.sort((a, b) => (a.median_price || 0) - (b.median_price || 0));
      break;
    case 'price-high':
      sortedRecommendations.sort((a, b) => (b.median_price || 0) - (a.median_price || 0));
      break;
    case 'rating':
      sortedRecommendations.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
      break;
    case 'sales':
      sortedRecommendations.sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0));
      break;
    // 'relevance' varsayılan sıralama, hiçbir değişiklik yapma
    default:
      break;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-primary mb-2">
            Kişiselleştirilmiş Ürün Önerileri
          </h2>
          <p className="text-sm text-secondary">
            {userId ? `Kullanıcı ID: ${userId.substring(0, 8)}...` : 'Tüm öneriler'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center">
            <label htmlFor="categoryFilter" className="mr-2 text-sm font-medium text-secondary">
              Kategori:
            </label>
            <select
              id="categoryFilter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 bg-primary border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-theme"
            >
              <option value="">Tümü</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <label htmlFor="sortBy" className="mr-2 text-sm font-medium text-secondary">
              Sırala:
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 bg-primary border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-theme"
            >
              <option value="relevance">Öneri Sırası</option>
              <option value="price-low">Fiyat: Düşük → Yüksek</option>
              <option value="price-high">Fiyat: Yüksek → Düşük</option>
              <option value="rating">En Yüksek Puan</option>
              <option value="sales">En Çok Satan</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sortedRecommendations.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
      
      <div className="mt-4 text-sm text-secondary text-right">
        {filteredRecommendations.length} ürün gösteriliyor {recommendations.length > filteredRecommendations.length ? `(toplam ${recommendations.length} üründen)` : ''}
      </div>
    </div>
  );
} 