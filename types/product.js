/**
 * Ürün verisi
 * @typedef {Object} Product
 * @property {string} product_id - Ürün ID
 * @property {number} category_id - Kategori ID
 * @property {string} category_name - Kategori adı
 * @property {string} title_from_amazon - Zenginleştirilmiş ürün başlığı
 * @property {string} imgUrl_from_amazon - Zenginleştirilmiş ürün görseli URL'i
 * @property {number} median_price - Medyan fiyat
 * @property {number} avg_rating - Ortalama değerlendirme puanı
 * @property {number} num_reviews - Değerlendirme sayısı
 * @property {number} total_sales - Toplam satış sayısı
 * @property {number} unique_buyers - Benzersiz alıcı sayısı
 * @property {number} product_weight_g - Ürün ağırlığı (gram)
 */

/**
 * Örnek ürün nesnesi
 * @type {Product}
 */
export const sampleProduct = {
  product_id: "sample-product-id",
  category_id: 1,
  category_name: "Elektronik",
  title_from_amazon: "Örnek Ürün Başlığı",
  imgUrl_from_amazon: "https://example.com/image.jpg",
  median_price: 299.99,
  avg_rating: 4.5,
  num_reviews: 120,
  total_sales: 1500,
  unique_buyers: 1350,
  product_weight_g: 500
};

// Bu model JSDoc kullandığından, referans olması için export edildi
// JavaScript'te gerçek bir tip tanımlaması olmadığından, bu modeli yalnızca
// belgelendirme amaçlı kullanacağız. 