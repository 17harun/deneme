# 🛠️ Hilal Teknik — Görsel Hataları ve GitHub Pages Test Raporu

**Proje:** Hilal Teknik Kurumsal Web Sitesi  
**GitHub Deposu:** [https://github.com/17harun/dayi_proje](https://github.com/17harun/dayi_proje)  
**Canlı Yayın (GitHub Pages):** [https://17harun.github.io/dayi_proje/](https://17harun.github.io/dayi_proje/)  
**Tarih:** 21 Ekim 2026  
**Denetim & Test Türü:** Statik Varlık Denetimi, Canlı HTTP HEAD Doğrulaması, Yerel HTTP Sunucu Testi (Port 8888), Headless Tarayıcı & Konsol Testi  

---

## 1. 📌 Yönetici Özeti ve Temel Teşhis

Yapılan otomatik ve manuel teknik incelemeler sonucunda; yerel çalışma alanındaki (Localhost) kodların ve dosyaların **tamamen eksiksiz ve hatasız çalıştığı**, ancak GitHub Pages üzerindeki canlı sitede görsellerin kırık görünmesinin **3 temel kök nedeni** somut kanıtlarla tespit edilmiştir:

1. **GitHub Deposunun Güncel Olmaması (Eksik Varlıklar):**
   Yerel çalışma alanında üretilmiş ve optimize edilmiş olan `hilal-logo-emblem.png`, `hilal-logo-emblem.webp`, `ambient_crescent_bg.webp`, `ambient_crescent_bg.jpg` ve galeri `.webp` görselleri GitHub deposuna **hiç push edilmemiştir**. Yerel Git yapılandırmasında `remote origin` tanımlanmamış ve yerel değişiklikler commit/push edilmeden kalmıştır.
2. **Uzantı Uyuşmazlığı (.webp vs .jpg):**
   Canlı sitedeki HTML kodları modern `.webp` görsellerini talep etmekte; ancak GitHub deposunda yalnızca eski `.jpg` dosyaları bulunmaktadır.
3. **Linux Dosya Sistemi & Türkçe Karakter Uyuşmazlığı (`bakım_arıza` vs `bakim_ariza`):**
   GitHub üzerindeki klasör adı `RESIMLER/bakım_arıza` (Türkçe `ı` karakterli) iken, kaynak kodlar Linux/Web standartlarına uygun `RESIMLER/bakim_ariza` yolunu istemektedir.

---

## 2. 🔍 Tespit Edilen Sorunlar ve Kök Neden Analizi

### 2.1. Header Bölümündeki Hilal Teknik Amblemi Görünmüyor
- **Kullanıcı Belirtisi:** Header'da amblem alanı boş kalıyor veya kırık resim simgesi çıkıyor.
- **Canlı Site Testi:**
  ```http
  HEAD https://17harun.github.io/dayi_proje/RESIMLER/hilal-logo-emblem.webp -> HTTP/1.1 404 Not Found
  HEAD https://17harun.github.io/dayi_proje/RESIMLER/hilal-logo-emblem.png  -> HTTP/1.1 404 Not Found
  ```
- **Kök Neden:** GitHub API (`/repos/17harun/dayi_proje/contents/RESIMLER`) incelendiğinde, depodaki `RESIMLER` klasöründe amblem dosyalarının hiç bulunmadığı kanıtlanmıştır.
- **Yerel Durum:** `RESIMLER/hilal-logo-emblem.webp` (13.3 KB) ve `RESIMLER/hilal-logo-emblem.png` (102.2 KB) dosyaları yerel diskte mevcuttur. Yerel HTTP sunucusunda `HTTP 200 OK` ile sorunsuz yüklenmektedir.

### 2.2. Ana Sayfa Arka Plan Görseli Görünmüyor
- **Kullanıcı Belirtisi:** Ana sayfanın arkasındaki hilal kavisli lüks arka plan dokusu görünmüyor, düz renk çıkıyor.
- **Canlı Site Testi:**
  ```http
  HEAD https://17harun.github.io/dayi_proje/RESIMLER/ambient_crescent_bg.webp -> HTTP/1.1 404 Not Found
  HEAD https://17harun.github.io/dayi_proje/RESIMLER/ambient_crescent_bg.jpg  -> HTTP/1.1 404 Not Found
  ```
- **Kök Neden:** `style.css` içerisinde `.ambient-bg-art` sınıfında tanımlı olan `url('RESIMLER/ambient_crescent_bg.jpg')` ve `image-set(...)` dosyaları GitHub deposuna yüklenmemiştir.
- **Yerel Durum:** `ambient_crescent_bg.webp` (84.1 KB) ve `ambient_crescent_bg.jpg` (169.0 KB) yerel diskte mevcuttur ve yerel tarayıcı testinde arka plan kusursuz biçimde çizilmektedir.

### 2.3. Galeri Sayfasındaki Fotoğraflar Açılmıyor
- **Kullanıcı Belirtisi:** Galeri ızgarasında fotoğraflar boş kutular olarak görünüyor.
- **Canlı Site Testi:**
  ```http
  HEAD https://17harun.github.io/dayi_proje/RESIMLER/kombi_kurulum/IMG-20250812-WA0041.webp -> HTTP/1.1 404 Not Found
  HEAD https://17harun.github.io/dayi_proje/RESIMLER/kombi_kurulum/IMG-20250812-WA0041.jpg  -> HTTP/1.1 200 OK (Mevcut!)
  HEAD https://17harun.github.io/dayi_proje/RESIMLER/bakim_ariza/IMG-20250812-WA0043.webp   -> HTTP/1.1 404 Not Found
  HEAD https://17harun.github.io/dayi_proje/RESIMLER/bak%C4%B1m_ar%C4%B1za/IMG-20250812-WA0043.jpg -> HTTP/1.1 200 OK (Mevcut!)
  ```
- **Kök Neden:**
  1. GitHub deposunda görseller yalnızca `.jpg` uzantısıyla bulunmaktadır; yerel ortamda üretilen `.webp` sürümleri GitHub'a gönderilmemiştir.
  2. Bakım/arıza klasörü GitHub'da `bakım_arıza` (Türkçe karakter) olarak kalmıştır. Linux sunucularda `bakim_ariza` yolu `bakım_arıza` klasörünü bulamaz ve 404 verir.
- **Yerel Durum:** Yerel diskte `bakim_ariza` (34 dosya: 17 JPG + 17 WebP) ve `kombi_kurulum` (26 dosya: 13 JPG + 13 WebP) eksiksiz olarak hazırdır.

### 2.4. GitHub Pages Alt Dizin (Subpath `dayi_proje`) Uyum Analizi
- **Denetim:** Kaynak kodlarda kökten başlayan (`/RESIMLER/...`, `/style.css`) gibi mutlak yollar arandı.
- **Sonuç:** Yapılan taramada **0 adet hatalı mutlak yol** bulundu. Kaynak kodlardaki tüm yollar göreceli (`RESIMLER/...`, `style.css`) olarak yazılmıştır. Bu sayede site `https://17harun.github.io/dayi_proje/` alt dizini altında link kırılması yaşamadan çalışmaktadır.

### 2.5. GitHub Pages Jekyll Çakışması
- **Sorun:** GitHub Pages varsayılan olarak Jekyll derleyicisi çalıştırır. Jekyll ise `_headers` ve `_redirects` gibi alt tire ile başlayan dosyaları yok sayar.
- **Çözüm:** Depo kök dizinine `.nojekyll` dosyası eklenerek Jekyll devre dışı bırakılmıştır.

---

## 3. 📊 Karşılaştırmalı Referans Tablosu (Örnekler)

| Varlık / Konum | Canlı Sitedeki Eski Durum | Yerel Kod ve Disk Durumu | Durum |
| :--- | :--- | :--- | :--- |
| **Amblem (WebP)** | GitHub'da dosya yok (404) | `RESIMLER/hilal-logo-emblem.webp` (13.3 KB) | MEVCUT (Push bekliyor) |
| **Amblem (PNG)** | GitHub'da dosya yok (404) | `RESIMLER/hilal-logo-emblem.png` (102.2 KB) | MEVCUT (Push bekliyor) |
| **Arka Plan (WebP)**| GitHub'da dosya yok (404) | `RESIMLER/ambient_crescent_bg.webp` (84.1 KB) | MEVCUT (Push bekliyor) |
| **Arka Plan (JPG)** | GitHub'da dosya yok (404) | `RESIMLER/ambient_crescent_bg.jpg` (169.0 KB) | MEVCUT (Push bekliyor) |
| **Kombi Kurulum WA0041** | Sadece .jpg var (WebP 404) | Hem `.webp` (93 KB) hem `.jpg` (133 KB) var | MEVCUT (Push bekliyor) |
| **Bakım Arıza WA0043** | `bakım_arıza` klasöründe .jpg var | `bakim_ariza` içinde hem `.webp` hem `.jpg` var | MEVCUT (Push bekliyor) |
| **Favicon 32x32** | GitHub'da yok (404) | `RESIMLER/favicon-32x32.png` (3.1 KB) | MEVCUT (Push bekliyor) |

*(Tüm 109 görsel referansının tam dökümü [GORSEL_REFERANSLARI.csv](file:///c:/Users/Harun/Desktop/H%C4%B0LAL%20TEKN%C4%B0K/H%C4%B0LAL%20TEKN%C4%B0K/GORSEL_REFERANSLARI.csv) dosyasında sunulmuştur).*

---

## 4. 🧪 Otomatik Test Sonuçları

### A. Yerel Dosya Sistemi Denetimi
- **Taranan HTML Dosyaları:** 6 adet (`index.html`, `galeri.html`, `hakkimizda.html`, `hizmetlerimiz.html`, `iletisim.html`, `404.html`)
- **Taranan CSS & JS Dosyaları:** 3 adet (`style.css`, `site-config.js`, `analytics.js`)
- **Toplam Denetlenen Görsel Referansı:** 109 adet
- **Yerel Diskte Mevcut Olma Oranı:** **%100 (109 / 109)**
- **Büyük/Küçük Harf Uyuşmazlığı:** 0 adet

### B. Yerel HTTP Sunucu Testi (Port 8888)
Python dahili HTTP sunucusu üzerinden tüm sayfalar ve varlıklar HTTP istekleriyle test edilmiştir:
- `GET /index.html` $\rightarrow$ **HTTP 200 OK** (31,954 bytes)
- `GET /galeri.html` $\rightarrow$ **HTTP 200 OK** (55,556 bytes)
- `GET /RESIMLER/hilal-logo-emblem.webp` $\rightarrow$ **HTTP 200 OK** (13,378 bytes)
- `GET /RESIMLER/ambient_crescent_bg.webp` $\rightarrow$ **HTTP 200 OK** (84,174 bytes)
- `GET /RESIMLER/kombi_kurulum/IMG-20250812-WA0041.webp` $\rightarrow$ **HTTP 200 OK** (93,356 bytes)
- `GET /RESIMLER/bakim_ariza/IMG-20250812-WA0043.webp` $\rightarrow$ **HTTP 200 OK** (159,956 bytes)
- `GET /style.css` $\rightarrow$ **HTTP 200 OK** (188,081 bytes)
- **Sonuç:** Tüm yerel varlıklar eksiksiz HTTP 200 yanıtı vermiştir.

### C. Headless Tarayıcı Görsel ve Konsol Testi (Browser Subagent)
- **Ana Sayfa (Masaüstü & Mobil):**
  - Header Logo Amblemi: **Görünür, net, kırık simge yok.**
  - Ambient Arka Plan Katmanı: **Görünür, kavis ve ışık geçişleri aktif.**
  - Konsol Hataları: **0 adet 404, 0 adet JavaScript hatası.**
- **Galeri Sayfası (Masaüstü & Mobil):**
  - Galeri Izgarası: **30 fotoğrafın tamamı eksiksiz ve orantılı yüklendi.**
  - Lightbox (Büyütme Modu): **Tıklanan görsel tam ekran olarak açıldı, ileri/geri okları ve kapatma butonu çalıştı.**
  - Konsol Hataları: **0 adet 404, 0 adet JavaScript hatası.**
- **Kaydedilen Kanıtlar:** Tarayıcı oturumuna ait ekran görüntüleri ve WebP video kaydı artifact dizininde saklanmıştır.

---

## 5. 🚀 GitHub Pages'e Dağıtım İçin Yapılması Gerekenler

Mevcut yerel çalışma alanı %100 kusursuz ve yayına hazırdır. Canlı sitedeki tüm sorunların çözülmesi için aşağıdaki Git adımlarının uygulanması yeterlidir:

> [!NOTE]
> Proje kuralları gereği, onayınız olmadan otomatik `git commit` veya `git push` **çalıştırılmamıştır**. Aşağıdaki komutları terminalinizde çalıştırarak canlı siteyi anında düzeltebilirsiniz:

```bash
# 1. Proje dizinine gidin
cd "c:\Users\Harun\Desktop\HİLAL TEKNİK\HİLAL TEKNİK"

# 2. Eğer uzak GitHub bağlantısı (remote origin) tanımlı değilse ekleyin:
git remote add origin https://github.com/17harun/dayi_proje.git

# 3. Tüm yeni WebP görsellerini, logoları ve güncellenen sayfaları sahneye ekleyin:
git add .

# 4. Değişiklikleri commit edin:
git commit -m "fix: add missing webp gallery images, header emblem, ambient background and .nojekyll for GitHub Pages"

# 5. GitHub'a gönderin (ana dalınız main veya master ise):
git branch -M main
git push -u origin main --force
```

*(Not: Eğer GitHub'daki varsayılan dalınız `master` ise `git push -u origin master` komutunu kullanabilirsiniz).*

---

## 6. 🛡️ Bilinen Riskler ve İleriye Dönük Tavsiyeler

1. **GitHub Pages Önbellek Süresi:** `git push` yapıldıktan sonra GitHub Pages'in CDN önbelleğini yenilemesi 1-3 dakika sürebilir. Tarayıcınızda `Ctrl + F5` ile sert yenileme yaparak test ediniz.
2. **Görsel Fallback Güvencesi:** `galeri.html` içerisindeki evrensel `error` dinleyicisi korunmuştur. Eski tarayıcılarda WebP desteklenmese dahi otomatik olarak JPG/PNG yedeğine geçiş sağlanmaktadır.
3. **Özel Alan Adı (Custom Domain):** İleride `https://hilalteknik.com` alan adı bağlandığında, kök dizinde bulunan `CNAME` dosyası korunmalı ve linklerin göreceli yapısı bozulmamalıdır.
