/**
 * Öneri API servisi
 * Bu servis, kullanıcılara özel ürün önerileri için API ile iletişim kurar
 */

// API'nin URL'si - CORS sorunu için proxy kullanıyoruz
const RECO_API_URL = '/api';

/**
 * Kullanıcı için önerileri getir
 * @param {string} userId - Önerileri almak istediğimiz kullanıcının ID'si
 * @param {number} limit - Kaç öneri istediğimiz (varsayılan: 10)
 * @returns {Promise<Array>} - Önerilen ürünlerin listesi
 */
export async function getRecommendationsForUser(userId, limit = 10) {
  if (!userId) {
    throw new Error('Kullanıcı ID\'si gereklidir');
  }

  try {
    // URL nesnesi yerine string kullanıyoruz
    const url = `${RECO_API_URL}/reco_api/${userId}?limit=${limit}&include_product_details=true`;
    
    console.log('Calling API with URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API yanıt hatası: ${response.status}`);
    }

    const data = await response.json();
    // API'nin yanıt formatına göre uygun alan adını kullan (recommendations veya products)
    return data.recommendations || data.products || [];
  } catch (error) {
    console.error('Öneri motorundan veri alınırken hata oluştu:', error);
    throw error;
  }
}

/**
 * Birlikte satın alınan ürünleri getir
 * @param {string} userId - Kullanıcının ID'si
 * @param {number} limit - Kaç ürün istediğimiz
 * @returns {Promise<Array>} - Birlikte satın alınan ürünlerin listesi
 */
export async function getBoughtTogetherProducts(userId, limit = 15) {
  if (!userId) {
    throw new Error('Kullanıcı ID\'si gereklidir');
  }

  try {
    // URL nesnesi yerine string kullanıyoruz
    const url = `${RECO_API_URL}/bought_together/${userId}?limit=${limit}`;
    
    console.log('Calling API with URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API yanıt hatası: ${response.status}`);
    }

    const data = await response.json();
    
    // API yanıtının yapısını konsola yazdır (hata ayıklama için)
    console.log('Birlikte satın alınan ürünler API yanıtı:', data);
    
    // API yanıtında farklı alanları kontrol et
    if (data.products && Array.isArray(data.products)) {
      return data.products;
    } else if (data.recommendations && Array.isArray(data.recommendations)) {
      return data.recommendations;
    } else if (data.items && Array.isArray(data.items)) {
      return data.items;
    } else if (Array.isArray(data)) {
      // Doğrudan dizi dönüyorsa
      return data;
    } else {
      // Diğer olası veri yapıları
      const possibleArrayFields = Object.keys(data).find(key => Array.isArray(data[key]));
      if (possibleArrayFields) {
        return data[possibleArrayFields];
      }
    }
    
    // Hiçbir uygun alan bulunamadıysa boş dizi döndür
    console.warn('Birlikte satın alınan ürünler API yanıtında beklenen veri yapısı bulunamadı:', data);
    return [];
  } catch (error) {
    console.error('Birlikte satın alınan ürünler alınırken hata:', error);
    throw error;
  }
}

/**
 * Kullanıcının kategorilerine göre popüler ürünleri getir
 * @param {string} userId - Kullanıcının ID'si
 * @param {number} limit - Kaç ürün istediğimiz
 * @returns {Promise<Array>} - Popüler ürünlerin listesi
 */
export async function getUserPopularProducts(userId, limit = 15) {
  if (!userId) {
    throw new Error('Kullanıcı ID\'si gereklidir');
  }

  try {
    // URL nesnesi yerine string kullanıyoruz
    const url = `${RECO_API_URL}/user_popular/${userId}?limit=${limit}`;
    
    console.log('Calling API with URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API yanıt hatası: ${response.status}`);
    }

    const data = await response.json();
    // API'nin yanıt formatına göre uygun alan adını kullan
    return data.products || data.recommendations || [];
  } catch (error) {
    console.error('Kullanıcı kategori ürünleri alınırken hata:', error);
    throw error;
  }
}

/**
 * Belirli bir kategorideki popüler ürünleri getir
 * @param {string} categoryName - Kategori adı
 * @param {number} limit - Kaç ürün istediğimiz
 * @returns {Promise<Array>} - Popüler ürünlerin listesi
 */
export async function getCategoryPopularProducts(categoryName, limit = 15) {
  if (!categoryName) {
    throw new Error('Kategori adı gereklidir');
  }

  try {
    // URL nesnesi yerine string kullanıyoruz
    const url = `${RECO_API_URL}/popular/${categoryName}?limit=${limit}`;
    
    console.log('Calling API with URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API yanıt hatası: ${response.status}`);
    }

    const data = await response.json();
    // API'nin yanıt formatına göre uygun alan adını kullan
    return data.products || data.recommendations || [];
  } catch (error) {
    console.error('Kategori ürünleri alınırken hata:', error);
    throw error;
  }
}

/**
 * Kullanıcı için önerileri ve satın alma geçmişini karşılaştırır
 * @param {string} userId - Kullanıcının ID'si
 * @param {Array} purchasedProducts - Kullanıcının satın aldığı ürünler
 * @param {number} limit - Kaç öneri istediğimiz
 * @returns {Promise<Object>} - Öneriler ve satın alınan ürünler
 */
export async function getRecommendationsWithHistory(userId, purchasedProducts, limit = 10) {
  try {
    // Öneri motorundan önerileri al
    const recommendations = await getRecommendationsForUser(userId, limit);
    
    // Satın alınanlar ve öneriler arasında karşılaştırma yap
    const purchasedIds = new Set(purchasedProducts.map(p => p.product_id));
    
    // Satın alınmamış önerileri filtrele
    const newRecommendations = recommendations.filter(
      rec => !purchasedIds.has(rec.product_id)
    );
    
    return {
      recommendations: newRecommendations,
      purchasedProducts
    };
  } catch (error) {
    console.error('Öneriler ve geçmiş karşılaştırılırken hata:', error);
    throw error;
  }
}

/**
 * Tüm öneri tiplerini tek bir fonksiyonla getir
 * @param {string} userId - Kullanıcının ID'si
 * @param {number} limit - Her bir öneri tipinden kaç ürün istediğimiz
 * @returns {Promise<Array>} - Çeşitli kaynaklardan gelen önerilerin listesi
 */
export async function getDetailedRecommendations(userId, limit = 10) {
  if (!userId) {
    throw new Error('Kullanıcı ID\'si gereklidir');
  }

  try {
    // Tüm öneri API'lerine paralel istekler gönder
    const [personalRecommendations, boughtTogetherProducts, userPopularProducts] = await Promise.all([
      getRecommendationsForUser(userId, limit),
      getBoughtTogetherProducts(userId, limit),
      getUserPopularProducts(userId, limit)
    ]);

    // Hata durumunda boş diziler kullan
    const safePersonalRecs = Array.isArray(personalRecommendations) ? personalRecommendations : [];
    const safeBoughtTogether = Array.isArray(boughtTogetherProducts) ? boughtTogetherProducts : [];
    const safeUserPopular = Array.isArray(userPopularProducts) ? userPopularProducts : [];

    // Tüm önerileri birleştir ve her öneriye tipi ekle
    const taggedPersonalRecs = safePersonalRecs.map(item => ({
      ...item,
      recommendation_type: 'personal',
      recommendation_label: 'Kişiselleştirilmiş Öneri'
    }));

    const taggedBoughtTogether = safeBoughtTogether.map(item => ({
      ...item,
      recommendation_type: 'bought_together',
      recommendation_label: 'Birlikte Satın Alınanlar'
    }));

    const taggedPopular = safeUserPopular.map(item => ({
      ...item,
      recommendation_type: 'user_popular',
      recommendation_label: 'İlgilenebileceğiniz Kategoriler'
    }));

    // Tüm önerileri birleştir
    const allRecommendations = [
      ...taggedPersonalRecs,
      ...taggedBoughtTogether,
      ...taggedPopular
    ];

    // Önerileri product_id'ye göre benzersiz hale getir (varsa birden fazla kaynaktan gelen)
    const uniqueRecommendations = Array.from(
      new Map(allRecommendations.map(item => [item.product_id, item])).values()
    );

    return uniqueRecommendations;
  } catch (error) {
    console.error('Detaylı öneriler alınırken hata oluştu:', error);
    // Hata oluşsa bile boş dizi dön
    return [];
  }
}