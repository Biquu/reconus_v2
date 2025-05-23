# reco_api Öneri Motoru için Prompt

## Genel Bakış
reco_api, kullanıcılara kişiselleştirilmiş ürün önerileri sunmak için tasarlanmış bir öneri motorudur. Bu prompt, reco_api'nin nasıl çalışması gerektiğini ve web projemizle nasıl entegre edileceğini açıklar.

## İstek Formatı
reco_api'ye yapılan istekler aşağıdaki formatta olacaktır:

```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "limit": 10,
  "include_product_details": true
}
```

- `user_id`: Öneriler istenen kullanıcının benzersiz tanımlayıcısı
- `limit`: İstenen öneri sayısı (varsayılan: 10)
- `include_product_details`: Öneri yanıtında ürün detaylarının dahil edilip edilmeyeceği

## Yanıt Formatı
reco_api'den beklenen yanıt formatı:

```json
{
  "recommendations": [
    {
      "product_id": "PROD12345",
      "title_from_amazon": "Ürün Adı",
      "category_name": "Elektronik",
      "category_id": "CAT123",
      "avg_rating": 4.5,
      "num_reviews": 120,
      "median_price": 299.99,
      "imgUrl_from_amazon": "https://example.com/product-image.jpg",
      "product_weight_g": 350,
      "recommendation_score": 0.89,
      "recommendation_reason": "Bu ürün kullanıcının satın alma geçmişine benzer ürünlere dayanarak önerilmiştir."
    },
    // ... diğer öneriler
  ],
  "metadata": {
    "model_version": "1.0.0",
    "recommendation_timestamp": "2023-05-01T12:00:00Z",
    "processing_time_ms": 150
  }
}
```

## Öneri Algoritması için Beklentiler

Öneri motoru aşağıdaki özelliklere sahip olmalıdır:

1. **Kullanıcı Geçmişine Dayalı Öneriler**:
   - Kullanıcının satın alma geçmişini analiz et
   - Benzer demografik özelliklere sahip diğer kullanıcıların satın aldığı ürünleri öner
   - Satın alınan ürünlerle benzer kategorilerdeki ürünleri öner

2. **Özellik Tabanlı Eşleştirme**:
   - Kullanıcının satın aldığı ürünlerin özelliklerini analiz et
   - Benzer özelliklere sahip ama farklı ürünleri öner

3. **Çeşitlilik**:
   - Önerilerin çeşitli kategorilerde olmasını sağla
   - Kullanıcının daha önce keşfetmediği yeni ürün kategorilerini de dahil et

4. **Ürün Detayları**:
   - Her önerilen ürün için tam ürün bilgilerini sağla (fiyat, resim, açıklama, vb.)
   - Ürün önerilme nedenini açıkla

5. **Özelleştirilebilirlik**:
   - İstek parametrelerine bağlı olarak öneri sayısı ve detay seviyesini ayarla

## Entegrasyon Detayları

Web projemiz, reco_api ile şu şekilde entegre edilecektir:

1. Kullanıcı, öneriler sayfasında "Önerileri Gör" butonuna tıklar
2. Frontend, kullanıcı ID'sini reco_api'ye gönderir
3. reco_api, kullanıcı için kişiselleştirilmiş önerileri hesaplar ve döndürür
4. Frontend, bu önerileri kullanıcıya görsel olarak sunar

## Önemli Notlar

- reco_api, sorgu başına maksimum 1 saniyede yanıt vermelidir
- Kullanıcı satın alma geçmişi veritabanında saklanmaktadır
- API yanıtları önbelleğe alınabilir, ancak önbellekler 24 saatte bir güncellenmelidir
- Ürün bilgileri, fiyatlar ve stok durumu güncel olmalıdır
- API, mevcut olmayan bir kullanıcı ID'si gönderildiğinde uygun bir hata mesajı döndürmelidir

## Test Senaryoları

API'nin doğru çalıştığını doğrulamak için kullanılabilecek test senaryoları:

1. Satın alma geçmişi olan bir kullanıcı için öneriler istemek
2. Satın alma geçmişi olmayan yeni bir kullanıcı için öneriler istemek
3. Geçersiz bir kullanıcı ID'si ile istek yapmak
4. Farklı `limit` değerleriyle istekler yapmak
5. `include_product_details` parametresini true ve false olarak test etmek 