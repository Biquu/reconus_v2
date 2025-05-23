'use client';

import { useState, useEffect } from 'react';
import { fetchRecommendations, fetchProductDetails, fetchPopularProducts, fetchDemoRecommendations } from '../lib/apiHelpers';

// Demo modu aktif mi? (Gerçek API yerine Supabase'den demo verisi kullanılacak)
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || true;

/**
 * Belirli bir kullanıcı için ürün önerilerini getiren custom hook
 * @param {string} userId - Kullanıcı ID'si
 * @param {number} fallbackLimit - Yeterli öneri yoksa getirilecek popüler ürün sayısı
 * @returns {Object} - Öneriler, yükleme durumu ve hata bilgisi
 */
export default function useRecommendations(userId, fallbackLimit = 15) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kullanıcı ID yoksa işlem yapmayız
    if (!userId) {
      return;
    }

    const fetchRecommendedProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let products = [];
        
        if (DEMO_MODE) {
          // Demo modu: Supabase'den doğrudan ürünleri getir
          products = await fetchDemoRecommendations(userId, fallbackLimit);
        } else {
          // Normal mod: Reco API -> Ürün ID'leri -> Supabase'den detaylar
          const productIds = await fetchRecommendations(userId);
          
          if (productIds.length > 0) {
            products = await fetchProductDetails(productIds);
          }
          
          // Yeterli öneri yoksa, popüler ürünlerle tamamla
          if (products.length < fallbackLimit) {
            const neededCount = fallbackLimit - products.length;
            const popularProducts = await fetchPopularProducts(neededCount);
            
            // Mevcut önerilerde olmayan popüler ürünleri ekle
            const existingIds = products.map(p => p.product_id);
            const filteredPopular = popularProducts.filter(p => !existingIds.includes(p.product_id));
            
            products = [...products, ...filteredPopular];
          }
        }
        
        setRecommendations(products);
      } catch (err) {
        console.error('Öneriler alınırken hata oluştu:', err);
        setError('Önerileri alırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [userId, fallbackLimit]);

  return { recommendations, loading, error };
} 