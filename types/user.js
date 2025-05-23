/**
 * Kullanıcı olayları
 * @typedef {Object} UserEvents
 * @property {string[]} view - Görüntülenen ürün ID'leri
 * @property {string[]} click - Tıklanan ürün ID'leri
 * @property {string[]} like - Beğenilen ürün ID'leri
 */

/**
 * Kullanıcı satın alma bilgisi
 * @typedef {Object} PurchaseInfo
 * @property {string} product_id - Ürün ID
 * @property {number} price - Satın alma fiyatı
 * @property {number} review_score - Değerlendirme puanı
 * @property {string} timestamp - Satın alma zamanı
 */

/**
 * Kullanıcı verisi
 * @typedef {Object} User
 * @property {string} user_id - Kullanıcı ID (UUID)
 * @property {string} city - Şehir
 * @property {string} state - Eyalet/İl
 * @property {number} total_orders - Toplam sipariş sayısı
 * @property {number} total_items - Toplam satın alınan ürün sayısı
 * @property {number} avg_rating - Ortalama değerlendirme puanı
 * @property {string} last_purchase_ts - Son satın alma zaman damgası
 * @property {UserEvents} events_json - Kullanıcı etkinlikleri
 * @property {PurchaseInfo[]} purchased_json - Satın alınan ürünler
 */

/**
 * Örnek kullanıcı nesnesi
 * @type {User}
 */
export const sampleUser = {
  user_id: "sample-user-uuid",
  city: "İstanbul",
  state: "Marmara",
  total_orders: 15,
  total_items: 25,
  avg_rating: 4.2,
  last_purchase_ts: "2023-05-23T14:30:00Z",
  events_json: {
    view: ["product-1", "product-2", "product-3"],
    click: ["product-1", "product-3"],
    like: ["product-1"]
  },
  purchased_json: [
    {
      product_id: "product-1",
      price: 129.99,
      review_score: 4,
      timestamp: "2023-05-23T14:30:00Z"
    }
  ]
};

// Bu model JSDoc kullandığından, referans olması için export edildi
// JavaScript'te gerçek bir tip tanımlaması olmadığından, bu modeli yalnızca
// belgelendirme amaçlı kullanacağız. 