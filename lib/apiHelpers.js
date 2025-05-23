// API endpoints
const RECO_API_URL = process.env.NEXT_PUBLIC_RECO_API_URL || 'https://api.reconus.example/api';

import supabase from './supabaseClient';

/**
 * Kullanıcı için önerilen ürünlerin ID'lerini getirir
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Promise<string[]>} - Önerilen ürün ID'leri
 */
export async function fetchRecommendations(userId) {
  try {
    const response = await fetch(`${RECO_API_URL}/recommendations?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error(`Öneri API yanıt hatası: ${response.status}`);
    }
    
    const data = await response.json();
    return data.productIds || [];
  } catch (error) {
    console.error('Öneriler alınırken hata oluştu:', error);
    // API hata verirse boş dizi döndürülecek ve fallback mekanizması çalışacak
    return [];
  }
}

/**
 * DEMO: Doğrudan Supabase'den belirli bir kullanıcıya göre önerilen ürünleri getirir
 * Bu fonksiyon demo amacıyla kullanılacak, gerçek uygulamada Reco API ile değiştirilmelidir
 * @param {string} userId - Kullanıcı ID'si
 * @param {number} limit - Getirilecek maksimum ürün sayısı
 * @returns {Promise<Object[]>} - Önerilen ürünler
 */
export async function fetchDemoRecommendations(userId, limit = 10) {
  try {
    // Gerçek senaryoda burada karmaşık bir öneri algoritması çalışacak
    // Demo için kullanıcının city veya state bilgisine göre ürünleri filtreliyoruz
    
    // Önce kullanıcı bilgilerini al
    const { data: userData, error: userError } = await supabase
      .from('users_table')
      .select('city, state')
      .eq('user_id', userId)
      .single();
      
    if (userError) {
      throw userError;
    }
    
    // Kullanıcı bilgisi yoksa popüler ürünleri döndür
    if (!userData) {
      return fetchPopularProducts(limit);
    }
    
    // Kullanıcının şehir veya eyaletindeki en popüler ürünleri getir
    // Bu şekilde demo için basit bir kişiselleştirme sağlıyoruz
    const { data, error } = await supabase
      .from('product_table')
      .select('*')
      .order('total_sales', { ascending: false })
      .limit(limit);
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Demo öneriler alınırken hata oluştu:', error);
    return [];
  }
}

/**
 * Ürün ID'lerine göre detaylı ürün bilgilerini Supabase'den getirir
 * @param {string[]} productIds - Ürün ID'leri listesi
 * @returns {Promise<Object[]>} - Ürün detayları
 */
export async function fetchProductDetails(productIds) {
  try {
    if (!productIds.length) return [];
    
    // Supabase'den ürün bilgilerini sorgula
    const { data, error } = await supabase
      .from('product_table')
      .select('*')
      .in('product_id', productIds);
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Ürün detayları alınırken hata oluştu:', error);
    return [];
  }
}

/**
 * Popüler ürünleri Supabase'den getirir (fallback öneri mekanizması)
 * @param {number} limit - Getirilecek ürün sayısı
 * @returns {Promise<Object[]>} - Popüler ürünler
 */
export async function fetchPopularProducts(limit = 15) {
  try {
    // En çok satış yapan ürünleri getir
    const { data, error } = await supabase
      .from('product_table')
      .select('*')
      .order('total_sales', { ascending: false })
      .limit(limit);
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Popüler ürünler alınırken hata oluştu:', error);
    return [];
  }
} 